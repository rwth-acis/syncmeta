define([
    'operations/non_ot/NonOTOperation'
],/** @lends ViewInitOperation */function(NonOTOperation) {

    ViewInitOperation.TYPE = "ViewInitOperation";

    /**
     * ViewInitOperation
     * @class operations.non_ot.ViewInitOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} data Name of the entered widget
     */
    function ViewInitOperation(data, viewpoint){
        /**
         * Name of selected tool
         * @type {string}
         */
        var _data = data;

        var _viewpoint = viewpoint;
        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var nonOTOperation = null;

        /**
         * Get name of selected tool
         * @returns {string}
         */
        this.getData = function(){
            return _data;
        };

        this.getViewpoint= function(){
            return _viewpoint;
        };
        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    ViewInitOperation.TYPE,
                    JSON.stringify({data: _data, viewpoint:_viewpoint})
                );
            }
            return nonOTOperation;
        };
    }

    return ViewInitOperation;

});

