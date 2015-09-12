define([
    'operations/non_ot/NonOTOperation'
],/** @lends ToolGuidanceOperation */function(NonOTOperation) {

    ShowGuidanceBoxOperation.TYPE = "ShowGuidanceBoxOperation";

    /**
     * ToolGuidanceOperation
     * @class operations.non_ot.ToolGuidanceOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} toolName Name of selected tool
     */
    function ShowGuidanceBoxOperation(guidance){

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var nonOTOperation = null;
        var _guidance = guidance;
        // var _objectGuidanceRules = objectGuidanceRules;

        this.getGuidance = function(){
            return _guidance;
        };

        // this.getObjectGuidanceRules = function(){
        //     return _objectGuidanceRules;
        // }

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    ShowGuidanceBoxOperation.TYPE,
                    JSON.stringify({guidance: guidance})
                );
            }
            return nonOTOperation;
        };
    }

    return ShowGuidanceBoxOperation;

});