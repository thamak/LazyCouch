"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var errorHandler = require("errorhandler");
var methodOverride = require("method-override");
var Parameter_1 = require("./server/Parameter");
var routes = require("./routes/index");
var app = express();
app.set("views", "./views");
app.set("view engine", "jade");
app.set("view options", { layout: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname));
var env = process.env.NODE_ENV || "development";
if (env === "development") {
    app.use(errorHandler());
}
app.get("/", routes.index);
app.listen(4000, function () {
    console.log("LazyCouch server listening on port %d in %s mode", 4000, app.settings.env);
    var myParam = new Parameter_1.Parameter();
    console.log(myParam.getValue("hello"));
});
exports.App = app;
//# sourceMappingURL=app.js.map
