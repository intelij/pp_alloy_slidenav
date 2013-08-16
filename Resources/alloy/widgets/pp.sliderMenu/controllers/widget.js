function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "pp.sliderMenu/" + s : s.substring(0, index) + "/pp.sliderMenu/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function applyshadowborder() {
        border = Ti.UI.createView({
            width: "2dp",
            left: OPEN_LEFT - 2,
            backgroundColor: "#333"
        });
        $.leftMenu.add(border);
        shadow = Ti.UI.createView({
            width: "11dp",
            left: OPEN_LEFT - 11,
            backgroundImage: "/pp.sliderMenu/shadow.png"
        });
        $.leftMenu.add(shadow);
    }
    new (require("alloy/widget"))("pp.sliderMenu");
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.containerview = Ti.UI.createView({
        id: "containerview"
    });
    $.__views.containerview && $.addTopLevelView($.__views.containerview);
    $.__views.leftMenu = Ti.UI.createView({
        top: "0dp",
        left: "0dp",
        zIndex: "2",
        backgroundColor: "#FFF",
        id: "leftMenu"
    });
    $.__views.containerview.add($.__views.leftMenu);
    $.__views.movableview = Ti.UI.createView({
        left: "0",
        zIndex: "3",
        width: Ti.Platform.displayCaps.platformWidth,
        id: "movableview"
    });
    $.__views.containerview.add($.__views.movableview);
    $.__views.__alloyId0 = Ti.UI.createWindow({
        id: "__alloyId0"
    });
    $.__views.movableview.add($.__views.__alloyId0);
    $.__views.mainWindow = Ti.UI.createWindow({
        borderRadius: 2,
        title: "Window 1",
        id: "mainWindow"
    });
    $.__views.contentview = Ti.UI.createView({
        left: "0dp",
        width: Ti.Platform.displayCaps.platformWidth,
        height: Ti.UI.Fill,
        top: "0dp",
        backgroundColor: "white",
        id: "contentview"
    });
    $.__views.mainWindow.add($.__views.contentview);
    $.__views.mainNavGroup = Ti.UI.iPhone.createNavigationGroup({
        window: $.__views.mainWindow,
        id: "mainNavGroup"
    });
    $.__views.__alloyId0.add($.__views.mainNavGroup);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var touchStartX = 0;
    var hasSlided = false;
    var direction = "reset";
    var OPEN_LEFT = .84 * Ti.Platform.displayCaps.platformWidth;
    var border = null;
    var shadow = null;
    $.leftMenu.applyProperties({
        width: OPEN_LEFT
    });
    var animateRight = Ti.UI.createAnimation({
        left: OPEN_LEFT,
        curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
        duration: 250
    });
    var animateReset = Ti.UI.createAnimation({
        left: 0,
        curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
        duration: 250
    });
    Alloy.CFG.mainWindow = $.mainWindow;
    var Slider = {
        touchMove: function(e) {
            var coords = $.movableview.convertPointToView({
                x: e.x,
                y: e.y
            }, $.containerview);
            var newLeft = coords.x - touchStartX;
            newLeft > 0 && 250 > newLeft && ($.movableview.left = newLeft);
            hasSlided = newLeft >= 150 ? true : false;
        },
        touchEnd: function() {
            $.movableview.left >= 150 && hasSlided ? Slider.showHideMenu(true) : 150 >= $.movableview.left && !hasSlided && Slider.showHideMenu(false);
            Slider.fireSliderToggledEvent(hasSlided, direction);
        },
        showHideMenu: function(show) {
            show = show || false;
            if (show) {
                hasSlided = true;
                direction = "right";
                $.movableview.animate(animateRight);
            } else {
                hasSlided = false;
                direction = "reset";
                $.movableview.animate(animateReset);
            }
        },
        toggleMenuButton: function() {
            hasSlided ? Slider.showHideMenu(false) : Slider.showHideMenu(true);
            Slider.fireSliderToggledEvent(hasSlided, direction);
        },
        fireSliderToggledEvent: function(hasSlided, direction) {
            Ti.App.fireEvent("sliderToggled", {
                hasSlided: hasSlided,
                direction: direction
            });
        }
    };
    Alloy.CFG.mainNavGroup = $.mainNavGroup;
    var button = Ti.UI.createButton({
        backgroundImage: "none",
        image: "/pp.sliderMenu/ButtonMenu.png",
        right: "0",
        top: "0",
        width: "60",
        height: "44"
    });
    button.addEventListener("click", Slider.toggleMenuButton);
    $.mainWindow.leftNavButton = button;
    $.mainWindow.addEventListener("click", function() {
        Slider.showHideMenu(false);
    });
    $.mainWindow.addEventListener("touchstart", function(e) {
        touchStartX = e.x;
    });
    $.mainWindow.addEventListener("touchmove", function(e) {
        Slider.touchMove(e);
    });
    $.mainWindow.addEventListener("touchend", function(e) {
        Slider.touchEnd(e);
    });
    exports.toggleLeftSlider = function() {
        Slider.toggleMenuButton();
    };
    exports.addMenus = function(menuView) {
        $.leftMenu.add(menuView);
        applyshadowborder();
    };
    exports.removeMenus = function(menuView) {
        $.leftMenu.remove(menuView);
        $.leftMenu.remove(border);
        $.leftMenu.remove(shadow);
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;