define([
    'operations/non_ot/NonOTOperation'
],/** @lends ToolGuidanceOperation */function(NonOTOperation) {

    ShowToolGuidanceOperation.TYPE = "ShowToolGuidanceOperation";

    /**
     * ToolGuidanceOperation
     * @class operations.non_ot.ToolGuidanceOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} toolName Name of selected tool
     */
    function ShowToolGuidanceOperation(nodeId, toolType){

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var nonOTOperation = null;
        var _nodeId = nodeId;
        var _toolType = toolType;

        this.getNodeId = function(){
            return _nodeId;
        };

        this.getToolType = function(){
            return _toolType;
        }

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    ShowToolGuidanceOperation.TYPE,
                    JSON.stringify({nodeId: nodeId, toolType: toolType})
                );
            }
            return nonOTOperation;
        };
    }

    return ShowToolGuidanceOperation;

});