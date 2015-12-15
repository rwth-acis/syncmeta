define([
    'operations/non_ot/NonOTOperation'
],/** @lends PerformCvgOperation */function(NonOTOperation) {

    PerformCvgOperation.TYPE = "PerformCvgOperation";

    /**
     * PerformCvgOperation
     * @class operations.non_ot.PerformCvgOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {object} json the json
     * @param {object} map the mapping of the nodes/edges to propagate the remote users
     */
    function PerformCvgOperation(json, map){
        /**
         * the json with nodes and edges to add to the viewpoint
         * @type {string}
         */
        var _json = json;

        /**
         * the mapping of nodes/edges
         * @type {Object}
         * @private
         */
        var _map = map;

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
        this.getJSON = function(){
            return _json;
        };

        /**
         * Convert operation to NonOTOperation
         * @returns {operations.non_ot.NonOTOperation}
         */
        this.toNonOTOperation = function(){
            if(nonOTOperation === null){
                nonOTOperation = new NonOTOperation(
                    PerformCvgOperation.TYPE,
                    JSON.stringify({json: _json, map:_map})
                );
            }
            return nonOTOperation;
        };
    }

    return PerformCvgOperation;

});

