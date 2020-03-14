import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import * as handlers from "./handlers/index";
const {receiveWebhook} = require('@shopify/koa-shopify-webhooks');
const fs = require('fs');


dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev
});

// FIREBASE
var firebase = require("firebase-admin");
var serviceAccount = require("../firebaseConfig.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://shopify-timer.firebaseio.com/"
});
var db = firebase.database();
var db_ref = db.ref("/");


const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES, HOST } = process.env;
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(session(server));
  server.keys = [SHOPIFY_API_SECRET];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("accessToken", accessToken, {
          httpOnly: false,
        });
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
        });

        // check whether user already exists
        const file_name = shop.replace('.myshopify.com', '') + ".js";
        var user_exists = false
        if (fs.existsSync('timer/' + file_name)) {
          user_exists = true
        }

        if (!user_exists) {
          // register webhooh
          handlers.registerWebhooks(shop, accessToken, 'APP_UNINSTALLED', "/webhooks/app/uninstalled", ApiVersion.October19)

          // create timer file for user
          fs.writeFile("timer/" + file_name, '', function (err) {
            if (err) console.log("Timer-file creation error: " + err)
          })

          // create script tag
          const createScriptTagUrl = 'https://' + shop + '/admin/api/2019-07/script_tags.json';
          const shopRequestHeaders = {
            'X-Shopify-Access-Token': accessToken,
          };
          const scriptTagSource = HOST + '/' + file_name;
          const scriptTagBody = {
            "script_tag": {
              "event": "onload",
              "src": scriptTagSource
            }
          }
          const request = require('request')
          request.post({
            url: createScriptTagUrl,
            body: scriptTagBody,
            headers: shopRequestHeaders,
            json: true
          }, function(error, response, body) {
            if (error) console.log(error)
          });
        }

        ctx.redirect("/");
      }
    })
  );

  server.use(
    graphQLProxy({
      version: ApiVersion.October19
    })
  );

  // url for timer folder
  var serve = require('koa-static');
  server.use(serve('timer'));

  // listening for app uninstalled
  const webhook = receiveWebhook({secret: SHOPIFY_API_SECRET});
  router.post('/webhooks/app/uninstalled', webhook, (ctx) => {
    const id = ctx.state.webhook['payload']['myshopify_domain'].replace('.myshopify.com', '')
    console.log("Uninstalled: " + id)
    // remove data from Firebase
    db_ref.child(id).remove()
    // delete .js file
    fs.unlink("timer/" + id + ".js", (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
  });

  // getting user data from FireBase
  router.get('/api/userdata', async (ctx) => {
    const shopID = ctx.cookies.get('shopOrigin').replace('.myshopify.com', '');

    const response = await db_ref.child(shopID).once("value")
    if(response.val() == undefined) {
      ctx.body = {}
    } else {
      ctx.body = response.val()
    }
  })

  // listening for POST
  const bodyParser = require('koa-body')()
  router.post('/api/postdata', bodyParser, async ctx => {
    // posting data to Firebase
    const id = ctx.cookies.get('shopOrigin').replace('.myshopify.com', '');
    var data = ctx.request.body.data
    delete data.showToast
    delete data.saving
    await db_ref.child(id).set(data)

    // updating user .js file
    var fs = require('fs');
    const file_name = "timer/" + id + ".js";
    if (!data.enabled) {
      fs.writeFile(file_name, '', function (err) {
        if (err) console.log("Timer-file clearing error: " + err)
      })
    } else {
      console.log("update: " + id)

      const { renderString, renderTemplateFile } = require('template-file')
      data.color.saturation = data.color.saturation * 100
      data.color.brightness = data.color.brightness * 100
      data.HOST = HOST
      renderTemplateFile('timer/timer.js', data)
        .then(renderedString => {
          fs.writeFile(file_name, renderedString, function (err) {
            if (err) console.log("Timer-file updating error: " + err)
          })
        })
    }

    ctx.res.statusCode = 200;
  })


  router.get("*", verifyRequest(), async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});




// ---------------- REST API -------------------

// router.get('/api/shopOrigin', async (ctx) => {
//   ctx.body = {
//     status: 'success',
//     data: ctx.cookies.get('shopOrigin')
//   };
// })
//
// router.get('/api/:object', async (ctx) => {
//   try {
//     const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2019-07/" + ctx.params.object + ".json", {
//       headers: {
//         "X-Shopify-Access-Token": ctx.cookies.get('accessToken')
//       },
//     })
//     .then(response => response.json())
//     .then(json => {
//       return json;
//     });
//     ctx.body = {
//       status: 'success',
//       data: results
//     };
//   } catch (err) {
//     console.log(err)
//   }
// })




//
// ------------ FIREBASE METHODS -------------
//
// ref.update({
//   3: {
//     color: {
//       alpha: 0,
//       brightness: 0,
//       hue: 0,
//       saturation: 0
//     },
//     enabled: false,
//     text: "Alan Turing3"
//   }
// });

// var usersRef = ref.child("users");
// usersRef.set({
//   alanisawesome: {
//     date_of_birth: "June 23, 1912",
//     full_name: "Alan Turing"
//   },
//   gracehop: {
//     date_of_birth: "December 9, 1906",
//     full_name: "Grace Hopper"
//   }
// });

// var data_from_DB = {}
// ref.once("value", function(snapshot) {
//   data_from_DB = snapshot.val();
// });










//
// ------------ EXPRESS LISTENING FOR REQUESTS ---------------
//
// const express = require('express');
// const app2 = express();
// const port2 = 5500;

// // console.log that your server is up and running
// app2.listen(port2, () => console.log(`Listening on port ${port2}`));

// // create a GET route
// app2.get('/express_backend', (req, res) => {
//   res.send({ "express": "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
// });




