var Position = require('Position');
var userModel = require('services/User');
$.loginButton.title = 'Login';
$.loginButton.setEnabled(false);
$.loginWin.navBarHidden = false;

 /**
 * Callback event for keypressed events on both password and username fields.
 * Checks to make sure that the fields have been populated and enabled the login button if so.
 * 
 */
var enableButton = function(){
    if ($.usernameTxt.getValue() != '' && $.passwordTxt.getValue() != ''){
        $.loginButton.setEnabled(true);
    } else {
        $.loginButton.setEnabled(false);
    }
}

function closeWindow() {
	$.loginWin.close();
}
var activityIndicator = Ti.UI.createActivityIndicator({
  indicatorColor: 'black',
  top: '10dp',
  //style: style      
});
$.loginWin.add(activityIndicator);

Position.centerViewHorizontal($.loginButton);

// Initiate our error dialog here
var dialog = Ti.UI.createAlertDialog({
    cancel: 1,
    // buttonNames: ['Forgot Password', 'Ok'],
    buttonNames: ['Ok'],
    message: 'The username and password combination given does not match any of our users',
    title: 'Unable To Login'
});
dialog.addEventListener('click', function(e){
    if (e.index === e.source.cancel){
        Ti.API.info('The ok button was clicked');
    }
    Ti.API.info('e.cancel: ' + e.cancel);
    Ti.API.info('e.source.cancel: ' + e.source.cancel);
    Ti.API.info('e.index: ' + e.index);
});


$.usernameTxt.addEventListener('change', function(){
	enableButton();
});

$.passwordTxt.addEventListener('change', function(){
	enableButton();
});

$.loginButton.addEventListener('click', function(){
	activityIndicator.show();
    userModel.authenticate($.usernameTxt.getValue(), $.passwordTxt.getValue(), function(data) {
        activityIndicator.hide();

        if (_.size(data.result) > 0 && data.success == 1){
            // Find out the users role
            var role = 'member';
            if (parseInt(data.result['isagent']) == 0){
                role = 'user'
            }
            
            // Set global properties
            Ti.App.Properties.setString('role', role);
            Ti.App.Properties.setString('username', $.usernameTxt.getValue());
            Ti.App.Properties.setString('password', $.passwordTxt.getValue());
            Ti.App.Properties.setString('user_id', data.result['userid']);
            // Send event to reload the home view (will change after being logged in)
            Ti.App.fireEvent('reloadHomeView'); 
            
            // Close this login window
           $.loginWin.close();
        } else {
            // Show the error dialog
            dialog.show();
        }
    });  
})
