define([
    'operations/non_ot/NonOTOperation'
],/** @lends SetViewTypesOperation */function(NonOTOperation) {

    SetViewTypesOperation.TYPE = "SetViewTypesOperation";

    /**
     * SetViewTypesOperation
     * @class operations.non_ot.WidgetEnterOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {boolean} flag enable (true)/disable(false) the view types of the vml in the palette widget
     */
    function SetViewTypesOperation(flag){
        /**
         * Enable or disable the view types of the vml
         * @type {boolean}
         * @private
         */
        var _flag = flag;

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
        this.getFlag = function(){
            return _flag;
        };

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    SetViewTypesOperation.TYPE,
                    JSON.stringify({flag: _flag})
                );
            }
            return nonOTOperation;
        };
    }

    return SetViewTypesOperation;

});
