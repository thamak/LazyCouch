// import * as http from "http";
// import * as url from "url";
import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as errorHandler from "errorhandler";
import * as methodOverride from "method-override";

import { Parameter } from "./server/Parameter";

import * as routes from "./routes/index";
// import * as db from "./database/db";

let app = express();

// Configuration
app.set("views", "./views");
app.set("view engine", "jade");
app.set("view options", { layout: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + "/public"));

let env = process.env.NODE_ENV || "development";
if (env === "development") {
    app.use(errorHandler());
}

// Routes
app.get("/", routes.index);

app.listen(4000, () => {
    console.log("LazyCouch server listening on port %d in %s mode", 4000, app.settings.env);

    let myParam = new Parameter();
    console.log(myParam.getValue("hello"));
});

export let App = app;