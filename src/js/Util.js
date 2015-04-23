define(['jqueryui'],/** @lends Util */function($) {

    /**
     * Util
     * @class Util
     * @name Util
     * @constructor
     */
    var Util = {};

    /**
     * Generate random hex string
     * @param {number} [length] Length of string (Default=24)
     * @returns {string}
     */
    Util.generateRandomId = function(length){
        var chars = "1234567890abcdef";
        var numOfChars = chars.length;
        var i, rand;
        var res = "";

        if(typeof length === 'undefined') length = 24;

        for(i = 0; i < length; i++){
            rand = Math.floor(Math.random() * numOfChars);
            res += chars[rand];
        }
        return res;
    };

    /**
     * Wait for delay milliseconds then return
     * @param delay
     * @returns {promise}
     */
    Util.delay = function(delay){
        var deferred = $.Deferred();
        setTimeout(function(){
            deferred.resolve();
        },delay);
        return deferred.promise();
    };

    /**
     * Union the two passed objects into a new object (on a duplicate key, the first object has priority)
     * @param {object} obj1
     * @param {object} obj2
     * @returns {object}
     */
    Util.union = function(obj1,obj2){
        var res = {}, i;
        for(i in obj1){
            if(obj1.hasOwnProperty(i)){
                res[i] = obj1[i];
            }
        }
        for(i in obj2){
            if(obj2.hasOwnProperty(i) && !obj1.hasOwnProperty(i)){
                res[i] = obj2[i];
            }
        }
        return res;
    };

    /**
     * Merge the elements of the second object into the first (on a duplicate key, the first object has priority)
     * @param {object} obj1
     * @param {object} obj2
     * @returns {object}
     */
    Util.merge = function(obj1,obj2){
        var i;
        for(i in obj2){
            if(obj2.hasOwnProperty(i) && !obj1.hasOwnProperty(i)){
                obj1[i] = obj2[i];
            }
        }
        return obj1;
    };

    /**
     * Converts an async function that expects a callback as last parameter into a promise
     * @param func
     * @returns {promise}
     */
    Util.toPromise = function(func){
        return function(){
            //noinspection JSAccessibilityCheck
            var args = Array.prototype.slice.call(arguments);
            var deferred = $.Deferred();
            args.push(function(){
                deferred.resolve.apply(this,arguments);
            });
            func.apply(this,args);
            return deferred.promise();
        };
    };

    var COLORS = [
        "#8AFFC8", //türkis
        "#8A9FFF", //light blue
        "#FF8A8A", //Rot
        "#FFC08A", //Orange
        "#FF8AD2", //Pink
        "#8AEBFF", //Blue
        "#C68AFF", //Lila
        "#8EFF8A" //green
    ];

    /**
     * Map an integer to one of ten colors
     * @param id
     * @returns {string}
     */
    Util.getColor = function(id){
        return COLORS[id%COLORS.length];
    };

    /*function hashCode(s){
     return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
     };*/

    return Util;

});