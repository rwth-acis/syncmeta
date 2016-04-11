define([
    'operations/non_ot/NonOTOperation'
],/** @lends EntitySelectOperation */function(NonOTOperation) {

    BindYTextOperation.TYPE = "BindYTextOperation";

    /**
     * BindYTextOperation
     * @class operations.non_ot.BindYTextOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} entityId Entity id
     */

    function BindYTextOperation(entityId,data){
        /**
         * Entity id of the selected entity
         * @type {string}
         * @private
         */
        var _entityId = entityId;

        var _data = data;

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var _nonOTOperation = null;

        /**
         * Get entity id of the selected entity
         * @returns {string}
         */
        this.getEntityId = function(){
            return _entityId;
        };

        this.getData = function(){
            return _data;
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
                    BindYTextOperation.TYPE,
                    JSON.stringify({
                        entityId: _entityId,
                        data:_data
                    })
                );
            }
            return _nonOTOperation;
        };
    }


    return BindYTextOperation;

});