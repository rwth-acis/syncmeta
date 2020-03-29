define(['jquery', 'Util'], function($, Util) {
    return function(spaceTitle) {

        var deferred = $.Deferred();
        //if space is not provided by the parameter, get it yourself from frameElement
        if (!spaceTitle) {
            if (parent.caeRoom) {
                spaceTitle = parent.caeRoom;
            } else {
                spaceTitle = Util.getSpaceTitle(frameElement.baseURI);
            }
        }
                
        Y({
            db: {
                name: "<%= grunt.config('yjsDatabaseAdapter') %>" // store the shared data in memory
            },
            connector: {
                name: "<%= grunt.config('yjsConnector') %>", // use the websockets connector
                room: spaceTitle,
                options: { resource: "<%= grunt.config('yjsResourcePath') %>"},
                url:"<%= grunt.config('yjsConnectorUrl') %>"
            },
            share: { // specify the shared content
                users: 'Map',
                join: 'Map',
                canvas: 'Map',
                nodes: 'Map',
                edges: 'Map',
                userList: 'Map',
                select: 'Map',
                views: 'Map',
                data: 'Map',
                activity:'Map',
                globalId: 'Array',
                text:"Text"
            },
            type:["Text","Map"],
            sourceDir: '<%= grunt.config("baseUrl") %>/js/lib/vendor'
        }).then(function(y) {
            deferred.resolve(y, spaceTitle);
        });
        return deferred.promise();
    };
});