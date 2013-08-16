Alloy.CFG.mainWindow.title = 'Propertypond';

var filterButton = Ti.UI.createButton({
	title : 'Filter',
});

Alloy.CFG.mainWindow.rightNavButton = filterButton;

filterButton.addEventListener('click', function(){
	alert('Filter Search');
});

Ti.App.addEventListener("sliderToggled", function(e) {
	if (e.hasSlided) {
		$.timap.touchEnabled = false;
	}
	else {
		$.timap.touchEnabled = true;
	}
});