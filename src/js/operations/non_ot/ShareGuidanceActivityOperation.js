define([
    'operations/non_ot/NonOTOperation'
],/** @lends EntitySelectOperation */function(NonOTOperation) {

    ShareGuidanceActivity.TYPE = "ShareGuidanceActivity";

    /**
     * Entity Select Operation
     * @class operations.non_ot.EntitySelectOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} selectedEntityId Entity id of the selected entity
     */
    function ShareGuidanceActivity(id, initialNode, joinNode, objectMappings, remainingThreads){

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var _nonOTOperation = null;

        this.getId = function(){
            return id;
        };

        this.getInitialNode = function(){
            return initialNode;
        };

        this.getJoinNode = function(){
            return joinNode;
        };

        this.getObjectMappings = function(){
            return objectMappings;
        };

        this.getRemainingThreads = function(){
            return remainingThreads;
        };

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

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(_nonOTOperation === null){
                _nonOTOperation = new NonOTOperation(
                    ShareGuidanceActivity.TYPE,
                    JSON.stringify({
                        id: id,
                        initialNode: initialNode,
                        joinNode: joinNode,
                        objectMappings: objectMappings,
                        remainingThreads: remainingThreads
                    })
                );
            }
            return _nonOTOperation;
        };
    }

    return ShareGuidanceActivity;

});