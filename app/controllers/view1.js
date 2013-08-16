Alloy.CFG.mainWindow.title = 'Propertypond';
$.newView.addEventListener('click', function(){
	var navWindow = Alloy.CFG.mainNavGroup;
	var newWin = Alloy.createController('newWin').getView();
	navWindow.open(newWin);
});
