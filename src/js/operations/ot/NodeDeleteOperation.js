define([
    'require',
    'operations/ot/EntityOperation',
    'operations/ot/OTOperation'
],/** @lends NodeDeleteOperation */function(require,EntityOperation,OTOperation) {

    NodeDeleteOperation.prototype = new EntityOperation();
	NodeDeleteOperation.prototype.constructor = NodeDeleteOperation;
    /**
     * NodeDeleteOperation
     * @class operations.ot.NodeDeleteOperation
     * @memberof operations.ot
     * @extends operations.ot.EntityOperation
     * @param {String} entityId Entity id of the entity this activity works on
     * @param {String} type Type of node to delete
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @param {number} zIndex Position of node on z-axis
     * @param {object} json JSON representation of node
     * @constructor
     */
    function NodeDeleteOperation(entityId,type,left,top,width,height,zIndex,json){
        var that = this;

        EntityOperation.call(this,EntityOperation.TYPES.NodeDeleteOperation,entityId,CONFIG.ENTITY.NODE);

        /**
         * Type of node to add
         * @type {String}
         * @private
         */
        var _type = type;

        /**
         * x-coordinate of node position
         * @type {number}
         * @private
         */
        var _left = left;

        /**
         * y-coordinate of node position
         * @type {number}
         * @private
         */
        var _top = top;

        /**
         * Width of node
         * @type {number}
         * @private
         */
        var _width = width;

        /**
         * Height of node
         * @type {number}
         * @private
         */
        var _height = height;

        /**
         * Position of node on z-axis
         * @type {number}
         * @private
         */
        var _zIndex = zIndex;

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
                CONFIG.ENTITY.NODE+":"+that.getEntityId(),
                JSON.stringify({
                    type: _type,
                    left: _left,
                    top: _top,
                    width: _width,
                    height: _height,
                    zIndex: _zIndex,
                    json: _json
                }),
                CONFIG.OPERATION.TYPE.UPDATE,
                CONFIG.IWC.POSITION.NODE.DEL
            );
        };

        /**
         * Get type of node to add
         * @returns {String}
         */
        this.getType = function(){
            return _type;
        };

        /**
         * Get x-coordinate of node position
         * @returns {number}
         */
        this.getLeft = function(){
            return _left;
        };

        /**
         * Get y-coordinate of node position
         * @returns {number}
         */
        this.getTop = function(){
            return _top;
        };

        /**
         * Get width of node
         * @returns {number}
         */
        this.getWidth = function(){
            return _width;
        };

        /**
         * Get height of node
         * @returns {number}
         */
        this.getHeight = function(){
            return _height;
        };

        /**
         * Get position of node on z-axis
         * @returns {number}
         */
        this.getZIndex = function(){
            return _zIndex;
        };

        /**
         * Get JSON representation of node
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
            var edge;
            switch(operation.getOperationType()){
                case EntityOperation.TYPES.AttributeAddOperation:
                case EntityOperation.TYPES.AttributeDeleteOperation:
                    edge = EntityManager.findEdge(operation.getRootSubjectEntityId());
                    if(edge && (edge.getSource().getEntityId() === this.getEntityId() || edge.getTarget().getEntityId() === this.getEntityId()) ){
                        return null;
                    }
                    if(this.getEntityId() === operation.getRootSubjectEntityId()){
                        return null;
                    }
                    break;
                case EntityOperation.TYPES.EdgeAddOperation:
                case EntityOperation.TYPES.EdgeDeleteOperation:
                    edge = EntityManager.findEdge(operation.getEntityId());
                    if(edge && (edge.getSource().getEntityId() === this.getEntityId() || edge.getTarget().getEntityId() === this.getEntityId()) ){
                        return null;
                    }
                    break;
                case EntityOperation.TYPES.NodeAddOperation:
                case EntityOperation.TYPES.NodeDeleteOperation:
                case EntityOperation.TYPES.NodeMoveOperation:
                case EntityOperation.TYPES.NodeResizeOperation:
                    if(this.getEntityId() === operation.getEntityId()){
                        return null;
                    }
                    break;
                case EntityOperation.TYPES.ValueChangeOperation:
                    edge = EntityManager.findEdge(operation.getRootSubjectEntityId());
                    if(edge && (edge.getSource().getEntityId() === this.getEntityId() || edge.getTarget().getEntityId() === this.getEntityId()) ){
                        return null;
                    }
                    if(operation.getRootSubjectEntityId() === this.getEntityId()){
                        return null;
                    }
                    break;
            }

            return operation;
        };

        /**
         * Compute the inverse of the operation
         * @returns {operations.ot.NodeAddOperation}
         */
        this.inverse = function(){
            var NodeAddOperation = require('operations/ot/NodeAddOperation');

            return new NodeAddOperation(
                this.getEntityId(),
                this.getType(),
                this.getLeft(),
                this.getTop(),
                this.getWidth(),
                this.getHeight(),
                this.getZIndex(),
                json
            );
        };
    }

    NodeDeleteOperation.getOperationDescription = function(nodeType,nodeLabel){
        if(!nodeLabel){
            return "..deleted " + nodeType;
        } else {
            return "..deleted " + nodeType + " " + nodeLabel;
        }
    };

    return NodeDeleteOperation;

});