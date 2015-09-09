define([
    'operations/non_ot/NonOTOperation'
],/** @lends InitModelTypesOperation */function(NonOTOperation) {

    InitModelTypesOperation.TYPE = "InitModelTypesOperation";

    /**
     * InitModelTypesOperation
     * @class operations.non_ot.InitModelTypesOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} p_vls the visual language specification
     */
    function InitModelTypesOperation(p_vls){
        /**
         * Name of selected tool
         * @type {string}
         */
        var  vls= p_vls;

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var nonOTOperation = null;

        /**
         * Get name of selected tool
         * @returns {string}
         */
        this.getVLS = function(){
            return vls;
        };

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    InitModelTypesOperation.TYPE,
                    JSON.stringify({vls: vls})
                );
            }
            return nonOTOperation;
        };
    }

    return  InitModelTypesOperation;
});
