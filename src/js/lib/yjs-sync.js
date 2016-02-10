define(['jqueryui','yjs'],function ($) {
    return function() {
        var deferred = $.Deferred();
        Y({
            db: {
                name: 'memory' // store the shared data in memory
            },
            connector: {
                name: 'websockets-client', // use the websockets connector
                room: 'syncmetaroom123'
            },
            share: { // specify the shared content
                canvas: 'Map',
                nodes:'Map',
                edges:'Map',
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