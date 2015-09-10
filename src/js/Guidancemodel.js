define([
    'jqueryui'
],/** @lends Guidancemodel */function ($) {

    var resourceSpace = new openapp.oo.Resource(openapp.param.space());

    /**
     * Guidancemodel
     * @name Guidancemodel
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
            guidancemodeling.INITIAL_NODE_LABEL = "Initial node";
            guidancemodeling.MERGE_NODE_LABEL = "Merge node";
            guidancemodeling.CALL_ACTIVITY_NODE_LABEL = "Call activity node";
            guidancemodeling.ACTIVITY_FINAL_NODE_LABEL = "Activity final node";
            guidancemodeling.CONCURRENCY_NODE_LABEL = "Concurrency node";

            guidancemodeling.isGuidanceEditor = function(){
                return activityName == "Guidance modeling";
            };

            guidancemodeling.getCreateObjectNodeLabelForType = function(type){
                return "Create " + type + " object";
            };

            guidancemodeling.isCreateObjectNodeLabel = function(label){
                var match = /Create (.*?) object/.exec(label);
                if(match)
                    return match[1];
                else
                    return "";
            };

            guidancemodeling.getCreateRelationshipNodeLabelForType = function(type){
                return "Create " + type + " relationship";
            };

            guidancemodeling.getSetPropertyNodeLabelForType = function(type){
                return "Set property for " + type + " object";
            };

            guidancemodeling.getEntityNodeLabelForType = function(type){
                return type + " entity";
            };

            guidancemodeling.isEntityNodeLabel = function(label){
                var match = /(.*?) entity/.exec(label);
                if(match)
                    return match[1];
                else
                    return "";
            };

            guidancemodeling.getObjectContextLabelForType = function(type){
                return type + " Object Context";
            };

            guidancemodeling.getObjectTypeForObjectContextType = function(type){
                var i = type.lastIndexOf(" Object Context");
                return type.substring(0, i);
            };

            guidancemodeling.isObjectContextType = function(type){
                return type.indexOf(" Object Context", type.length - " Object Context".length) !== -1;
            };

            guidancemodeling.getRelationshipContextLabelForType = function(type){
                return type + " Relationship Context";
            };

            guidancemodeling.getRelationshipTypeForRelationshipContextType = function(type){
                var i = type.lastIndexOf(" Relationship Context");
                return type.substring(0, i);
            };

            guidancemodeling.isRelationshipContextType = function(type){
                return type.indexOf(" Relationship Context", type.length - " Relationship Context".length) !== -1;
            };

            guidancemodeling.getObjectToolLabelForType = function(type){
                return type + " Tool";
            };

            guidancemodeling.getObjectTypeForObjectToolType = function(type){
                var i = type.lastIndexOf(" Tool");
                return type.substring(0, i);
            };

            guidancemodeling.isObjectToolType = function(type){
                return type.indexOf(" Tool", type.length - " Tool".length) !== -1;
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
                                guidancemodeling.guidancemetamodel = representation.guidancemetamodel;
                            }
                            deferred.resolve(guidancemodeling);
                        });
                    }
                }
            });
        });
        return deferred.promise();
    }

    return Guidancemodel();
});