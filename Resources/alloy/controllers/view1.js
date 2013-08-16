function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.view1 = Ti.UI.createView({
        id: "view1"
    });
    $.__views.view1 && $.addTopLevelView($.__views.view1);
    $.__views.__alloyId10 = Ti.UI.createLabel({
        text: "View 1",
        id: "__alloyId10"
    });
    $.__views.view1.add($.__views.__alloyId10);
    $.__views.newView = Ti.UI.createButton({
        id: "newView",
        title: "Open New Window"
    });
    $.__views.view1.add($.__views.newView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.CFG.mainWindow.title = "Propertypond";
    $.newView.addEventListener("click", function() {
        var navWindow = Alloy.CFG.mainNavGroup;
        var newWin = Alloy.createController("newWin").getView();
        navWindow.open(newWin);
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;