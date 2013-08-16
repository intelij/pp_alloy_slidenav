_ = require("underscore");

var Criteria = {
    __CriteriaDef: {},
    CRITERIA_OPERATOR: {
        EQUALS: 1,
        IN: 2,
        GREATER_THAN: 3,
        GREATER_THAN_EQUAL_TO: 4,
        LESS_THAN: 5,
        LESS_THAN_EQUAL_TO: 6,
        IGNORE: 7,
        NOTEQUALS: 8,
        NOTIN: 9
    },
    setCriteria: function(criteria) {
        this.__CriteriaDef = criteria;
        return this.__CriteriaDef;
    },
    getCriteria: function() {
        return this.__CriteriaDef;
    },
    addField: function(fieldName, operator, value, fieldValue, isString) {
        isString = isString ? isString : false;
        this.__isValidOperator(operator);
        var obj = this.__CriteriaDef[fieldName];
        fieldValue = fieldValue || value;
        obj = {
            operator: operator,
            value: value,
            fieldValue: fieldValue,
            isString: isString
        };
        this.__CriteriaDef[fieldName] = obj;
        return this.__CriteriaDef;
    },
    hasField: function(fieldName) {
        if (this.__CriteriaDef[fieldName]) return true;
        return false;
    },
    appendField: function(fieldName, operator, value, fieldValue) {
        this.__isValidOperator(operator);
        var obj = this.__CriteriaDef[fieldName];
        if (void 0 == obj || null == obj) {
            fieldValue = fieldValue || value;
            obj = {
                operator: operator,
                value: value,
                fieldValue: fieldValue
            };
            this.__CriteriaDef[fieldName] = obj;
        } else if (_.isArray(obj)) obj.push({
            operator: operator,
            value: value,
            fieldValue: fieldValue
        }); else switch (obj.operator) {
          case Criteria.CRITERIA_OPERATOR.IN:
          case Criteria.CRITERIA_OPERATOR.NOTIN:
            0 == obj.value.length ? obj.value = value.toString() : obj.value += "," + value.toString();
            break;

          default:
            this.__CriteriaDef[fieldName] = [ this.__CriteriaDef[fieldName] ];
            this.__CriteriaDef[fieldName].push({
                operator: operator,
                value: value,
                fieldValue: fieldValue
            });
        }
        return this.__CriteriaDef;
    },
    removeFunction: function(fn) {
        var _functions = this.__CriteriaDef["function"];
        if (!_functions) return;
        for (var a = 0; _functions.length > a; a++) {
            var _function = _functions[a];
            _function === fn && _functions.splice(a, 1);
        }
        _functions.length ? this.__CriteriaDef["function"] = _functions : delete this.__CriteriaDef["function"];
    },
    removeFunctionByName: function(fn) {
        var _functions = this.__CriteriaDef["function"];
        if (!_functions) return;
        for (var a = 0; _functions.length > a; a++) {
            var _function = _functions[a];
            -1 !== _function.search(fn) && _functions.splice(a, 1);
        }
        _functions.length ? this.__CriteriaDef["function"] = _functions : delete this.__CriteriaDef["function"];
    },
    addFunction: function(fn) {
        var _functions = this.__CriteriaDef["function"];
        _functions || (_functions = []);
        _functions.push(fn);
        this.__CriteriaDef["function"] = _functions;
        return this.__CriteriaDef;
    },
    getFunctionByType: function(type) {
        var fns = this.getAllFunctionNames();
        if (fns) for (var i = 0; fns.length > i; i++) {
            var fn = fns[i];
            var fnName = fn.substring(0, fn.indexOf("("));
            fn.toString().substring(fn.indexOf("(") + 1, fn.indexOf(")"));
            var fnSplit = fn.split(",");
            if (!fnSplit[0] || !fnSplit[1]) {
                this.removeFunctionByName(fnName);
                return null;
            }
            var fn1 = fnSplit[0].trim();
            var fn2 = fnSplit[1].trim();
            if ("geoclose" === type && "geoclose" === fnName) return {
                _function: fn,
                type: "geoclose",
                latitude: fn1,
                longitude: fn2
            };
            if ("georect" === type && "georect" === fnName) return {
                _function: fn,
                type: "georect",
                xmin: fn1,
                ymin: fn2,
                xmax: fnSplit[2].trim(),
                ymax: fnSplit[3].trim()
            };
            if ("georect" != type && "geoclose" != type && type === fn2) return {
                _function: fn,
                type: fn2,
                value: fn1
            };
        }
        return null;
    },
    getFunctionValue: function(fn) {
        var fns = this.__CriteriaDef["function"];
        for (var a = 0; fns.length > a; a++) {
            var _fn = fns[a];
            var _fnName = this.getAllFunctionNames(_fn);
            if (this.getAllFunctionNames(fn) == _fnName) {
                var start = _fnName.indexOf("(");
                var end = _fnName.indexOf(")");
                return _fnName.substring(start, end - start);
            }
        }
    },
    getAllFunctionNames: function() {
        var names = [];
        var fns = this.__CriteriaDef["function"];
        if (!fns) return names;
        for (var a = 0; fns.length > a; a++) {
            var fn = fns[a];
            names.push(this.getFunctionName(fn));
        }
        return names;
    },
    getFunctionName: function(fn) {
        "string" != typeof fn && (fn = JSON.stringify(fn));
        return fn.substring(0, fn.indexOf("("));
    },
    toFilterString: function(queryString) {
        queryString = queryString ? queryString : "";
        var c = this.__CriteriaDef;
        var fieldCount = 0;
        for (var field in c) {
            var obj = c[field];
            if (obj.operator && obj.operator == this.CRITERIA_OPERATOR.IGNORE) continue;
            if (_.isArray(obj) && "function" != field) {
                var innerArrayCount = 0;
                var innerArrayQueryString = "";
                for (var a = 0; obj.length > a; a++) {
                    var o = obj[a];
                    if (o.operator == this.CRITERIA_OPERATOR.IGNORE) continue;
                    innerArrayQueryString += (innerArrayCount > 0 ? " and " : " ") + this.__returnFilterValue(o, field);
                    innerArrayCount++;
                }
                if ("" != innerArrayQueryString) {
                    queryString += fieldCount > 0 ? " and " : "";
                    queryString += innerArrayQueryString;
                }
            } else {
                queryString += fieldCount > 0 ? " and " : "";
                queryString += this.__returnFilterValue(obj, field);
            }
            fieldCount++;
        }
        console.info("queryString: ", queryString);
        return queryString;
    },
    reset: function() {
        this.__CriteriaDef = {};
    },
    removeAll: function(exceptionFields) {
        for (var field in this.__CriteriaDef) {
            var canDelete = true;
            for (var a = 0; exceptionFields.length > a; a++) {
                var exceptionField = exceptionFields[a];
                exceptionField == field && (canDelete = false);
            }
            canDelete && delete this.__CriteriaDef[field];
        }
        return this.__CriteriaDef;
    },
    removeField: function(fieldName) {
        delete this.__CriteriaDef[fieldName];
        return this.__CriteriaDef;
    },
    removeFieldValue: function(fieldName, value) {
        var obj = this.__CriteriaDef[fieldName];
        if (_.isArray(obj)) {
            for (var a = 0; obj.length > a; a++) {
                var o = obj[0];
                if (o.value.toString() == value.toString()) {
                    obj.splice(a, 1);
                    break;
                }
            }
            0 == obj.length ? delete this.__CriteriaDef[fieldName] : this.__CriteriaDef[fieldName] = obj;
        } else {
            var values = obj.value.split(",");
            for (var a = 0; values.length > a; a++) {
                var val = values[a];
                if (val.toString() == value.toString()) {
                    values.splice(a, 1);
                    break;
                }
            }
            0 == values.length ? delete this.__CriteriaDef[fieldName] : this.__CriteriaDef[fieldName] = values.join(",");
        }
        return this.__CriteriaDef;
    },
    removeFieldOperator: function(fieldName, operator) {
        this.__isValidOperator(operator);
        var obj = this.__CriteriaDef[fieldName];
        if (void 0 != obj && null != obj) if (_.isArray(obj)) {
            obj = _.reject(obj, function(c) {
                return c.operator == operator;
            });
            0 == obj.length ? delete this.__CriteriaDef[fieldName] : this.__CriteriaDef[fieldName] = obj;
        } else obj.operator == operator && delete this.__CriteriaDef[fieldName];
        return this.__CriteriaDef;
    },
    __operatorToString: function(operator) {
        this.__isValidOperator(operator);
        var _op = {
            1: "eq",
            2: "eq",
            3: "gt",
            4: "ge",
            5: "lt",
            6: "le",
            7: null,
            8: "ne",
            9: "ne"
        };
        return _op[operator];
    },
    __isValidOperator: function(operator) {
        for (var oper in this.CRITERIA_OPERATOR) if (this.CRITERIA_OPERATOR[oper] == operator) return;
        throw "The operator " + JSON.stringify(operator) + " is not valid.";
    },
    __cleanValue: function(value, isString) {
        isString == (void 0 == isString || null == isString ? false : isString);
        if (isString) return "'" + escape(value) + "'";
        return value;
    },
    __returnFilterValue: function(obj, field) {
        if ("function" == field) {
            var queryString = "";
            if (this.__CriteriaDef["function"]) for (var a = 0; this.__CriteriaDef["function"].length > a; a++) {
                var fn = this.__CriteriaDef["function"][a];
                queryString += (queryString.length > 0 ? " and " : "") + fn;
            }
            return queryString;
        }
        if (obj.operator == this.CRITERIA_OPERATOR.IGNORE) return "";
        var filterValue = "";
        switch (obj.operator) {
          case this.CRITERIA_OPERATOR.IN:
          case this.CRITERIA_OPERATOR.NOTIN:
            filterValue += "(";
            var values = obj.value.split(",");
            for (var a = 0; values.length > a; a++) {
                var value = values[a];
                filterValue += obj.operator == this.CRITERIA_OPERATOR.IN ? (a > 0 ? " or " : "") + field + " " + this.__operatorToString(obj.operator) + " " + this.__cleanValue(value, obj.isString) : (a > 0 ? " and " : "") + field + " " + this.__operatorToString(obj.operator) + " " + this.__cleanValue(value, obj.isString);
            }
            filterValue += ")";
            break;

          default:
            if (_.isArray(obj.value)) for (var a = 0; obj.value.length > a; a++) filterValue += field + " " + this.__operatorToString(obj.operator) + " " + this.__cleanValue(obj.value[a], obj.isString); else filterValue += field + " " + this.__operatorToString(obj.operator) + " " + this.__cleanValue(obj.value, obj.isString);
        }
        return filterValue;
    }
};

module.exports = Criteria;