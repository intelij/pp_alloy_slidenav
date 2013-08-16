var config = require('config');    
config.init();

// load helpers
var util = require('utilities');
util.init();
    

var tableData = [];
var menuTableView = null;
var ppmoreinfo = require('ppmoreinfo');
var role = null;
$.win.title = 'Propertypond';
var isHome = true;
var currentView = null;
var menuContainer = null;
var border = null;
var shadow = null;

function createMenu() {
	role = Ti.App.Properties.getString('role');
	
	var ppSection = Ti.UI.createTableViewSection({
		headerTitle:'Your Propertypond'
	});
	
	if (role == 'member' || role == 'user') {
		var args = {
			title : 'Account',
			//customView : 'view',
			image : "/images/icons/grey-arrow.png"
		};
		
		var account = Alloy.createController('menurow', args).getView();
		account.addEventListener('click', function(){
			var accountWin = Alloy.createController('account').getView();
			accountWin.open({ modal : true });
		});
		ppSection.add(account);
		//ppSection.add(account);
		var args = {
			title : 'My Favorites',
			//customView : 'view',
			image : "/images/icons/grey-arrow.png"
		};
		
		ppSection.add(Alloy.createController('menurow', args).getView());
	} else {
		
		var argsLogin = {
			title : 'Login',
			//customView : 'view',
			image : "/images/icons/grey-arrow.png"
		};
		var argsSignup = {
			title : 'Create Account',
			//customView : 'view',
			image : "/images/icons/grey-arrow.png",
			baseWin : $.win
		};
		var loginRow = Alloy.createController('menurow', argsLogin).getView();
		loginRow.addEventListener('click', function(){
			var loginWin = Alloy.createController('login').getView();
			loginWin.open({ modal : true });
		});
		ppSection.add(loginRow);
		ppSection.add(Alloy.createController('menurow', argsSignup).getView());

	}
	
	tableData.push(ppSection);
	
	var discoverSection = Ti.UI.createTableViewSection({
		headerTitle : 'Discover'
	});
	
	var argsSearch = {
		title : 'Search Rentals',
		image : "/images/icons/grey-arrow.png"
	};
	
	var searchView = Alloy.createController('menurow',argsSearch).getView();
	
	searchView.addEventListener('click', function(){
		$.ds.contentview.remove(currentView);
		currentView = Alloy.createController('view1').getView();
		$.ds.contentview.add(currentView);
	});
	
	discoverSection.add(searchView);
	tableData.push(discoverSection);
	
	var informationSection = Ti.UI.createTableViewSection({
		headerTitle : 'Information'
	});
	var count = ppmoreinfo.length;
	for (var index = 0; index < count; index++) {
		
		var argsInfo = {
			title : ppmoreinfo[index].title,
			image : "/images/icons/grey-arrow.png"
		};
		
		informationSection.add(Alloy.createController('menurow',argsInfo).getView());
	}
	
	tableData.push(informationSection);
	
	// Pass data to widget leftTableView and rightTableView
	menuTableView = Alloy.createController('menu').getView();
	menuTableView.setData(tableData);
	
	// Swap views on menu item click
	menuTableView.addEventListener('click', function selectRow(e) {
		isHome = false;
		$.ds.toggleLeftSlider();
	});
	
	// Set row title highlight colour (left table view)
	var storedRowTitle = null;
	menuTableView.addEventListener('touchstart', function(e) {
		storedRowTitle = e.row.customTitle;
		storedRowTitle.color = "#FFF";
	});
	menuTableView.addEventListener('touchend', function(e) {
		storedRowTitle.color = "#666";
	});
	menuTableView.addEventListener('scroll', function(e) {
		if (storedRowTitle != null)
			storedRowTitle.color = "#666";
	});
	
	// Set row title highlight colour (right table view)
	var storedRowTitle = null;
	var logoView = Ti.UI.createView({
	    top: '24dp',
	    height: '70dp',
	    width: '121dp',
	    left : ((Ti.Platform.displayCaps.platformWidth * 0.84) / 2) - (121/2),
	    backgroundImage: "/images/logo-lrg.png"
	});
	/* Click The Logo to return back in HOME */
	logoView.addEventListener('click', function(){
		if (!isHome) {
			$.ds.contentview.remove(currentView);
			currentView = Alloy.createController('home').getView();
			$.ds.contentview.add(currentView);
		}
		
		$.ds.toggleLeftSlider();
	});
	menuContainer = Ti.UI.createView();
	menuContainer.add(logoView);
	menuContainer.add(menuTableView);
	
	$.ds.addMenus(menuContainer);
}

createMenu();


Ti.App.addEventListener("sliderToggled", function(e) {
	
});

Ti.App.addEventListener('reloadHomeView', function(e){
	tableData = [];
	menuTableView.setData([]);
	$.ds.removeMenus(menuContainer);
	createMenu();
	
	$.ds.contentview.remove(currentView);
	currentView = Alloy.createController("home").getView();
	$.ds.contentview.add(currentView);
});

/* Load Initial View */
currentView = Alloy.createController("home").getView();
$.ds.contentview.add(currentView);


if (Ti.Platform.osname === 'iphone')
	$.win.open({
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
else
	$.win.open();
