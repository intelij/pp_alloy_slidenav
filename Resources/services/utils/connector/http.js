var config = require("config");

var _ = require("underscore");

var util = require("utilities");

var timeout = 1e4;

var http = {
    resourcePath: false,
    lastHTTPClient: null,
    _isOnline: function(showAlert) {
        showAlert = showAlert || true;
        var online = Ti.Network.getOnline();
        if (!online && showAlert) {
            alert("This feature requires an internet connection and no active internet connection was found. Please check your settings to make sure your wifi or cellular data is turned on.");
            return false;
        }
        return true;
    },
    __getResourcePath: function() {
        if (false === this.resourcePath) throw "Query resource is not defined";
        var url = config.getValue("pp_url") + this.resourcePath;
        return url;
    },
    __request: function(method, urlAppend, sendData, callback) {
        if (this._isOnline(true)) {
            if (!_.isFunction(callback)) throw "Callback provided to HTTP request is not a function";
            var url = this.__getResourcePath();
            urlAppend && (url += urlAppend);
            console.log(url);
            var client = Ti.Network.createHTTPClient({
                onload: function() {
                    if (this.handled) {
                        Ti.API.debug("Service response already handled, abandoning onload callback.");
                        return;
                    }
                    this.handled = true;
                    var response = null;
                    this.responseText && (response = JSON.parse(this.responseText));
                    callback(response);
                },
                onerror: function(e) {
                    if (this.handled) {
                        Ti.API.debug("Service response already handled, abandoning onerror callback.");
                        return;
                    }
                    this.handled = true;
                    if (this.status) alert(this.statusText); else {
                        var error = "";
                        switch (util.OS) {
                          case "iphone":
                            var re = /ASIHTTPRequestErrorDomain Code=\d+ "(.+?)"/;
                            var matches = e.error.match(re);
                            error = matches ? matches.length > 0 ? matches[1] : matches[0] : e.error;
                            break;

                          case "android":
                            error = e.error.match(/timeout|timed out/i) ? "The request timed out" : e.error;
                            break;

                          default:
                            error = e.error;
                        }
                    }
                    if ("The request timed out" == error) {
                        var dialog = Ti.UI.createAlertDialog({
                            title: "Request timeout",
                            message: "Would you like to retry?",
                            buttonNames: [ "Retry", "Cancel" ],
                            cancel: 1
                        });
                        dialog.addEventListener("click", function(e) {
                            switch (e.index) {
                              case 0:
                                Ti.API.debug("The retry button was clicked");
                                ParentModel._httpAttempt(client, method, url, sendData);
                                break;

                              case e.source.cancel:
                                Ti.API.debug("The cancel button was clicked");
                            }
                        });
                        dialog.show();
                    } else {
                        Ti.API.debug("ERROR ALERT");
                        error && alert(error);
                    }
                },
                handled: false
            });
            client.setTimeout(timeout);
            this.lastHTTPClient = client;
            Ti.API.debug("URL : " + url);
            Ti.API.debug("METHOD : " + method);
            this._httpAttempt(client, method, url, sendData);
        }
    },
    _httpAttempt: function(client, method, url, sendData) {
        client.open(method, url);
        this._addAppAuthHeaders(client);
        this._addUserAuthHeaders(client);
        setTimeout(function() {
            if (4 !== client.readyState && !client.handled) {
                Ti.API.error("HTTPClient trap triggered! This might be caused by an uncatchable native exception or a connection error.");
                client.onerror({
                    error: "An unknown error occurred"
                });
            }
        }, timeout + 1e3);
        client.setRequestHeader("accept", "application/json");
        client.send(sendData);
    },
    _addAppAuthHeaders: function(client) {
        var now = new Date();
        var hash_time = Math.floor(now.getTime() / 1e3);
        var hash_str = config.getValue("sha256_secret_key") + "___" + hash_time + "___" + client.getLocation();
        var hash_val = Ti.Utils.sha256(hash_str);
        var header_time = now.toUTCString();
        client.setRequestHeader("Date", header_time);
        client.setRequestHeader("PP-Security", hash_val);
    },
    _addUserAuthHeaders: function(client) {
        var username = Ti.App.Properties.getString("username");
        var password = Ti.App.Properties.getString("password");
        if (username && password) {
            authstr = "Basic " + Titanium.Utils.base64encode(username + ":" + password);
            client.setRequestHeader("Authorization", authstr);
        }
    },
    getLastHttpClient: function() {
        return this.lastHTTPClient;
    },
    getAcessToken: function() {}
};

http = _.extend(http, {
    keyField: null,
    get: function(urlAppend, callback) {
        this.__request("GET", urlAppend, null, callback);
    },
    post: function(postData, callback) {
        if (null == postData) {
            Ti.API.error("No data has been set for post");
            return;
        }
        this.__request("POST", null, postData, function(data) {
            data = data.d.results[0];
            data.success && null != this.keyField && (this[this.keyField] = data.id);
            callback(data);
        });
    },
    put: function(putData, callback) {
        if (null == putData) {
            Ti.API.error("No data has been set for put");
            return;
        }
        if (null == this.keyField) {
            Ti.API.error("You must specify a keyField before using the 'PUT' request. The keyField is the primary key field for an object.");
            return;
        }
        var querystring = "?" + this.keyField + "=" + putData[this.keyField];
        this.__request("PUT", querystring, putData, function(data) {
            callback(data.d.results[0]);
        });
    },
    remove: function(deleteData, callback) {
        if (null == deleteData) {
            Ti.API.error("No data has been set for put");
            return;
        }
        var queryString = "";
        var index = 0;
        for (var _data in deleteData) {
            queryString += (0 === index ? "?" : "&") + _data + "=" + deleteData[_data];
            index++;
        }
        this.__request("DELETE", queryString, {}, function(data) {
            callback(data.d.results[0]);
        });
    }
});

module.exports = http;