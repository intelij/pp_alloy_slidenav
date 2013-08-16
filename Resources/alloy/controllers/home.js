function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.home = Ti.UI.createView({
        id: "home"
    });
    $.__views.home && $.addTopLevelView($.__views.home);
    var __alloyId4 = [];
    $.__views.timap = Ti.Map.createView({
        annotations: __alloyId4,
        ns: Ti.Map,
        id: "timap"
    });
    $.__views.home.add($.__views.timap);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.CFG.mainWindow.title = "Propertypond";
    var filterButton = Ti.UI.createButton({
        title: "Filter"
    });
    Alloy.CFG.mainWindow.rightNavButton = filterButton;
    filterButton.addEventListener("click", function() {
        alert("Filter Search");
    });
    Ti.App.addEventListener("sliderToggled", function(e) {
        $.timap.touchEnabled = e.hasSlided ? false : true;
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;