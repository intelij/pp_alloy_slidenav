function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.leftTableView = Ti.UI.createTableView({
        rowHeight: "44dp",
        top: "100",
        zIndex: 1,
        id: "leftTableView"
    });
    $.__views.leftTableView && $.addTopLevelView($.__views.leftTableView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.leftTableView.applyProperties({
        width: .84 * Ti.Platform.displayCaps.platformWidth,
        zIndex: 0
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;