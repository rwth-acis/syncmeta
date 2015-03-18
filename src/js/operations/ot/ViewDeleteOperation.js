define([
    'require',
    'operations/ot/EntityOperation',
    'operations/ot/OTOperation'
],/** @lends ViewDeleteOperation */function(require,EntityOperation,OTOperation) {

    ViewDeleteOperation.prototype = new EntityOperation();
    ViewDeleteOperation.prototype.constructor = ViewDeleteOperation;
    /**
     * ViewDeleteOperation
     * @class operations.ot.ViewDeleteOperation
     * @memberof operations.ot
     * @extends operations.ot.EntityOperation
     * @constructor
     */
    function ViewDeleteOperation(viewId){
        var that = this;

        EntityOperation.call(this,EntityOperation.TYPES.ViewDeleteOperation,viewId,CONFIG.ENTITY.VIEW);

        /**
         * Type of node to add
         * @type {String}
         * @private
         */
        var _viewId = viewId;

        /**
         * Create OTOperation for operation
         * @returns {operations.ot.OTOperation}
         */
        var createOTOperation = function(){
            return new OTOperation(
                CONFIG.ENTITY.VIEW+":"+that.getViewId(),
                JSON.stringify({
                    viewId: _viewId
                }),
                CONFIG.OPERATION.TYPE.DELETE,
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


         }

    return ViewDeleteOperation;

});