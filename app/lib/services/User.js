var _ = require('underscore');
var PPModel = require('services/utils/PPModel');

var User = Object.create(PPModel);

User.keyField = 'userid';
User.resourcePath = 'auth';

User.authenticate = function(username, password, callback){
	this.get('/login?username='+username+'&password='+password, callback);
};

User.register = function(email, password, callback){
	this.get('/register?email='+email+'&password='+password, callback);
}

module.exports = User;