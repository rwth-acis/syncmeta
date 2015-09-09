define([
    'operations/non_ot/NonOTOperation'
],/** @lends WidgetEnterOperation */function(NonOTOperation) {

    WidgetEnterOperation.TYPE = "WidgetEnterOperation";

    /**
     * WidgetEnterOperation
     * @class operations.non_ot.WidgetEnterOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} widgetName Name of the entered widget
     */
    function WidgetEnterOperation(widgetName){
        /**
         * Name of selected tool
         * @type {string}
         */
        var enteredWidgetName = widgetName;

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
        this.getEnteredWidgetName = function(){
            return enteredWidgetName;
        };

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    WidgetEnterOperation.TYPE,
                    JSON.stringify({enteredWidgetName: enteredWidgetName})
                );
            }
            return nonOTOperation;
        };
    }

    return WidgetEnterOperation;

});
