define([
    'require',
    'operations/ot/EntityOperation',
    'operations/ot/OTOperation'
],/** @lends EdgeDeleteOperation */function(require,EntityOperation,OTOperation) {

    EdgeDeleteOperation.TYPE = "EdgeDeleteOperation";
    EdgeDeleteOperation.prototype = new EntityOperation();
	EdgeDeleteOperation.prototype.constructor = EdgeDeleteOperation;
    /**
     * EdgeDeleteOperation
     * @class operations.ot.EdgeDeleteOperation
     * @memberof operations.ot
     * @extends operations.ot.EntityOperation
     * @param entityId Entity id of the entity this activity works on
     * @param {String} type Type of edge to delete
     * @param {String} source Entity id of source node
     * @param {String} target Entity id of target node
     * @param {object} json JSON representation of edge
     * @constructor
     */
    function EdgeDeleteOperation(entityId,type,source,target,json){
        var that = this;

        EntityOperation.call(this,EntityOperation.TYPES.EdgeDeleteOperation,entityId,CONFIG.ENTITY.EDGE);

        /**
         * Type of edge to delte
         * @type {String}
         * @private
         */
        var _type = type;

        /**
         * Entity id of source node
         * @type {String}
         * @private
         */
        var _source = source;

        /**
         * Entity id of target node
         * @type {String}
         * @private
         */
        var _target = target;

        /**
         * JSON representation of node
         * @type {Object}
         * @private
         */
        var _json = json;

        /**
         * Create OTOperation for operation
         * @returns {operations.ot.OTOperation}
         */
        var createOTOperation = function(){
            return new OTOperation(
                CONFIG.ENTITY.EDGE+":"+that.getEntityId(),
                JSON.stringify({
                    type: _type,
                    source: _source,
                    target: _target,
                    json: _json
                }),
                CONFIG.OPERATION.TYPE.UPDATE,
                CONFIG.IWC.POSITION.EDGE.DEL
            );
        };

        /**
         * Get type of edge to delete
         * @returns {String}
         */
        this.getType = function(){
            return _type;
        };

        /**
         * Get entity id of source node
         * @returns {String}
         */
        this.getSource = function(){
            return _source;
        };

        /**
         * Get entity id of target node
         * @returns {String}
         */
        this.getTarget = function(){
            return _target;
        };

        /**
         * Get JSON representation of edge
         * @return {Object}
         */
        this.getJSON = function(){
            return _json;
        };

        /**
         * Get corresponding ot operation
         * @returns {operations.ot.OTOperation}
         * @private
         */
        this.getOTOperation = function(){
            var otOperation = EntityOperation.prototype.getOTOperation.call(this);
            if(otOperation === null){
                otOperation = createOTOperation();
                this.setOTOperation(otOperation);
            }
            return otOperation;
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
            switch(operation.getOperationType()){
                case EntityOperation.TYPES.AttributeAddOperation:
                case EntityOperation.TYPES.AttributeDeleteOperation:
                    if(this.getEntityId() === operation.getRootSubjectEntityId()){
                        return null;
                    }
                    break;
                case EntityOperation.TYPES.EdgeAddOperation:
                case EntityOperation.TYPES.EdgeDeleteOperation:
                    if(this.getEntityId() === operation.getEntityId()){
                        return null;
                    }
                    break;
                case EntityOperation.TYPES.ValueChangeOperation:
                    if(this.getEntityId() === operation.getRootSubjectEntityId()){
                        return null;
                    }
                    break;
            }

            return operation;
        };

        /**
         * Compute the inverse of the operation
         * @returns {EdgeAddOperation}
         */
        this.inverse = function(){
            var EdgeAddOperation = require('operations/ot/EdgeAddOperation');

            return new EdgeAddOperation(
                this.getEntityId(),
                this.getType(),
                this.getSource(),
                this.getTarget()
            );
        };

    }

    EdgeDeleteOperation.getOperationDescription = function(edgeType,edgeLabel, viewId){
        if(!edgeLabel && !viewId){
            return "..deleted " + edgeType;
        } else if(!viewId) {
            return "..deleted " + edgeType + " " + edgeLabel;
        }
        else{
            return "..deleted " + edgeType + " " + edgeLabel + "in View " + viewId;
        }
    };

    EdgeDeleteOperation.prototype.toJSON = function(){
        return {
            id:this.getEntityId()
        }
    };

    return EdgeDeleteOperation;

});