define([
    'require',
    'operations/ot/EntityOperation',
    'operations/ot/OTOperation'
],/** @lends ViewAddOperation */function(require,EntityOperation,OTOperation) {

    ViewAddOperation.prototype = new EntityOperation();
    ViewAddOperation.prototype.constructor = ViewAddOperation;
    /**
     * ViewAddOperation
     * @class operations.ot.ViewAddOperation
     * @memberof operations.ot
     * @extends operations.ot.EntityOperation
     * @constructor
     */
    function ViewAddOperation(viewId, viewUri,viewpointUri){
        var that = this;

        EntityOperation.call(this,EntityOperation.TYPES.ViewAddOperation,viewId,CONFIG.ENTITY.VIEW);

        /**
         * Type of node to add
         * @type {String}
         * @private
         */
        var _viewId = viewId;

        /**
         * x-coordinate of node position
         * @type {number}
         * @private
         */
        var _viewUri = viewUri;

        var _viewpointUri = viewpointUri;

        /**
         * Create OTOperation for operation
         * @returns {operations.ot.OTOperation}
         */
        var createOTOperation = function(){
            return new OTOperation(
                CONFIG.ENTITY.VIEW+":"+that.getViewId(),
                JSON.stringify({
                    viewId: _viewId,
                    viewUri: _viewUri,
                    viewpointUri:_viewpointUri

                }),
                CONFIG.OPERATION.TYPE.INSERT,
                CONFIG.IWC.POSITION.NODE.ADD
            );
        };

        /**
         * Get type of node to add
         * @returns {String}
         */
        this.getViewId = function(){
            return _viewId;
        };

        /**
         * Get x-coordinate of node position
         * @returns {number}
         */
        this.getViewUri = function(){
            return _viewUri;
        };

        this.getViewpointUri = function(){
            return _viewpointUri;
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
         * Compute the inverse of the operation
         * @returns {NodeDeleteOperation}
         */
        this.inverse = function(){
            var ViewDeleteOperation = require('operations/ot/ViewDeleteOperation');

            return new ViewDeleteOperation(
                that.getViewId()
            );
        };
    }


    return ViewAddOperation;

});