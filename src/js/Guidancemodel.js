define([
    'jqueryui'
],/** @lends Metamodel */function ($) {

    var resourceSpace = new openapp.oo.Resource(openapp.param.space());

    /**
     * Metamodel
     * @name Metamodel
     */
    function Guidancemodel(){
        var guidancemodeling = {};
        guidancemodeling.guidancemodel = {};
        guidancemodeling.metamodel = {};
        var deferred = $.Deferred();
        //Check whether this is the guidance modeling editor based on the activity name
        var act = openapp.param.get("http://purl.org/role/terms/activity");
        openapp.resource.get(act, function(resource){
            var activityName = resource.data[resource.uri]["http://purl.org/dc/terms/title"][0].value;
            guidancemodeling.isGuidanceEditor = function(){
                return activityName == "Guidance modeling";
            };
            //Get the guidance model
            resourceSpace.getSubResources({
                relation: openapp.ns.role + "data",
                type: CONFIG.NS.MY.GUIDANCEMODEL,
                onAll: function(data) {
                    if(data === null || data.length === 0){
                        deferred.resolve(guidancemodeling);
                    } else {
                        data[0].getRepresentation("rdfjson",function(representation){
                            if(representation){
                                guidancemodeling.guidancemodel = representation.guidancemodel;
                                guidancemodeling.metamodel = representation.metamodel;
                            }
                            deferred.resolve(guidancemodeling);
                        });
                    }
                }
            });
        });
        //noinspection JSUnusedGlobalSymbols
        // resourceSpace.getSubResources({
        //     relation: openapp.ns.role + "data",
        //     type: CONFIG.NS.MY.METAMODEL,
        //     onAll: function(data) {
        //         if(data === null || data.length === 0){
        //             deferred.resolve([]);
        //         } else {
        //             data[0].getRepresentation("rdfjson",function(representation){
        //                 if(!representation){
        //                     deferred.resolve([]);
        //                 } else {
        //                     deferred.resolve(representation);
        //                 }
        //             });
        //         }
        //     }
        // });
        return deferred.promise();
    }

    return Guidancemodel();
});