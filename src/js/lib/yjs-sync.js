define(['jqueryui','yjs'],function ($) {
    return function() {
        var deferred = $.Deferred();
        Y({
            db: {
                name: 'memory' // store the shared data in memory
            },
            connector: {
                name: 'websockets-client', // use the websockets connector
                room: frameElement.baseURI.substring(frameElement.baseURI.lastIndexOf('/')+1)
            },
            share: { // specify the shared content
                users:'Map',
                undo:'Array',
                redo:'Array',
                join:'Map',
                canvas: 'Map',
                nodes:'Map',
                edges:'Map',
                userList:'Map',
                select:'Map',
                views:'Map',
                data:'Map',
                text:"Text"
            },
            sourceDir: '<%= grunt.config("baseUrl") %>/js/lib/vendor'
        }).then(function (y) {
            window.y = y;
            deferred.resolve();
        });
        return deferred.promise();
    };
});