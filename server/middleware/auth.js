import { Shopify } from "@shopify/shopify-api";
import {Product} from '@shopify/shopify-api/dist/rest-resources/2022-04/index.js';
import fetch from 'isomorphic-fetch';
import topLevelAuthRedirect from "../helpers/top-level-auth-redirect.js";
import Shop from "../models/shop.js"
export default function applyAuthMiddleware(app) {
  app.get("/auth", async (req, res) => {
    if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
      return res.redirect(`/auth/toplevel?shop=${req.query.shop}`);
    }

   

    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      "/auth/callback",
      app.get("use-online-tokens")
    );

    res.redirect(redirectUrl);
  });

  app.get("/auth/toplevel", (req, res) => {
    res.cookie(app.get("top-level-oauth-cookie"), "1", {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
    });

    res.set("Content-Type", "text/html");

    res.send(
      topLevelAuthRedirect({
        apiKey: Shopify.Context.API_KEY,
        hostName: Shopify.Context.HOST_NAME,
        shop: req.query.shop,
      })
    );
  });

  app.get("/auth/callback", async (req, res) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
      );

      const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
      const data = await client.query({
        data: `{
            productByHandle(handle:"floral-white-top") {
              title
              description
              tags

          }
        }`,
      });
      const dataJson = JSON.stringify(data)
      

   const { shop: shopOrigin, accessToken } = session
   
    const cusresponse = await fetch(
      `https://${session.shop}/admin/api/2022-01/shop.json`, {
        credentials: 'include',
        headers: {
          'X-Shopify-Access-Token': session.accessToken,
          'Content-Type': 'application/json',
        },
      },
    );
    const jsonData = await cusresponse.json();

    const strJsonData = jsonData.shop

    

   const checkShop =  await Shop.findOne({
    shopify_domain : shopOrigin
    }) 
   
    if(!checkShop){
    const shop = new Shop({
      shopify_domain: shopOrigin,
      accessToken,
      isActive: false,
      strJsonData
    })
  
    const savedShop = await shop.save();
  }
    

      const host = req.query.host;
      app.set(
        "active-shopify-shops",
        Object.assign(app.get("active-shopify-shops"), {
          [session.shop]: session.scope,
        })
      );

      const response = await Shopify.Webhooks.Registry.register({
        shop: session.shop,
        accessToken: session.accessToken,
        topic: "APP_UNINSTALLED",
        path: "/webhooks",
      });

      if (!response["APP_UNINSTALLED"].success) {
        console.log(
          `Failed to register APP_UNINSTALLED webhook: ${response.result}`
        );
      }

      // Redirect to app with shop parameter upon auth
      res.redirect(`/?shop=${session.shop}&host=${host}`);
    } catch (e) {
      switch (true) {
        case e instanceof Shopify.Errors.InvalidOAuthError:
          res.status(400);
          res.send(e.message);
          break;
        case e instanceof Shopify.Errors.CookieNotFound:
        case e instanceof Shopify.Errors.SessionNotFound:
          // This is likely because the OAuth session cookie expired before the merchant approved the request
          res.redirect(`/auth?shop=${req.query.shop}`);
          break;
        default:
          res.status(500);
          res.send(e.message);
          break;
      }
    }
  });
}
