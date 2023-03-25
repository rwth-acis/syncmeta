/**
 * Namespace for ot operations
 * @namespace operations.ot
 */

import Operation from "../Operation";

    /**
     * OTOperation
     * @class operations.ot.OTOperation
     * @memberof operations.ot
     * @constructor
     * @param {string} name Name of operation
     * @param {string} value Value of operation
     * @param {string} type Type of operation
     * @param {number} position Position of operation
     */
    class OTOperation extends Operation {
    constructor(name, value, type, position) {
        super();
        /**
         * JabberId of the user who issued this activity
         * @type {string}
         * @private
         */
        var _sender = null;


        /**
         * Operation details
         * @type {{name: string, value: string, type: string, position: number}}
         * @private
         */
        var _operation = {
            name: name,
            value: value,
            type: type,
            position: position
        };

        /**
         * Set JabberId of the user who issued this activity
         * @param sender
         */
        this.setSender = function (sender) {
            _sender = sender;
        };

        /**
         * Get JabberId of the user who issued this activity
         */
        this.getSender = function () {
            return _sender;
        };

        /**
         * Get name of operation
         * @returns {string}
         */
        this.getName = function () {
            return _operation.name;
        };

        /**
         * Get value of operation
         * @returns {string}
         */
        this.getValue = function () {
            return _operation.value;
        };

        /**
         * Get type of operation
         * @returns {string}
         */
        this.getType = function () {
            return _operation.type;
        };

        /**
         * Get position of operation
         * @returns {number}
         */
        this.getPosition = function () {
            return _operation.position;
        };

        /**
         * Get JSON Representation of operation
         * @returns {{type: string, data: string}}
         */
        this.getOperationObject = function () {
            return _operation;
        };
    }
}

    export default OTOperation;

