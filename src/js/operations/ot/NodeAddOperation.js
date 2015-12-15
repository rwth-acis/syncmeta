define([
    'require',
    'operations/ot/EntityOperation',
    'operations/ot/OTOperation'
],/** @lends NodeAddOperation */function(require,EntityOperation,OTOperation) {

    NodeAddOperation.prototype = new EntityOperation();
	NodeAddOperation.prototype.constructor = NodeAddOperation;
    /**
     * NodeAddOperation
     * @class operations.ot.NodeAddOperation
     * @memberof operations.ot
     * @extends operations.ot.EntityOperation
     * @param {String} entityId Entity id of the entity this activity works on
     * @param {String} type Type of node to add
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @param {number} zIndex Position of node on z-axis
     * @param {object} json JSON representation of node
     * @param {string} viewId the identifier of the view
     * @constructor
     */
    function NodeAddOperation(entityId,type,left,top,width,height,zIndex,json, viewId, oType){
        var that = this;



        EntityOperation.call(this,EntityOperation.TYPES.NodeAddOperation,entityId,CONFIG.ENTITY.NODE);

        /**
         * the identifier of the view
         * @type {string}
         * @private
         */
        var _viewId = viewId;

        var _oType = oType;

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
                    json: _json,
                    viewId:_viewId,
                    oType: _oType
                }),
                CONFIG.OPERATION.TYPE.INSERT,
                CONFIG.IWC.POSITION.NODE.ADD
            );
        };

        /**
         * Get type of node to add
         * @returns {String}
         */
        this.getType = function(){
            return _type;
        };

        this.getOriginType = function(){
            return _oType;
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
         * the identifier of the view
         * @returns {string}
         */
        this.getViewId = function(){
          return _viewId;
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
         * @returns {NodeDeleteOperation}
         */
        this.inverse = function(){
            var NodeDeleteOperation = require('operations/ot/NodeDeleteOperation');

            return new NodeDeleteOperation(
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

    NodeAddOperation.getOperationDescription = function(nodeType,nodeLabel,viewId){
        if(!nodeLabel && !viewId){
            return "..created a new " + nodeType;
        } else if(!viewId){
            return "..created " + nodeType + " " + nodeLabel;
        }else
            return ".. created " + nodeType + " " + nodeLabel + " in View " + viewId;
    };

    return NodeAddOperation;

});