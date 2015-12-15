define([
    'operations/non_ot/NonOTOperation'
],/** @lends EntitySelectOperation */function(NonOTOperation) {

    EntitySelectOperation.TYPE = "EntitySelectOperation";

    /**
     * Entity Select Operation
     * @class operations.non_ot.EntitySelectOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} selectedEntityId Entity id of the selected entity
     */
    function EntitySelectOperation(selectedEntityId, destination){
        var _destination = destination;
        /**
         * Entity id of the selected entity
         * @type {string}
         * @private
         */
        var _selectedEntityId = selectedEntityId;

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
        this.getSelectedEntityId = function(){
            return _selectedEntityId;
        };

        this.getDestination = function(){
            return _destination;
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
                    EntitySelectOperation.TYPE,
                    JSON.stringify({selectedEntityId: _selectedEntityId,
                                    destination:_destination})
                );
            }
            return _nonOTOperation;
        };
    }

    return EntitySelectOperation;

});