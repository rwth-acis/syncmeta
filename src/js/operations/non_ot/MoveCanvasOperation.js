define([
    'operations/non_ot/NonOTOperation'
],/** @lends EntitySelectOperation */function(NonOTOperation) {

    MoveCanvasOperation.TYPE = "MoveCanvasOperation";

    /**
     * Entity Select Operation
     * @class operations.non_ot.EntitySelectOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} selectedEntityId Entity id of the selected entity
     */
    function MoveCanvasOperation(objectId, transition){

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var _nonOTOperation = null;

        this.getObjectId = function(){
            return objectId;
        };

        this.getTransition = function(){
            return transition;
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
                    MoveCanvasOperation.TYPE,
                    JSON.stringify({
                        objectId: objectId,
                        transition: transition
                    })
                );
            }
            return _nonOTOperation;
        };
    }

    return MoveCanvasOperation;

});