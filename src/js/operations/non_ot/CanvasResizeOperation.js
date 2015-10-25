define([
    'operations/non_ot/NonOTOperation'
],/** @lends EntitySelectOperation */function(NonOTOperation) {

    CanvasResizeOperation.TYPE = "CanvasResizeOperation";

    /**
     * Entity Select Operation
     * @class operations.non_ot.EntitySelectOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} selectedEntityId Entity id of the selected entity
     */
    function CanvasResizeOperation(width, height){

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var _nonOTOperation = null;

        this.getWidth = function(){
            return width;
        };

        this.getHeight = function(){
            return height;
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
                    CanvasResizeOperation.TYPE,
                    JSON.stringify({
                        width: width,
                        height: height
                    })
                );
            }
            return _nonOTOperation;
        };
    }

    return CanvasResizeOperation;

});