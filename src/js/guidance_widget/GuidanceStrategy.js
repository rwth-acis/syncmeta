define(['iwcw','operations/non_ot/ShowObjectGuidanceOperation'
],function(IWCW ,ShowObjectGuidanceOperation) {

    function GuidanceStrategy(guidanceRules){
        var _iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
        var _guidanceRules = guidanceRules;
        this.establishContext = function(objectId, objectType){
            var relevantRules = _guidanceRules.objectToolRules.filter(function(rule){
                return rule.srcObjectType == objectType;
            });

            var operation = new ShowObjectGuidanceOperation(objectId, relevantRules);
            _iwc.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.MAIN,operation.toNonOTOperation());
        };

        this.onGuidanceFollowed = function(){

        };

        this.onGuidanceRejected = function(){

        };
    }

    return GuidanceStrategy;

});
