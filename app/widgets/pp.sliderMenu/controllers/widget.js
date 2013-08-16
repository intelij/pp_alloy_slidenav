var touchStartX = 0;
var hasSlided = false;
var direction = "reset";
var OPEN_LEFT = Ti.Platform.displayCaps.platformWidth * 0.84;

var animateRight = Ti.UI.createAnimation({
	left : OPEN_LEFT,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 150
});

var animateReset = Ti.UI.createAnimation({
	left : 0,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 150
});

Alloy.CFG.mainWindow = $.mainWindow;
var Slider = {
	
	touchMove : function(e){
		var coords = $.movableview.convertPointToView({
			x : e.x,
			y : e.y
		}, $.containerview);
		var newLeft = coords.x - touchStartX;
		if(newLeft > 0 && newLeft < OPEN_LEFT){
			$.movableview.left = newLeft;
		}
		if(newLeft >= 150){
			hasSlided = true;	
		}else{
			hasSlided = false;
		}
		Ti.API.debug("-----------------------------------------------");
		Ti.API.debug(Ti.Platform.displayCaps.platformWidth);
		Ti.API.debug(newLeft);
		Ti.API.debug("-----------------------------------------------");
	},
	
	touchEnd : function(e){
		if ($.movableview.left >= 150 && hasSlided) {
			direction = "right";
			$.movableview.animate(animateRight);
		} else if($.movableview.left <= 150 && !hasSlided) {
			direction = "reset";
			$.movableview.animate(animateReset);
		}
		Slider.fireSliderToggledEvent(hasSlided, direction);
	},
	
	toggleMenuButton : function(e){		
		if (!hasSlided) {
			direction = "right";
			$.movableview.animate(animateRight);
			hasSlided = true;
		} else {
			direction = "reset";
			$.movableview.animate(animateReset);
			hasSlided = false;
		}
		Slider.fireSliderToggledEvent(hasSlided, direction);
	},
	
	fireSliderToggledEvent : function(hasSlided, direction){
		Ti.App.fireEvent("sliderToggled", {
			hasSlided : hasSlided,
			direction : direction
		});
	} 
};


if (OS_IOS || OS_MOBILEWEB) {
	// attach the mainNavGroup to Alloy.CFG so it can be accessed globally
	Alloy.CFG.mainNavGroup = $.mainNavGroup;
	var button = Ti.UI.createButton({ 
		backgroundImage : 'none',
		image : "/pp.sliderMenu/button.png",
		right : "0",
		top : "0",
		width : "60",
		height : "44",
	});
	button.addEventListener('click', Slider.toggleMenuButton);
	$.mainWindow.leftNavButton = button;
	
		
	$.mainWindow.addEventListener('touchstart', function(e) {
		touchStartX = e.x;
	});
	
	$.mainWindow.addEventListener('touchmove', function(e) {
		Slider.touchMove(e)
	});
		
	$.mainWindow.addEventListener('touchend', function(e) {
		Slider.touchEnd(e);
	});
	
}

if(OS_ANDROID){
	$.movableview.addEventListener('touchend', function(e) {
		Slider.toggleMenuButton();
	});
	
	$.movableview.addEventListener('touchstart', function(e) {
		touchStartX = e.x;
	});
	
	$.movableview.addEventListener('touchmove', function(e) {
		Slider.touchMove(e)
	});
		
	$.movableview.addEventListener('touchend', function(e) {
		Slider.touchEnd(e);
	});
}

exports.toggleLeftSlider = function() {
	Slider.toggleMenuButton();
}

$.leftMenu.applyProperties({
	width : OPEN_LEFT,
});

var border = Ti.UI.createView({
	width : '2dp',
	right : 0,
	backgroundColor : '#333'
});
$.leftMenu.add(border);
var shadow = Ti.UI.createView({
	width : '11dp',
	left : OPEN_LEFT - 11,
	backgroundImage : '/images/shadow.png'
});
$.leftMenu.add(shadow);