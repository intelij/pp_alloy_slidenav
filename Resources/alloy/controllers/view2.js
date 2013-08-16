function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.view2 = Ti.UI.createView({
        id: "view2"
    });
    $.__views.view2 && $.addTopLevelView($.__views.view2);
    $.__views.sectionFruit = Ti.UI.createTableViewSection({
        id: "sectionFruit",
        headerTitle: "Fruit"
    });
    var __alloyId11 = [];
    __alloyId11.push($.__views.sectionFruit);
    $.__views.__alloyId12 = Ti.UI.createTableViewRow({
        title: "Apple",
        id: "__alloyId12"
    });
    $.__views.sectionFruit.add($.__views.__alloyId12);
    $.__views.__alloyId13 = Ti.UI.createTableViewRow({
        title: "Bananas",
        id: "__alloyId13"
    });
    $.__views.sectionFruit.add($.__views.__alloyId13);
    $.__views.sectionVeg = Ti.UI.createTableViewSection({
        id: "sectionVeg",
        headerTitle: "Vegetables"
    });
    __alloyId11.push($.__views.sectionVeg);
    $.__views.__alloyId14 = Ti.UI.createTableViewRow({
        title: "Carrots",
        id: "__alloyId14"
    });
    $.__views.sectionVeg.add($.__views.__alloyId14);
    $.__views.__alloyId15 = Ti.UI.createTableViewRow({
        title: "Potatoes",
        id: "__alloyId15"
    });
    $.__views.sectionVeg.add($.__views.__alloyId15);
    $.__views.sectionFish = Ti.UI.createTableViewSection({
        id: "sectionFish",
        headerTitle: "Fish"
    });
    __alloyId11.push($.__views.sectionFish);
    $.__views.__alloyId16 = Ti.UI.createTableViewRow({
        title: "Cod",
        id: "__alloyId16"
    });
    $.__views.sectionFish.add($.__views.__alloyId16);
    $.__views.__alloyId17 = Ti.UI.createTableViewRow({
        title: "Haddock",
        id: "__alloyId17"
    });
    $.__views.sectionFish.add($.__views.__alloyId17);
    $.__views.table = Ti.UI.createTableView({
        data: __alloyId11,
        id: "table"
    });
    $.__views.view2.add($.__views.table);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Ti.App.addEventListener("sliderToggled", function(e) {
        $.table.touchEnabled = e.hasSlided ? false : true;
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;