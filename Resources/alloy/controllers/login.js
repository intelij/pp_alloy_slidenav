function Controller() {
    function closeWindow() {
        $.loginWin.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.loginWin = Ti.UI.createWindow({
        barImage: "/images/navBar.png",
        barColor: "#4f90d9",
        backgroundColor: "#e6e7e8",
        layout: "vertical",
        id: "loginWin",
        title: "Login"
    });
    $.__views.loginWin && $.addTopLevelView($.__views.loginWin);
    $.__views.__alloyId6 = Ti.UI.createButton({
        title: "Back",
        id: "__alloyId6"
    });
    closeWindow ? $.__views.__alloyId6.addEventListener("click", closeWindow) : __defers["$.__views.__alloyId6!click!closeWindow"] = true;
    $.__views.loginWin.rightNavButton = $.__views.__alloyId6;
    $.__views.loginContainer = Ti.UI.createView({
        backgroundColor: "#f4f4f4",
        layout: "vertical",
        id: "loginContainer"
    });
    $.__views.loginWin.add($.__views.loginContainer);
    $.__views.userRow = Ti.UI.createTableViewRow({
        id: "userRow",
        top: "10dp",
        height: "45dp"
    });
    var __alloyId7 = [];
    __alloyId7.push($.__views.userRow);
    $.__views.userImage = Ti.UI.createView({
        height: "25dp",
        width: "25dp",
        top: "10dp",
        left: "12dp",
        backgroundImage: "/images/icon-username.png",
        orientationModes: [ Ti.UI.PORTRAIT ],
        id: "userImage"
    });
    $.__views.userRow.add($.__views.userImage);
    $.__views.usernameTxt = Ti.UI.createTextField({
        right: "10dp",
        height: "45dp",
        width: "250dp",
        hintText: "Username",
        textAlign: "right",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderColor: "transparent",
        id: "usernameTxt"
    });
    $.__views.userRow.add($.__views.usernameTxt);
    $.__views.passRow = Ti.UI.createTableViewRow({
        id: "passRow",
        height: "45dp"
    });
    __alloyId7.push($.__views.passRow);
    $.__views.passImage = Ti.UI.createView({
        height: "25dp",
        width: "25dp",
        top: "10dp",
        left: "12dp",
        backgroundImage: "/images/icon-password.png",
        id: "passImage"
    });
    $.__views.passRow.add($.__views.passImage);
    $.__views.passwordTxt = Ti.UI.createTextField({
        right: "10dp",
        hintText: "Password",
        height: "45dp",
        width: "250dp",
        textAlign: "right",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        passwordMask: true,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderColor: "transparent",
        id: "passwordTxt"
    });
    $.__views.passRow.add($.__views.passwordTxt);
    $.__views.loginTable = Ti.UI.createTableView({
        width: "250dp",
        height: "120dp",
        scrollable: false,
        data: __alloyId7,
        id: "loginTable"
    });
    $.__views.loginContainer.add($.__views.loginTable);
    $.__views.loginButton = Ti.UI.createButton({
        top: "10dp",
        left: "10dp",
        width: "200dp",
        height: "45dp",
        theme: "white",
        buttonLabelTop: "10dp",
        buttonLabelSize: "17dp",
        id: "loginButton"
    });
    $.__views.loginContainer.add($.__views.loginButton);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Position = require("Position");
    var userModel = require("services/User");
    $.loginButton.title = "Login";
    $.loginButton.setEnabled(false);
    $.loginWin.navBarHidden = false;
    var enableButton = function() {
        "" != $.usernameTxt.getValue() && "" != $.passwordTxt.getValue() ? $.loginButton.setEnabled(true) : $.loginButton.setEnabled(false);
    };
    var activityIndicator = Ti.UI.createActivityIndicator({
        indicatorColor: "black",
        top: "10dp"
    });
    $.loginWin.add(activityIndicator);
    Position.centerViewHorizontal($.loginButton);
    var dialog = Ti.UI.createAlertDialog({
        cancel: 1,
        buttonNames: [ "Ok" ],
        message: "The username and password combination given does not match any of our users",
        title: "Unable To Login"
    });
    dialog.addEventListener("click", function(e) {
        e.index === e.source.cancel && Ti.API.info("The ok button was clicked");
        Ti.API.info("e.cancel: " + e.cancel);
        Ti.API.info("e.source.cancel: " + e.source.cancel);
        Ti.API.info("e.index: " + e.index);
    });
    $.usernameTxt.addEventListener("change", function() {
        enableButton();
    });
    $.passwordTxt.addEventListener("change", function() {
        enableButton();
    });
    $.loginButton.addEventListener("click", function() {
        activityIndicator.show();
        userModel.authenticate($.usernameTxt.getValue(), $.passwordTxt.getValue(), function(data) {
            activityIndicator.hide();
            if (_.size(data.result) > 0 && 1 == data.success) {
                var role = "member";
                0 == parseInt(data.result["isagent"]) && (role = "user");
                Ti.App.Properties.setString("role", role);
                Ti.App.Properties.setString("username", $.usernameTxt.getValue());
                Ti.App.Properties.setString("password", $.passwordTxt.getValue());
                Ti.App.Properties.setString("user_id", data.result["userid"]);
                Ti.App.fireEvent("reloadHomeView");
                $.loginWin.close();
            } else dialog.show();
        });
    });
    __defers["$.__views.__alloyId6!click!closeWindow"] && $.__views.__alloyId6.addEventListener("click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;