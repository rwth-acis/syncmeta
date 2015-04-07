define([
    'operations/non_ot/NonOTOperation'
],/** @lends PerformCvgOperation */function(NonOTOperation) {

    PerformCvgOperation.TYPE = "PerformCvgOperation";

    /**
     * WidgetEnterOperation
     * @class operations.non_ot.WidgetEnterOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} json the json
     */
    function PerformCvgOperation(json){
        /**
         * Name of selected tool
         * @type {string}
         */
        var _json = json;

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
        this.getJSON = function(){
            return _json;
        };

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    PerformCvgOperation.TYPE,
                    JSON.stringify({json: _json})
                );
            }
            return nonOTOperation;
        };
    }

    return PerformCvgOperation;

});

