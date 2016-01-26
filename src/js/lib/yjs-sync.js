define(['yjs'],function () {
    return function() {
        Y({
            db: {
                name: 'memory' // store the shared data in memory
            },
            connector: {
                name: 'websockets-client', // use the websockets connector
                room: 'syncmetaroom'
            },
            share: { // specify the shared content
                model: 'Map'
            },
            sourceDir: '<%= grunt.config("baseUrl") %>/js/lib/vendor'
        }).then(function (y) {
            console.log('yjs log: Yjs Initialized successfully!');
            window.y = y;
        });
    };
});