define([
    'operations/non_ot/NonOTOperation'
],/** @lends ToolGuidanceOperation */function(NonOTOperation) {

    ObjectGuidanceFollowedOperation.TYPE = "ObjectGuidanceFollowedOperation";

    /**
     * ToolGuidanceOperation
     * @class operations.non_ot.ToolGuidanceOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} toolName Name of selected tool
     */
    function ObjectGuidanceFollowedOperation(objectId, objectGuidanceRule){

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var _nonOTOperation = null;
        var _objectId = objectId;
        var _objectGuidanceRule = objectGuidanceRule;

        /**
         * Set corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         */
        this.setNonOTOperation = function(nonOTOperation){
            _nonOTOperation = nonOTOperation;
        };
        
        /**
         * Get corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         */
        this.getNonOTOperation = function(){
            return _nonOTOperation;
        };

        this.getObjectId = function(){
            return _objectId;
        };

        this.getObjectGuidanceRule = function(){
            return _objectGuidanceRule;
        };

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(_nonOTOperation === null){
                _nonOTOperation = new NonOTOperation(
                    ObjectGuidanceFollowedOperation.TYPE,
                    JSON.stringify({objectId: objectId, objectGuidanceRule: objectGuidanceRule})
                );
            }
            return _nonOTOperation;
        };
    }

    return ObjectGuidanceFollowedOperation;

});