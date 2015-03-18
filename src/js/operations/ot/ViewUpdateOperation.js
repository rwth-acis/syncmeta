define([
    'require',
    'operations/ot/EntityOperation',
    'operations/ot/OTOperation'
],/** @lends ViewUpdateOperation */function(require,EntityOperation,OTOperation) {

    ViewUpdateOperation.prototype = new EntityOperation();
    ViewUpdateOperation.prototype.constructor = ViewUpdateOperation;
    /**
     * ViewUpdateOperation
     * @class operations.ot.ViewUpdateOperation
     * @memberof operations.ot
     * @extends operations.ot.EntityOperation
     * @constructor
     */
    function ViewUpdateOperation(viewId, viewUri){
        var that = this;

        EntityOperation.call(this,EntityOperation.TYPES.ViewUpdateOperation,viewId,CONFIG.ENTITY.VIEW);

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

        /**
         * Create OTOperation for operation
         * @returns {operations.ot.OTOperation}
         */
        var createOTOperation = function(){
            return new OTOperation(
                CONFIG.ENTITY.VIEW+":"+that.getViewId(),
                JSON.stringify({
                    viewId: _viewId,
                    left: _viewUri
                }),
                CONFIG.OPERATION.TYPE.UPDATE,
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


    return ViewUpdateOperation;

});