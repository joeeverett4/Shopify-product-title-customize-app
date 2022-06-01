// @ts-check
import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import { Metafield } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";
import "dotenv/config";
import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import Shop from "../server/models/Shop.js";
import connectDB from "../config/db.js";
const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.PORT || "8081", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: async (topic, shop, body) => {
    delete ACTIVE_SHOPIFY_SHOPS[shop];
  },
});

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();

  connectDB();
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app);

  app.post("/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      res.status(500).send(error.message);
    }
  });

  app.get("/products-count", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });
    res.status(200).send(countData);
  });

  app.get("/get-products", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    const { shop: shopOrigin, accessToken } = session;
    console.log("get-products");
    const shop = await Shop.findOne({
      shopify_domain: shopOrigin,
    });
    res.status(200).send(shop);
  });

  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.use(express.json());

  app.post("/deletemeta", async (req, res) => {
    try {
      let metafieldsToDelete = req.body;
      const session = await Shopify.Utils.loadCurrentSession(req, res, true);
      await Promise.all(
        metafieldsToDelete.map(async (meta, i) => {
          let productMetas = await Metafield.all({
            session: session,
          });
         
          /* console.log("thisw iss  " + JSON.stringify(productMetas[0].value))
     console.log("this is   " + JSON.stringify(productMetas[0].id)) */

          let isDelete = await Metafield.delete({
            session: session,
            id: productMetas[i].id,
          });

          console.log("is deleted" + JSON.stringify(isDelete));
        })
      );
      res.status(200).send(req.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post("/mongo", async (req, res) => {
    const msg = JSON.stringify(req.body);
    
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    const { shop: shopOrigin, accessToken } = session;

    await Shop.findOneAndUpdate(
      { shopify_domain: shopOrigin },
      { products: req.body }
    );

    let potentialProducts = req.body;
    
    let hello;
    potentialProducts.map(async (msgs, i) => {
      
      let image = msgs.images[0].originalSrc;
      let title = msgs.title;
      let vendor = msgs.vendor;
      let newTitle = msgs.newTitle;
      let colNumber = potentialProducts.length;
      let finalStr = image.concat(title,vendor)
      let newStr = `${image},${title},${vendor},${newTitle},${colNumber}`

           

      const metafield = new Metafield({ session: session });
      metafield.namespace = "inventer";
      metafield.key = `text_field${i}`;
      metafield.type = "single_line_text_field";
      // metafield.product_id = Number(msgs.id.split("/").pop());
      metafield.value = newStr;
      await metafield.save({});
    });
  });

  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  app.use("/*", (req, res, next) => {
    const shop = req.query.shop;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    if (app.get("active-shopify-shops")[shop] === undefined && shop) {
      res.redirect(`/auth?shop=${shop}`);
    } else {
      next();
    }
  });

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    app.use(compression());
    app.use(serveStatic(resolve("dist/client")));
    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
    });
  }

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => app.listen(PORT));
}
