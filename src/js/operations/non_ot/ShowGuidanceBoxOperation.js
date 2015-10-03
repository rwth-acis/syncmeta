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
    function ShowGuidanceBoxOperation(guidance, entityId){

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var nonOTOperation = null;
        var _guidance = guidance;
        var _entityId = entityId
        // var _objectGuidanceRules = objectGuidanceRules;

        this.getGuidance = function(){
            return _guidance;
        };

        this.getEntityId = function(){
            return _entityId;
        }

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
                    JSON.stringify({guidance: _guidance, entityId: _entityId})
                );
            }
            return nonOTOperation;
        };
    }

    return ShowGuidanceBoxOperation;

});