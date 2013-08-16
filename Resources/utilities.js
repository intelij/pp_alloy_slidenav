var moment = require("moment");

Date.prototype.format = function(e) {
    var t = this;
    var n = e;
    if (n.indexOf("M") > -1) {
        var r, i;
        i = -1 != n.indexOf("MMMM") ? "MMMM" : -1 != n.indexOf("MMM") ? "MMM" : -1 != n.indexOf("MM") ? "MM" : "M";
        r = t.getMonth();
        switch (t.getMonth()) {
          case 0:
            ("MMMM" == i || "MMM" === i) && (r = "January");
            break;

          case 1:
            ("MMMM" == i || "MMM" === i) && (r = "February");
            break;

          case 2:
            ("MMMM" == i || "MMM" === i) && (r = "March");
            break;

          case 3:
            ("MMMM" == i || "MMM" === i) && (r = "April");
            break;

          case 4:
            ("MMMM" == i || "MMM" === i) && (r = "May");
            break;

          case 5:
            ("MMMM" == i || "MMM" === i) && (r = "June");
            break;

          case 6:
            ("MMMM" == i || "MMM" === i) && (r = "July");
            break;

          case 7:
            ("MMMM" == i || "MMM" === i) && (r = "August");
            break;

          case 8:
            ("MMMM" == i || "MMM" === i) && (r = "September");
            break;

          case 9:
            ("MMMM" == i || "MMM" === i) && (r = "October");
            break;

          case 10:
            ("MMMM" == i || "MMM" === i) && (r = "November");
            break;

          case 11:
            ("MMMM" == i || "MMM" === i) && (r = "December");
            break;

          default:        }
        if ("MMM" === i) r = r.substring(0, 3); else if ("MM" === i && 10 > r) {
            r += 1;
            r = "0" + r.toString();
        } else "MMMM" != i && (r += 1);
        n = n.replace(i, r.toString());
    }
    if (-1 != n.indexOf("d")) {
        var s = t.getDate();
        var o = -1 != n.indexOf("dd") ? o = "dd" : "d";
        10 > s && "dd" == o && (s = "0" + s.toString());
        n = n.replace(o, s);
    }
    if (-1 != n.indexOf("y")) {
        var u, a;
        u = t.getFullYear().toString();
        if (-1 != n.indexOf("yyyy")) a = "yyyy"; else {
            u = u.substring(0, 2);
            a = "yy";
        }
        n = n.replace(a, u);
    }
    if (-1 != n.indexOf("h")) {
        var f, l;
        f = t.getHours();
        if (-1 != n.indexOf("hh")) {
            l = "hh";
            f > 12 && (f -= 12);
        } else l = "h";
        n = n.replace(l, f.toString());
    }
    if (-1 != n.indexOf("m")) {
        var c, h;
        c = t.getMinutes();
        if (-1 != n.indexOf("mm")) {
            c = (10 > c ? "0" : "") + c.toString();
            h = "mm";
        } else {
            c = c.toString();
            h = "m";
        }
        n = n.replace(h, c);
    }
    if (-1 != n.indexOf("s")) {
        var p, d;
        p = t.getSeconds();
        if (-1 != n.indexOf("ss")) {
            p = (10 > p ? "0" : "") + p.toString();
            d = "ss";
        } else {
            p = p.toString();
            d = "s";
        }
        n = n.replace(d, p);
    }
    if (-1 != n.indexOf("tt")) {
        var v, m;
        var g = t.getHours() > 12 ? false : true;
        if (-1 != n.indexOf("tt")) {
            v = g ? "AM" : "PM";
            m = "tt";
        } else {
            v = g ? "A" : "P";
            m = "t";
        }
        n = n.replace(m, v);
    }
    return n;
};

String.prototype.replaceAll = function(a, b) {
    b = void 0 != b && null != b ? b : "";
    var s = this.toString();
    while (-1 != s.indexOf(a)) s = s.replace(a, b);
    return s;
};

String.prototype.parseDt = function(fullYear) {
    var d = new Date(parseInt(this.replace(/(^.*\()|([+-].*$)/g, "")));
    var yearString = d.getFullYear();
    if (!fullYear) {
        yearString = yearString.toString();
        yearString = yearString.substr(-2);
    }
    return 1 + d.getMonth() + "/" + d.getDate() + "/" + yearString;
};

Number.prototype.formatMoney = function(c, d, t) {
    var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = void 0 == d ? "," : d, t = void 0 == t ? "." : t, s = 0 > n ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
};

Date.prototype.dateIsWithinTheHour = function() {
    var now = new Date();
    var dateToCheck = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1, now.getMinutes(), now.getSeconds());
    return this > dateToCheck ? true : false;
};

