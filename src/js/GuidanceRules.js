define([
    'jqueryui'
],/** @lends GuidanceRules */function ($) {

    var resourceSpace = new openapp.oo.Resource(openapp.param.space());

    /**
     * GuidanceRules
     * @name GuidanceRules
     */
    function GuidanceRules(){
        var deferred = $.Deferred();
        
        //Get the guidance rules
            resourceSpace.getSubResources({
                relation: openapp.ns.role + "data",
                type: CONFIG.NS.MY.GUIDANCERULES,
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

    return GuidanceRules();
});