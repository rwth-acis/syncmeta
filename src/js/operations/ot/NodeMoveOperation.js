define([
    'require',
    'operations/ot/EntityOperation',
    'operations/ot/OTOperation'
],/** @lends NodeMoveOperation */function(require,EntityOperation,OTOperation) {

    NodeMoveOperation.TYPE ="NodeMoveOperation";
    NodeMoveOperation.prototype = new EntityOperation();
	NodeMoveOperation.prototype.constructor = NodeMoveOperation;
    /**
     * NodeMoveOperation
     * @class operations.ot.NodeMoveOperation
     * @memberof operations.ot
     * @extends operations.ot.EntityOperation
     * @param {String} entityId Entity id of the entity this activity works on
     * @param {number} offsetX Offset in x-direction
     * @param {number} offsetY Offset in y-direction
     * @constructor
     */
    function NodeMoveOperation(entityId,offsetX,offsetY){
        var that = this;

        EntityOperation.call(this,EntityOperation.TYPES.NodeMoveOperation,entityId,CONFIG.ENTITY.NODE);

        /**
         * Offset in x-direction
         * @type {number}
         * @private
         */
        var _offsetX = offsetX;

        /**
         * Offset in y-direction
         * @type {number}
         * @private
         */
        var _offsetY = offsetY;

        /**
         * Create OTOperation for operation
         * @returns {operations.ot.OTOperation}
         */
        var createOTOperation = function(){
            return new OTOperation(
                CONFIG.ENTITY.NODE+":"+that.getEntityId(),
                JSON.stringify({
                    offsetX: _offsetX,
                    offsetY: _offsetY
                }),
                CONFIG.OPERATION.TYPE.UPDATE,
                CONFIG.IWC.POSITION.NODE.POS
            );
        };

        /**
         * Get offset in x-direction
         * @returns {number}
         */
        this.getOffsetX = function(){
            return _offsetX;
        };

        /**
         * Get offset in y-direction
         * @returns {number}
         */
        this.getOffsetY = function(){
            return _offsetY;
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
            return operation;
        };

        /**
         * Compute the inverse of the operation
         * @returns {NodeMoveOperation}
         */
        this.inverse = function(){
            var NodeMoveOperation = require('operations/ot/NodeMoveOperation');

            return new NodeMoveOperation(
                this.getEntityId(),
                -this.getOffsetX(),
                -this.getOffsetY()
            );
        };
    }

    NodeMoveOperation.getOperationDescription = function(nodeType,nodeLabel,viewId){
        if(!nodeLabel && !viewId){
            return "..moved " + nodeType;
        } else if(!viewId) {
            return "..moved " + nodeType + " " + nodeLabel;
        }
        else{
            return "..moved " + nodeType + " " + nodeLabel + " in View " +viewId;
        }
    };

    NodeMoveOperation.prototype.toJSON = function(){
        return {
            id:this.getEntityId(),
            offsetX:this.getOffsetX(),
            offsetY:this.getOffsetY()
        }
    };

    return NodeMoveOperation;

});