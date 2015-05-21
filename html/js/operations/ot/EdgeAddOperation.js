define([
    'require',
    'operations/ot/EntityOperation',
    'operations/ot/OTOperation'
],/** @lends EdgeAddOperation */function(require,EntityOperation,OTOperation) {

    EdgeAddOperation.prototype = new EntityOperation();
	EdgeAddOperation.prototype.constructor = EdgeAddOperation;
    /**
     * EdgeAddOperation
     * @class operations.ot.EdgeAddOperation
     * @memberof operations.ot
     * @extends operations.ot.EntityOperation
     * @param {String} entityId Entity id of the entity this activity works on
     * @param {String} type Type of edge to add
     * @param {String} source Entity id of source node
     * @param {String} target Entity id of target node
     * @param {object} json JSON representation of edge
     * @param {string} viewId the identifier of the view
     * @constructor
     */
    function EdgeAddOperation(entityId,type,source,target,json, viewId,origin){
        var that = this;

        var _origin = origin;

        this.getOrigin = function(){
          return _origin;
        };

        this.setOrigin = function(origin){
            _origin = origin;
        };

        EntityOperation.call(this,EntityOperation.TYPES.EdgeAddOperation,entityId,CONFIG.ENTITY.EDGE);

        /**
         * the identifier of the view
         * @type {string}
         * @private
         */
        var _viewId = viewId;

        /**
         * Type of edge to add
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
         * JSON representation of edge
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
                    json: _json,
                    viewId: _viewId,
                    origin:_origin
                }),
                CONFIG.OPERATION.TYPE.INSERT,
                CONFIG.IWC.POSITION.EDGE.ADD
            );
        };

        /**
         * Get type of edge to add
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
         * get the identifier of the view
         * @returns {string}
         */
        this.getViewId = function(){
          return _viewId;
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
            return operation;
        };

        /**
         * Compute the inverse of the operation
         * @returns {EdgeDeleteOperation}
         */
        this.inverse = function(){
            var EdgeDeleteOperation = require('operations/ot/EdgeDeleteOperation');

            return new EdgeDeleteOperation(
                this.getEntityId(),
                this.getType(),
                this.getSource(),
                this.getTarget()
            );
        };
    }

    EdgeAddOperation.getOperationDescription = function(edgeType,edgeLabel,sourceNodeType,sourceNodeLabel,targetNodeType,targetNodeLabel,viewId){
        if(!edgeLabel && !viewId){
            return "..created a new " + edgeType + " between " + sourceNodeType + " " + sourceNodeLabel + " and " + targetNodeType + " " + targetNodeLabel;
        } else if(!viewId) {
            return "..created " + edgeType + " " + edgeLabel + " between " + sourceNodeType + " " + sourceNodeLabel + " and " + targetNodeType + " " + targetNodeLabel;
        }else{
            return "..created " + edgeType + " " + edgeLabel + " between " + sourceNodeType + " " + sourceNodeLabel + " and " + targetNodeType + " " + targetNodeLabel + " in View " + viewId;
        }
    };

    return EdgeAddOperation;

});