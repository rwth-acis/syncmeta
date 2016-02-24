define([
    'require',
    'operations/ot/EntityOperation',
    'operations/ot/OTOperation'
],/** @lends NodeMoveZOperation */function(require,EntityOperation,OTOperation) {

    NodeMoveZOperation.TYPE ="NodeMoveZOperation";
    NodeMoveZOperation.prototype = new EntityOperation();
	NodeMoveZOperation.prototype.constructor = NodeMoveZOperation;
    /**
     * NodeMoveZOperation
     * @class operations.ot.NodeMoveZOperation
     * @memberof operations.ot
     * @extends operations.ot.EntityOperation
     * @param {String} entityId Entity id of the entity this activity works on
     * @param {number} offsetZ Offset in z-direction
     * @constructor
     */
    function NodeMoveZOperation(entityId,offsetZ,jabberId){
        var that = this;

        EntityOperation.call(this,EntityOperation.TYPES.NodeMoveZOperation,entityId,CONFIG.ENTITY.NODE);

        var _jabberId = jabberId;

        /**
         * Offset in y-direction
         * @type {number}
         * @private
         */
        var _offsetZ = offsetZ;

        /**
         * Create OTOperation for operation
         * @returns {operations.ot.OTOperation}
         */
        var createOTOperation = function(){
            return new OTOperation(
                CONFIG.ENTITY.NODE+":"+that.getEntityId(),
                JSON.stringify({
                    offsetZ: _offsetZ,
                    jabberId:_jabberId
                }),
                CONFIG.OPERATION.TYPE.UPDATE,
                CONFIG.IWC.POSITION.NODE.Z
            );
        };

        /**
         * Get offset in z-direction
         * @returns {number}
         */
        this.getOffsetZ = function(){
            return _offsetZ;
        };

        this.getJabberId = function(){
            return _jabberId;
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
         * @returns {NodeMoveZOperation}
         */
        this.inverse = function(){
            var NodeMoveZOperation = require('operations/ot/NodeMoveZOperation');

            return new NodeMoveZOperation(
                this.getEntityId(),
                -this.getOffsetZ()
            );
        };
    }

    NodeMoveZOperation.getOperationDescription = function(nodeType,nodeLabel,viewId){
        if(!nodeLabel && !viewId){
            return "..moved " + nodeType;
        } else if(!viewId) {
            return "..moved " + nodeType + " " + nodeLabel;
        }
        else{
            return "..moved " + nodeType  + " " + nodeLabel + " in View " + viewId;
        }
    };

    NodeMoveZOperation.prototype.toJSON =function(){
        return {
            id:this.getEntityId(),
            offsetZ:this.getOffsetZ(),
            jabberId:this.getJabberId()
        }
    };
    return NodeMoveZOperation;

});