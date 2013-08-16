function Controller() {
    function closeWindow() {
        $.accountWin.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.accountWin = Ti.UI.createWindow({
        id: "accountWin",
        navBarHidden: "false"
    });
    $.__views.accountWin && $.addTopLevelView($.__views.accountWin);
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "Back",
        id: "__alloyId2"
    });
    closeWindow ? $.__views.__alloyId2.addEventListener("click", closeWindow) : __defers["$.__views.__alloyId2!click!closeWindow"] = true;
    $.__views.accountWin.rightNavButton = $.__views.__alloyId2;
    $.__views.__alloyId3 = Ti.UI.createView({
        id: "__alloyId3"
    });
    $.__views.accountWin.add($.__views.__alloyId3);
    $.__views.logout = Ti.UI.createButton({
        id: "logout",
        title: "Logout"
    });
    $.__views.__alloyId3.add($.__views.logout);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.logout.addEventListener("click", function() {
        Ti.App.Properties.setString("role", "guest");
        Ti.App.Properties.setString("username", "");
        Ti.App.Properties.setString("password", "");
        Ti.App.Properties.setString("user_id", "");
        Ti.App.fireEvent("reloadHomeView");
        $.accountWin.close();
    });
    __defers["$.__views.__alloyId2!click!closeWindow"] && $.__views.__alloyId2.addEventListener("click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;