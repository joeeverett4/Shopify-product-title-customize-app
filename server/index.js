// @ts-check
import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import { Metafield } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";
import { Theme } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";
import { Asset } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";
import { ScriptTag } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";
import {Image} from '@shopify/shopify-api/dist/rest-resources/2022-04/index.js';
import "dotenv/config";
import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import Shop from "../server/models/Shop.js";
import connectDB from "../config/db.js";
import { Console } from "console";
import { liq } from "../src/assets/snippet.js"
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
   console.log("get products  " + shopOrigin)
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

  app.post("/enablemeta", async (req, res) => {
    try {
      console.log("hello world")
      console.log(req.body.body)
     const metasession = await Shopify.Utils.loadCurrentSession(req, res);
     const { shop: shopOrigin, accessToken } = metasession;
     console.log("metashop  " + metasession)

      const enablemetafield = new Metafield({ session: metasession });
      enablemetafield.namespace = "check";
      enablemetafield.key = `enabled`;
      enablemetafield.type = "single_line_text_field";
      // metafield.product_id = Number(msgs.id.split("/").pop());
      enablemetafield.value = req.body.body;
      await enablemetafield.save({});
      res.end();
    } catch (error) {
      console.log("enable error")
      res.status(500).send(error.message);
    }
  });


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

  app.post("/createmeta", async (req, res) => {
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
     // console.log("width  " + JSON.stringify(msgs))
      let ImageID = msgs.images[0].id.split("/").pop()
      let productID = msgs.id.split("/").pop()
   let imageMain =  await Image.find({
        session: session,
        product_id: productID,
        id: ImageID,
      });
      
      console.log(imageMain.id)
      let imageWidth = imageMain.width;
      let imageHeight = imageMain.height;
      let image = msgs.images[0].originalSrc;
      let title = msgs.title;
      let price = msgs.variants[0].price;
      let vendor = msgs.vendor;
      let newTitle = msgs.newTitle;
      let colNumber = potentialProducts.length;
      let custommsg = msgs.message;
      let newStr = `${image},${title},${vendor},${newTitle},${colNumber},${custommsg},${price},${imageWidth},${imageHeight}`;
      console.log("this is mesaages  " + newStr);
      const metafield = new Metafield({ session: session });
      metafield.namespace = "inventer";
      metafield.key = `text_field${i}`;
      metafield.type = "single_line_text_field";
      // metafield.product_id = Number(msgs.id.split("/").pop());
      metafield.value = newStr;
      await metafield.save({});

      res.end()
    });
  });

  app.get("/scripttag", async (req, res) => {
   /* const newsession = await Shopify.Utils.loadCurrentSession(req, res, true);
    console.log(liq)
    const script_tag = new ScriptTag({ session: newsession });
    script_tag.event = "onload";
    script_tag.src = "https://app.staticsave.com/appforapp/fourth.js";
    await script_tag.save({});
    res.end() */
/*const newsession = await Shopify.Utils.loadCurrentSession(req, res, true);
 const sctags =  await ScriptTag.all({
  session: newsession,
});
 console.log("this is scripttags  " + JSON.stringify(sctags))
sctags.map(async (r)=>{
console.log(r.id)
let result = await ScriptTag.delete({
  session: newsession,
  id: r.id,
});
console.log(result)
})
res.end();*/

  });

  app.get("/api/store/themes/main", verifyRequest(app), async (req, res) => {
    const newsession = await Shopify.Utils.loadCurrentSession(req, res, true);
    let themes = await Theme.all({
      session: newsession,
    });
    const publishedTheme = themes.find((theme) => theme.role === "main");

    const assets = await Asset.all({
      session: newsession,
      theme_id: `${publishedTheme.id}`,
    });

    const templateJSONFiles = assets.filter((file) => {
      return ["index"].some(
        (template) => file.key === `templates/${template}.json`
      );
    });
    const templateJSONAssetContents = await Promise.all(
      templateJSONFiles.map(async (file) => {
        const asset = await Asset.all({
          session: newsession,
          theme_id: `${publishedTheme.id}`,
          asset: { key: file.key },
        });

        return asset[0].value;
      })
    );
    // Find what section is set as 'main' for each template JSON's body
    const templateMainSections = templateJSONAssetContents
      .map((asset, index) => {
        const json = JSON.parse(asset);

        const main = json.sections;
        const keys = Object.keys(main);
        const res = keys.map((m) => m.replace("_", "-"));
        const mainSection = res[0];
        return assets.find(
          (file) => file.key === `sections/${mainSection}.liquid`
        );
      })
      .filter((value) => value);

    // Request the content of each section and check if it has a schema that contains a
    // block of type '@app'
    const sectionsWithAppBlock = (
      await Promise.all(
        templateMainSections.map(async (file, index) => {
          let acceptsAppBlock = false;

        const asst = await Asset.all({
            session: newsession,
            theme_id: `${publishedTheme.id}`,
            asset: { key: file.key },
          });

          const section = new Asset({session: newsession});
section.theme_id = publishedTheme.id;
section.key = "sections/hello.liquid";
section.value = liq;
const redult = await section.save({});

console.log("this si resulto  " + redult)

          const match = asst[0].value.match(
            /\{\%\s+schema\s+\%\}([\s\S]*?)\{\%\s+endschema\s+\%\}/m
          );
          const schema = JSON.parse(match[1]);

          if (schema && schema.blocks) {
            acceptsAppBlock = schema.blocks.some((b) => b.type === "@app");
          }
          
          return acceptsAppBlock ? file : null;
        })
      )
    ).filter((value) => value);

    // console.log("this is withAppBlock  " + sectionsWithAppBlock)
    console.log("this is  json asset contents  " + templateJSONAssetContents.length)

    res.status(200).send(themes);
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
