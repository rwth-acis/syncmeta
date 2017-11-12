define([
    'operations/non_ot/NonOTOperation'
],/** @lends ToolSelectOperation */function(NonOTOperation) {

    ToolSelectOperation.TYPE = "ToolSelectOperation";

    /**
     * ToolSelectOperation
     * @class operations.non_ot.ToolSelectOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} toolName Name of selected tool
     */
    function ToolSelectOperation(toolName){
        /**
         * Name of selected tool
         * @type {string}
         */
        var selectedToolName = toolName;

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
        this.getSelectedToolName = function(){
            return selectedToolName;
        };

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    ToolSelectOperation.TYPE,
                    JSON.stringify({selectedToolName: selectedToolName})
                );
            }
            return nonOTOperation;
        };
    }

    return ToolSelectOperation;

});