Array.prototype.removeAtIndex = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = 0 > from ? this.length + from : from;
    return this.push.apply(this, rest);
};

var OS_NAME = {
    iPhone: "iphone",
    iPad: "ipad",
    Android: "android",
    Tizen: "tizen"
};

var utilities = {
    _: require("underscore"),
    moment: require("moment"),
    deleteProperties: function(sender, properties) {
        properties = utilities._.isString(properties) ? [ properties ] : properties;
        for (var i = 0; properties.length > i; i++) delete sender[properties[i]];
    },
    getObjectTypeName: function(obj) {
        var string = obj.toString();
        return string.replace("[object ", "").replace("]", "");
    },
    setDefaultValue: function(value, defaultValue) {
        return void 0 === value || null === value ? defaultValue : value;
    },
    validateAndFormatPhoneNumber: function(phone) {
        phone = phone.replaceAll("-").replaceAll(".").replaceAll("+").replaceAll("(").replaceAll(")").replaceAll(" ");
        10 == phone.length && (phone = "1" + phone);
        -1 == phone.indexOf("tel:") && (phone = "tel:" + phone);
        return 15 == phone.length ? phone : false;
    },
    isHistoricalListing: function(data) {
        var yearAgo = moment().hour(0).minute(0).millisecond(0).subtract("year", 1);
        if (1 == data.status) return false;
        if (data && data.status && (data.dt_sold || data.dt_expire)) {
            var compareDate = null;
            if (8 == parseInt(data.status)) var compareDate = moment(data.dt_sold); else if (6 == data.status) var compareDate = moment(data.dt_expire);
            return null != compareDate && compareDate.isBefore(yearAgo) ? true : false;
        }
        throw "isHistoricalListing method requires that the status, dt_sold, and dt_expire fields are set (thrown from utilities.js).";
    },
    getRelevantPrice: function(listing) {
        Ti.App.Properties.getString("role");
        var price;
        price = 8 == listing.status ? listing.sold_price ? parseFloat(listing.sold_price).formatMoney(0, "", ",") : "N/A" : null !== listing.listprice ? listing.listprice.formatMoney(0, "", ",") : null !== listing.leaseprice ? parseFloat(listing.leaseprice).formatMoney(0, "", ",") : "N/A";
        return price;
    },
    currentLocation: Ti.App.Properties.getObject("currentLocation"),
    getRole: function() {
        return Ti.App.Properties.getString("role");
    },
    getAgentId: function() {
        return Ti.App.Properties.getString("agent_id");
    },
    IsLoggedIn: "guest" !== Ti.App.Properties.getString("role") ? true : false,
    IsGuest: "guest" === Ti.App.Properties.getString("role") ? true : false,
    OS: null,
    isTablet: false,
    Android: false,
    iPad: false,
    iPhone: false,
    iOS: false,
    Tizen: false,
    DeviceWidth: Ti.Platform.displayCaps.platformWidth,
    DeviceHeight: Ti.Platform.displayCaps.platformHeight,
    deviceCanMakeCalls: false,
    init: function() {
        switch (Ti.Platform.osname) {
          case "ipad":
            this.OS = OS_NAME.iPad;
            this.iPad = true;
            this.iOS = true;
            break;

          case "android":
            this.OS = OS_NAME.Android;
            this.Android = true;
            break;

          case "tizen":
            this.OS = OS_NAME.Tizen;
            this.Tizen = true;
            break;

          case "iphone":
          default:
            this.OS = OS_NAME.iPhone;
            this.iOS = true;
            this.iPhone = true;
        }
        this.deviceCanMakeCalls = this.Android ? true : Ti.Platform.canOpenURL("tel:18016765400") ? true : false;
        this.isTablet = "ipad" === this.OS;
        var online = Ti.Network.getOnline();
        if (online) {
            var netWorkType = Ti.Network.getNetworkType();
            Ti.Network.getNetworkTypeName();
            switch (netWorkType) {
              case Ti.Network.NETWORK_WIFI:
                break;

              case Ti.Network.NETWORK_LAN:
                break;

              case Ti.Network.NETWORK_MOBILE:
                break;

              case Ti.Network.NETWORK_NONE:
                return;

              case Ti.Network.NETWORK_UNKNOWN:
              default:            }
        } else alert("This application requires an active internet connection. No connection was found!");
    },
    getViewsWindow: function(view) {
        while ("TiUIWindow" !== utilities.getObjectTypeName(view)) view = view.getParent();
        return view;
    }
};

module.exports = utilities;