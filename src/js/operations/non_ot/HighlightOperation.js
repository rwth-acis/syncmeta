define([
    'operations/non_ot/NonOTOperation'
],/** @lends HighlightOperation */function(NonOTOperation) {

    HighlightOperation.TYPE = "HighlightOperation";

    /**
     * HighlightOperation
     * @class operations.non_ot.HighlightOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} entityId identifier of the entity to highlight
     * @param {string} viewId name of the identifier of the view
     */
    function HighlightOperation(entityId,viewId){
        /**
         * Name of selected tool
         * @type {string}
         */
        var _entityId = entityId;

        /**
         * name of the identifier of the view
         * @type {string}
         * @private
         */
        var _viewId = viewId;

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var nonOTOperation = null;

        /**
         * Get identifier of the entity
         * @returns {string}
         */
        this.getEntityId= function(){
            return _entityId;
        };

        /**
         * Get the identifier of the view
         * @returns {string}
         */
        this.getViewId = function () {
            return _viewId;
        };

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    HighlightOperation.TYPE,
                    JSON.stringify({entityId: _entityId, viewId:_viewId})
                );
            }
            return nonOTOperation;
        };
    }

    return HighlightOperation;

});
