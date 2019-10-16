import * as bodyParser from 'body-parser';
import { Router } from 'express';
import session from "express-session";
import passport from "passport";

// API keys and Passport configuration
import * as passportConfig from "../config/passport";

export function facebookRouter() {
  const router = Router();
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

  router.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET
    })
  );
  router.use(passport.initialize());
  router.use(passport.session());
  router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
  router.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user && req.path.startsWith('/api/')) 
    {
      res.status(401).send('Login first');
      return;
    }

    if (
      !req.user &&
      req.path !== "/login" &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)
    ) {
      req.session.returnTo = req.path;
    } else if (req.user && req.path == "/account") {
      req.session.returnTo = req.path;
    }
    next();
  });

  router.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: "email" })
  );
  
  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/games",
      failureRedirect: "/login"
    }),
    function(req, res) {
      res.redirect("/");
    }
  );
  
  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
  
  router.get("/games", passportConfig.isAuthenticated, (req, res, next) => {
    // console.log("#####", req.user.emails[0].value);
    console.log(`NODE_ENV: ${process.env}`);
    next();
  });

  return router;
}
