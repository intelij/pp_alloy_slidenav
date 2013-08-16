function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "pp.sliderMenu/" + s : s.substring(0, index) + "/pp.sliderMenu/" + s.substring(index + 1);
    return path;
}

function Controller() {
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
    $.__views.leftTableView = Ti.UI.createTableView({
        rowHeight: "44dp",
        top: 100,
        id: "leftTableView"
    });
    $.__views.leftMenu.add($.__views.leftTableView);
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
    var animateRight = Ti.UI.createAnimation({
        left: OPEN_LEFT,
        curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
        duration: 150
    });
    var animateReset = Ti.UI.createAnimation({
        left: 0,
        curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
        duration: 150
    });
    Alloy.CFG.mainWindow = $.mainWindow;
    var Slider = {
        touchMove: function(e) {
            var coords = $.movableview.convertPointToView({
                x: e.x,
                y: e.y
            }, $.containerview);
            var newLeft = coords.x - touchStartX;
            newLeft > 0 && OPEN_LEFT > newLeft && ($.movableview.left = newLeft);
            hasSlided = newLeft >= 150 ? true : false;
            Ti.API.debug("-----------------------------------------------");
            Ti.API.debug(Ti.Platform.displayCaps.platformWidth);
            Ti.API.debug(newLeft);
            Ti.API.debug("-----------------------------------------------");
        },
        touchEnd: function() {
            if ($.movableview.left >= 150 && hasSlided) {
                direction = "right";
                $.movableview.animate(animateRight);
            } else if (150 >= $.movableview.left && !hasSlided) {
                direction = "reset";
                $.movableview.animate(animateReset);
            }
            Slider.fireSliderToggledEvent(hasSlided, direction);
        },
        toggleMenuButton: function() {
            if (hasSlided) {
                direction = "reset";
                $.movableview.animate(animateReset);
                hasSlided = false;
            } else {
                direction = "right";
                $.movableview.animate(animateRight);
                hasSlided = true;
            }
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
        image: "/pp.sliderMenu/button.png",
        right: "0",
        top: "0",
        width: "60",
        height: "44"
    });
    button.addEventListener("click", Slider.toggleMenuButton);
    $.mainWindow.leftNavButton = button;
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
    $.leftMenu.applyProperties({
        width: OPEN_LEFT
    });
    var border = Ti.UI.createView({
        width: "2dp",
        right: 0,
        backgroundColor: "#333"
    });
    $.leftMenu.add(border);
    var shadow = Ti.UI.createView({
        width: "11dp",
        left: OPEN_LEFT - 11,
        backgroundImage: "/images/shadow.png"
    });
    $.leftMenu.add(shadow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;