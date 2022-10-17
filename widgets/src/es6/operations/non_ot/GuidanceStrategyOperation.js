import NonOTOperation from 'operations/non_ot/NonOTOperation';

    GuidanceStrategyOperation.TYPE = "GuidanceStrategyOperation";

    /**
     * Entity Select Operation
     * @class operations.non_ot.EntitySelectOperation
     * @memberof operations.non_ot
     * @constructor
     * @param {string} data
     */
    function GuidanceStrategyOperation(data){

        /**
         * Corresponding NonOtOperation
         * @type {operations.non_ot.NonOTOperation}
         * @private
         */
        var _nonOTOperation = null;

        this.getData = function(){
            return data;
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
                    GuidanceStrategyOperation.TYPE,
                    JSON.stringify({
                        data: data
                    })
                );
            }
            return _nonOTOperation;
        };
    }

    GuidanceStrategyOperation.prototype.toJSON = function(){
        return {data:this.getData()}
    };
    
    export default GuidanceStrategyOperation;

