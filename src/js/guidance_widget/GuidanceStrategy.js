define(['iwcw','operations/non_ot/ShowToolGuidanceOperation'
],function(IWCW ,ShowToolGuidanceOperation) {

    function GuidanceStrategy(){
        var _iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
        this.establishContext = function(selectedEntityId){
            var operation = new ShowToolGuidanceOperation(selectedEntityId, "BLUB: EntityType");
            console.log("Sending show tool guidance operation.");
            _iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
        };

        this.onGuidanceFollowed = function(){

        };

        this.onGuidanceRejected = function(){

        };
    }

    return GuidanceStrategy;

});
