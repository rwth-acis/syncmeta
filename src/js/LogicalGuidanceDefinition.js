define([
    'jqueryui'
],/** @lends LogicalGuidanceDefinition */function ($) {

    var resourceSpace = new openapp.oo.Resource(openapp.param.space());

    /**
     * LogicalGuidanceDefinition
     * @name LogicalGuidanceDefinition
     */
    function LogicalGuidanceDefinition(){
        var deferred = $.Deferred();
        
        //Get the guidance rules
            resourceSpace.getSubResources({
                relation: openapp.ns.role + "data",
                type: CONFIG.NS.MY.LOGICALGUIDANCEDEFINITION,
                onAll: function(data) {
                    if(data === null || data.length === 0){
                        deferred.resolve({});
                    } else {
                        data[0].getRepresentation("rdfjson",function(representation){
                            deferred.resolve(representation);
                        });
                    }
                }
            });

        return deferred.promise();
    }

    return LogicalGuidanceDefinition();
});