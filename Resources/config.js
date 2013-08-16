var _ = require("underscore");

var Config = {
    config: {},
    init: function() {
        var prodConfig = require("config/production");
        var devConfig = {};
        if ("true" !== Ti.App.Properties.getString("production")) var devConfig = require("config/development");
        this.config = _.extend(prodConfig, devConfig);
    },
    getValue: function(key) {
        return this.config[key];
    },
    setValue: function(key, value) {
        this.config[key] = value;
    }
};

module.exports = Config;