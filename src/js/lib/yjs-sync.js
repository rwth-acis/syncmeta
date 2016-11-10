define(['jquery', 'yjs'], function($) {
    return function(spaceTitle) {

        var deferred = $.Deferred();
        if (!spaceTitle) {
            //try to get space title from url if space promise fails
            spaceTitle = frameElement.baseURI.substring(frameElement.baseURI.lastIndexOf('/') + 1);
            if (spaceTitle.indexOf('#') != -1 || spaceTitle.indexOf('?') != -1) {
                spaceTitle = spaceTitle.replace(/[#|\\?]\S*/g, '');
            }
        }
        Y({
            db: {
                name: 'memory' // store the shared data in memory
            },
            connector: {
                name: 'websockets-client', // use the websockets connector
                room: spaceTitle,
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
            deferred.resolve(y);
        });
        return deferred.promise();
    };
});