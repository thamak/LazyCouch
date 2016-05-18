"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const routes = require("./routes/index");
var app = express();
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
app.get('/', routes.index);
app.listen(4000, () => {
    console.log("LazyCouch server listening on port %d in %s mode", 4000, app.settings.env);
    console.log("test", 4000, app.settings.env);
});
exports.App = app;
//# sourceMappingURL=app.js.map