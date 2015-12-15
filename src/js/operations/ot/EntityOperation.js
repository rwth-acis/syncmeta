define([],/** @lends EntityOperation */function() {

    EntityOperation.TYPES = {
        AttributeAddOperation: "AttributeAddOperation",
        AttributeDeleteOperation: "AttributeDeleteOperation",
        EdgeAddOperation: "EdgeAddOperation",
        EdgeDeleteOperation: "EdgeDeleteOperation",
        NodeAddOperation: "NodeAddOperation",
        NodeDeleteOperation: "NodeDeleteOperation",
        NodeMoveOperation: "NodeMoveOperation",
        NodeMoveZOperation: "NodeMoveZOperation",
        NodeResizeOperation: "NodeResizeOperation",
        ValueChangeOperation: "ValueChangeOperation"
    };

    /**
     * EntityOperation
     * @class operations.ot.EntityOperation
     * @memberof operations.ot
     * @param {string} operationType Type of operation
     * @param {string} entityId Entity id of the entity this activity works on
     * @param {string} entityType Type of the entity this activity works on
     * @constructor
     */
    function EntityOperation(operationType,entityId,entityType){
        /**
         * Type of operation
         * @type {string}
         * @private
         */
        var _operationType = operationType;

        /**
         * Corresponding OtOperation
         * @type {operations.ot.OTOperation}
         * @private
         */
        var _otOperation = null;

        /**
         * Entity id of the entity this activity works on
         * @type {string}
         * @private
         */
        var _entityId = entityId;

        /**
         * Type of the entity this activity works on
         * @type {string}
         * @private
         */
        var _entityType = entityType;

        /**
         * Get type of operation
         * @returns {string}
         */
        this.getOperationType = function(){
            return _operationType;
        };

        /**
         * Set corresponding ot operation
         * @param {operations.ot.OTOperation} otOperation
         */
        this.setOTOperation = function(otOperation){
            _otOperation = otOperation;
        };

        /**
         * Get corresponding ot operation
         * @returns {operations.ot.OTOperation}
         * @private
         */
        this._getOTOperation = function(){
            return _otOperation;
        };

        /**
         * Get entity id of the entity this activity works onf
         * @returns {string}
         */
        this.getEntityId = function(){
            return _entityId;
        };


        //noinspection JSUnusedGlobalSymbols
        /**
         * Get type of the entity this activity works on
         * @returns {string}
         */
        this.getEntityType = function(){
            return _entityType;
        };

        /**
         * Adjust the passed operation in the history of operation
         * when this operation is applied remotely after the passed operation
         * on an graph instance stored in the passed EntityManager
         * @param {canvas_widget.EntityManager} EntityManager
         * @param {EntityOperation} operation Remote operation
         * @returns {EntityOperation}
         */
        this.adjust = function(EntityManager,operation){
            return operation;
        };

        /**
         * Compute the inverse of the operation
         * @returns {operations.ot.EntityOperation}
         */
        this.inverse = function(){
            return this;
        };
    }

    //noinspection JSAccessibilityCheck
    /**
     * Get corresponding ot operation
     * @returns {operations.ot.OTOperation}
     */
    EntityOperation.prototype.getOTOperation = function(){
        return this._getOTOperation();
    };

    return EntityOperation;

});