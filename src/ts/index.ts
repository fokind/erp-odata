import {Edm, odata, ODataController, ODataServer, ODataErrorHandler, ODataHttpContext, HttpRequestError} from "odata-v4-server";
import * as express from "express";
import * as passport from "passport";
import {BasicStrategy} from "passport-http";
import {STATUS_CODES} from "http";
import {ErpServer} from "./server";

const app = express();

/*class AuthenticationError extends HttpRequestError{
  constructor() {
    super(401, STATUS_CODES[401]);
  }
}

passport.use(new BasicStrategy((userid:string, password:string, done:(error:any, user?:any) => void) => {
  if (userid == "admin" && password == "admin") return done(null, "admin");
  done(new AuthenticationError());
}));*/

//к лупбэку обращаться через express get/post

app.use(
  //passport.authenticate("basic", {session: false, failWithError: true}),
  ErpServer.create(),
  ODataErrorHandler
);

app.listen(3001);
