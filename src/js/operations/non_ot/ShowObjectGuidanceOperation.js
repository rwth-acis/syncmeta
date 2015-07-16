define([
    'operations/non_ot/NonOTOperation'
],/** @lends ToolGuidanceOperation */function(NonOTOperation) {

    ShowObjectGuidanceOperation.TYPE = "ShowObjectGuidanceOperation";

    /**
     * ToolGuidanceOperation
     * @class operations.non_ot.ToolGuidanceOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} toolName Name of selected tool
     */
    function ShowObjectGuidanceOperation(objectId, objectGuidanceRules){

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var nonOTOperation = null;
        var _objectId = objectId;
        var _objectGuidanceRules = objectGuidanceRules;

        this.getObjectId = function(){
            return _objectId;
        };

        this.getObjectGuidanceRules = function(){
            return _objectGuidanceRules;
        }

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    ShowObjectGuidanceOperation.TYPE,
                    JSON.stringify({objectId: objectId, objectGuidanceRules: objectGuidanceRules})
                );
            }
            return nonOTOperation;
        };
    }

    return ShowObjectGuidanceOperation;

});