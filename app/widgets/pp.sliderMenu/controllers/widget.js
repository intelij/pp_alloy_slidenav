var touchStartX = 0;
var hasSlided = false;
var direction = "reset";
var OPEN_LEFT = Ti.Platform.displayCaps.platformWidth * 0.84;
var border = null;
var shadow = null;

$.leftMenu.applyProperties({
	width : OPEN_LEFT,
});



var animateRight = Ti.UI.createAnimation({
	left : OPEN_LEFT,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 250
});

var animateReset = Ti.UI.createAnimation({
	left : 0,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 250
});

Alloy.CFG.mainWindow = $.mainWindow;
var Slider = {
	
	touchMove : function(e){
		var coords = $.movableview.convertPointToView({
			x : e.x,
			y : e.y
		}, $.containerview);
		var newLeft = coords.x - touchStartX;
		if(newLeft > 0 && newLeft < 250){
			$.movableview.left = newLeft;
		}
		if(newLeft >= 150){
			hasSlided = true;	
		}else{
			hasSlided = false;
		}
			},
	
	touchEnd : function(e){
		if ($.movableview.left >= 150 && hasSlided) {			
			Slider.showHideMenu(true);
		} else if($.movableview.left <= 150 && !hasSlided) {			
			Slider.showHideMenu(false);
		}		
		Slider.fireSliderToggledEvent(hasSlided, direction);
	},
	
	showHideMenu : function(show){
		show = show||false;
		if(show){
			hasSlided = true;	
			direction = "right";
			$.movableview.animate(animateRight);
		}else{
			hasSlided = false;	
			direction = "reset";
			$.movableview.animate(animateReset);
		}
	},
	
	toggleMenuButton : function(e){		
		if (!hasSlided) {
			Slider.showHideMenu(true);
		} else {
			Slider.showHideMenu(false);
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
		image : "/pp.sliderMenu/ButtonMenu.png",
		right : "0",
		top : "0",
		width : "60",
		height : "44",
	});
	button.addEventListener('click', Slider.toggleMenuButton);
	$.mainWindow.leftNavButton = button;
	
	$.mainWindow.addEventListener('click', function(e) {
		Slider.showHideMenu(false);
	});	
		
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

function applyshadowborder(){
	border = Ti.UI.createView({
		width : '2dp',
		left : OPEN_LEFT - 2,
		backgroundColor : '#333'
	});
	$.leftMenu.add(border);
	shadow = Ti.UI.createView({
		width : '11dp',
		left : OPEN_LEFT - 11,
		backgroundImage : '/pp.sliderMenu/shadow.png'
	});
	$.leftMenu.add(shadow);
}

exports.addMenus = function(menuView) {
	$.leftMenu.add(menuView);
	applyshadowborder();
}

exports.removeMenus = function(menuView){
	$.leftMenu.remove(menuView);
	$.leftMenu.remove(border);
	$.leftMenu.remove(shadow);
}
