define([
    'operations/non_ot/NonOTOperation'
],/** @lends EntitySelectOperation */function(NonOTOperation) {

    CanvasDragOperation.TYPE = "CanvasDragOperation";

    /**
     * Entity Select Operation
     * @class operations.non_ot.EntitySelectOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} selectedEntityId Entity id of the selected entity
     */
    function CanvasDragOperation(left, top){

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var _nonOTOperation = null;

        this.getLeft = function(){
            return left;
        };

        this.getTop = function(){
            return top;
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
                    CanvasDragOperation.TYPE,
                    JSON.stringify({
                        left: left,
                        top: top
                    })
                );
            }
            return _nonOTOperation;
        };
    }

    return CanvasDragOperation;

});