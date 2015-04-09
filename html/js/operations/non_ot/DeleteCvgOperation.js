define([
    'operations/non_ot/NonOTOperation'
],/** @lends DeleteCvgOperation */function(NonOTOperation) {

    DeleteCvgOperation.TYPE = "DeleteCvgOperation";

    /**
     * DeleteCvgOperation
     * @class operations.non_ot.DeleteCvgOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} deleteList array of ids to delete
     */
    function DeleteCvgOperation(deleteList){
        /**
         * Name of selected tool
         * @type {string}
         */
        var _deleteList = deleteList;

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var nonOTOperation = null;

        /**
         * Get the list with node ids to delete
         * @returns {string}
         */
        this.getDeleteList = function(){
            return _deleteList;
        };

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    DeleteCvgOperation.TYPE,
                    JSON.stringify({deleteList: _deleteList})
                );
            }
            return nonOTOperation;
        };
    }

    return DeleteCvgOperation;

});

