/**
 * Namespace for non ot operations
 * @namespace operations.non_ot
 */

define([
    'operations/Operation'
],/** @lends NonOTOperation */function(Operation) {

    NonOTOperation.prototype = new Operation();
    NonOTOperation.prototype.constructor = NonOTOperation;
    /**
     * NonOTOperation
     * @class operations.non_ot.NonOTOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} type Type of Operation
     * @param {string} data Additional data for operation
     */
    function NonOTOperation(type,data){
        /**
         * JabberId of the user who issued this activity
         * @type {string}
         * @private
         */
        var _sender = null;

        /**
         * Operation details
         * @type {{type: string, data: string}}
         * @private
         */
        var _operation = {
            type: type,
            data: data
        };

        /**
         * Set JabberId of the user who issued this activity
         * @param sender
         */
        this.setSender = function(sender){
            _sender = sender;
        };

        /**
         * Get JabberId of the user who issued this activity
         * @returns {string}
         */
        this.getSender = function(){
            return _sender;
        };

        /**
         * Get type of Operation
         * @returns {string}
         */
        this.getType = function(){
            //noinspection JSAccessibilityCheck
            return _operation.type;
        };

        /**
         * Get additional data for operation
         * @returns {string}
         */
        this.getData = function(){
            return _operation.data;
        };

        /**
         * Get JSON Representation of operation
         * @returns {{type: string, data: string}}
         */
        this.getOperationObject = function(){
            return _operation;
        };
    }

    return NonOTOperation;

});