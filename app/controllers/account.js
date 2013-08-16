$.logout.addEventListener('click', function(){
	Ti.App.Properties.setString('role', 'guest');
    Ti.App.Properties.setString('username', '');
    Ti.App.Properties.setString('password', '');
    Ti.App.Properties.setString('user_id', '');
    
    Ti.App.fireEvent('reloadHomeView');
    
    $.accountWin.close();
});

function closeWindow(){
	$.accountWin.close();
}
