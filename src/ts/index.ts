import {Edm, odata, ODataController, ODataServer, ODataErrorHandler, ODataHttpContext, HttpRequestError} from "odata-v4-server";
import * as express from "express";
import * as passport from "passport";
//import {BasicStrategy} from "passport-http";
//import {Strategy} from "passport-cookie";
import {STATUS_CODES} from "http";
import {ErpServer} from "./server";

const app = express();
var CookieStrategy = require('passport-cookie').Strategy;

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

class AuthenticationError extends HttpRequestError{
  constructor() {
    super(401, STATUS_CODES[401]);
  }
}

/*passport.use(new BasicStrategy((userid:string, password:string, done:(error:any, user?:any) => void) => {
  if (userid == "admin" && password == "admin") return done(null, "admin");
  done(new AuthenticationError());
}));*/

//к лупбэку обращаться через express get/post

passport.use(new CookieStrategy({key: 'auth'},
  function(token, done) {
    console.log(token);
    /*User.findByToken({ token: token }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }*/
      return done(null, true);
    //});
  }
));

app.use(
  passport.authenticate("cookie", {session: false}),
  //passport.authenticate("basic", {session: false, failWithError: true}),
  ErpServer.create(),
  ODataErrorHandler
);

app.listen(3001);
