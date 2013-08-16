function Controller() {
    function createSection() {
        role = Ti.App.Properties.getString("role");
        var ppSection = Ti.UI.createTableViewSection({
            headerTitle: "Your Propertypond"
        });
        if ("member" == role || "user" == role) {
            var args = {
                title: "Account",
                image: "/images/icons/grey-arrow.png"
            };
            var account = Alloy.createController("menurow", args).getView();
            account.addEventListener("click", function() {
                var accountWin = Alloy.createController("account").getView();
                accountWin.open({
                    modal: true
                });
            });
            ppSection.add(account);
            var args = {
                title: "My Favorites",
                image: "/images/icons/grey-arrow.png"
            };
            ppSection.add(Alloy.createController("menurow", args).getView());
        } else {
            var argsLogin = {
                title: "Login",
                image: "/images/icons/grey-arrow.png"
            };
            var argsSignup = {
                title: "Create Account",
                image: "/images/icons/grey-arrow.png",
                baseWin: $.win
            };
            var loginRow = Alloy.createController("menurow", argsLogin).getView();
            loginRow.addEventListener("click", function() {
                var loginWin = Alloy.createController("login").getView();
                loginWin.open({
                    modal: true
                });
            });
            ppSection.add(loginRow);
            ppSection.add(Alloy.createController("menurow", argsSignup).getView());
        }
        tableData.push(ppSection);
        var discoverSection = Ti.UI.createTableViewSection({
            headerTitle: "Discover"
        });
        var argsSearch = {
            title: "Search Rentals",
            image: "/images/icons/grey-arrow.png"
        };
        discoverSection.add(Alloy.createController("menurow", argsSearch).getView());
        tableData.push(discoverSection);
        var informationSection = Ti.UI.createTableViewSection({
            headerTitle: "Information"
        });
        var count = ppmoreinfo.length;
        for (var index = 0; count > index; index++) {
            var argsInfo = {
                title: ppmoreinfo[index].title,
                image: "/images/icons/grey-arrow.png"
            };
            informationSection.add(Alloy.createController("menurow", argsInfo).getView());
        }
        tableData.push(informationSection);
        $.ds.leftTableView.data = tableData;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.win = Ti.UI.createWindow({
        backgroundColor: "#FFF",
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.ds = Alloy.createWidget("pp.sliderMenu", "widget", {
        id: "ds",
        __parentSymbol: $.__views.win
    });
    $.__views.ds.setParent($.__views.win);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var config = require("config");
    config.init();
    var util = require("utilities");
    util.init();
    var tableData = [];
    var ppmoreinfo = require("ppmoreinfo");
    var role = null;
    $.win.title = "Propertypond";
    var isHome = true;
    var logoView = Ti.UI.createView({
        top: "24dp",
        height: "70dp",
        width: "121dp",
        left: .84 * Ti.Platform.displayCaps.platformWidth / 2 - 60.5,
        backgroundImage: "/images/logo-lrg.png"
    });
    logoView.addEventListener("click", function() {
        if (!isHome) {
            $.ds.contentview.remove(currentView);
            currentView = Alloy.createController("home").getView();
            $.ds.contentview.add(currentView);
        }
        $.ds.toggleLeftSlider();
    });
    $.ds.leftMenu.add(logoView);
    createSection();
    var currentView = Alloy.createController("home").getView();
    $.ds.contentview.add(currentView);
    $.ds.leftTableView.addEventListener("click", function() {
        isHome = false;
        $.ds.toggleLeftSlider();
    });
    var storedRowTitle = null;
    $.ds.leftTableView.addEventListener("touchstart", function(e) {
        storedRowTitle = e.row.customTitle;
        storedRowTitle.color = "#FFF";
    });
    $.ds.leftTableView.addEventListener("touchend", function() {
        storedRowTitle.color = "#666";
    });
    $.ds.leftTableView.addEventListener("scroll", function() {
        null != storedRowTitle && (storedRowTitle.color = "#666");
    });
    var storedRowTitle = null;
    Ti.App.addEventListener("sliderToggled", function() {});
    Ti.App.addEventListener("reloadHomeView", function() {
        tableData = [];
        $.ds.leftTableView.setData([]);
        createSection();
        var currentView = Alloy.createController("home").getView();
        $.ds.contentview.add(currentView);
    });
    "iphone" === Ti.Platform.osname ? $.win.open({
        transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
    }) : $.win.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;