
    

    var deferred = $.Deferred();
    //Check whether this is the guidance modeling editor based on the activity name
    var act = openapp.param.get("http://purl.org/role/terms/activity");
    openapp.resource.get(act, function (resource) {
        var activityName;
        console.info('Activity promise by ' + frameElement.name);
        console.info(resource);
        try {
            if (resource.data)
                activityName = resource.data[resource.uri]["http://purl.org/dc/terms/title"][0].value;
            else
                activityName = "";
        } catch (e) {
            console.info('Activity promise failed!');
        }
        deferred.resolve(activityName);

    });
    export default deferred.promise();
