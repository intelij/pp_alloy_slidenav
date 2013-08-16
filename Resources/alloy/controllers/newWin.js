function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.newWins = Ti.UI.createWindow({
        id: "newWins",
        navBarHidden: "false",
        zIndex: "1000",
        backgroundColor: "white"
    });
    $.__views.newWins && $.addTopLevelView($.__views.newWins);
    $.__views.__alloyId9 = Ti.UI.createLabel({
        text: "test",
        id: "__alloyId9"
    });
    $.__views.newWins.add($.__views.__alloyId9);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;