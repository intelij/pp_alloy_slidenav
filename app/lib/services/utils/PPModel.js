var _           = require('underscore');
var http = require('services/utils/connector/http');
var Criteria	= require('Criteria');

var httpModel = Object.create(http);  

/*
 * For HTTP Request
 *  
 */

PPModel = _.extend(httpModel, {
	
	 __orderBy : null,
	 
	 __limit : null,
	 
	 __fullCount : false,
	 
	 setOrderBy : function(orderBy) {
        var changed = (orderBy !== this.__orderBy);
        this.__orderBy = orderBy;
        return changed;
    },

    getOrderBy : function() {
        return this.__orderBy;
    },
    
    setLimit : function(limit) {
        var changed = (limit !== this.__limit);
        this.__limit = limit;
        return changed;
    },
    
    getLimit : function() {
        return this.__limit;
    },
    
    setReturnFullCount : function(fullCount){
        this.__fullCount = fullCount;    
    },    
		
	getReturnFullCount : function(){
        return this.__fullCount;    
    },
    
    getCountWithFilter : function(filter, callback) {
        var query = (filter ? "?$filter=" + escape(filter) : '') + '&$inlinecount=allpages';
        var callbackWrapper = function(data) {
            // console.log(JSON.stringify(data));
            var countData = {
                count : parseInt(data.d.__count),
                filter : filter
            };
            callback(countData);
        }
        this.get(query, callbackWrapper);   
    },
    
    getRowsWithOffset : function(select, criteria, offset, callback) {
        
        if (criteria && criteria.criteria) {
            Criteria.setCriteria(criteria.criteria);        
            criteria = Criteria;
        } 
        
        // Ensure we have the base requirements to run this criteria
        if (criteria == null || !_.isObject(criteria) || typeof(criteria.toFilterString) != 'function') {
            Ti.API.error("@criteria object must be of type lib/Criteria.js");
            return;
        }
        
        var query = '', filter = criteria.toFilterString();;
        
        // Filter
        if (filter && _.isString(filter)) {
            query += '$filter=' + escape(filter);
        }
        // Select Fields
        if (select && _.isArray(select)) {
            query += '&$select=' + escape(select.join(','));
        }
        // Limit
        if (this.__limit && this.__limit > 0 && _.isNumber(this.__limit)) {
            query += '&$top=' + this.__limit;
        }        
        // Offset
        if (offset && offset > 0 && _.isNumber(offset)) {
            query += '&$skip=' + offset;
        }
        // Full Count
        if (this.__fullCount) {
            query += '&$inlinecount=allpages';
        }        
        // Yes, this is an optimization, but there can be no orderBy clause w/o a filter !
        if (filter && _.isString(filter) && _.isString(this.__orderBy) && this.__orderBy.length > 3) {
            query += '&$orderby=' + escape(this.__orderBy);
        }
        // Query It!
        this.getWithQueryOptions(query, callback);
    },
    
    getWithId : function(fieldName, id, callback){
        this.get('('+fieldName+'='+id+')', function(data){
            // TODO Make all the callback signatures uniform and then use a shared method to handle version-checking OData results.
            if (data.d.results) {
                callback(data.d.results);
            }
            else {
                callback(data.d);
            }
        });
    },
    
    getWithQueryOptions : function(queryOptions, callback) {
        this.get('?'+queryOptions, function(data) {
        	if (data) {
        		if (data.error) {
	                Ti.API.error(data.error);
	            }
	            if (data.d && data.d.results){
	                var totalCount = null;
	                if (data.d && data.d.__count){
	                    totalCount = data.d.__count;    
	                } else {
	                    totalCount = data.d.results.length; 
	                }
	                callback(data.d.results, data.d.__next, parseInt(totalCount));
	            } else {
	                callback(data.d, null, data.d.length);
	            }	
        	}
            
        });
    },
	
});

module.exports = PPModel;
