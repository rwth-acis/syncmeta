define(['jquery', 'Util'], function($, Util) {
    return function(spaceTitle) {
      var deferred = $.Deferred();
      //if space is not provided by the parameter, get it yourself from frameElement
      if (!spaceTitle) {
        if (parent.caeRoom) {
          spaceTitle = parent.caeRoom;
        } else if (parent.syncmetaRoom) {
          spaceTitle = parent.syncmetaRoom;
        } else {
          spaceTitle = Util.getSpaceTitle(frameElement.baseURI);
        }
      }

      var waitForYjs = function () {
        setTimeout(function () {
          console.log("waiting for yjs to be bound to the window object");
          if (!window.Y) waitForYjs();
          else {
            console.log("Yjs is available, using spaceTitle: ", spaceTitle);
            const doc = new Y.Doc();

            // Sync clients with the y-websocket provider
            const websocketProvider = new WebsocketProvider(
              "ws://localhost:1234",
              spaceTitle,
              doc
            );

            websocketProvider.on("status", (event) => {
              console.log(event.status); // logs "connected" or "disconnected"

              if (event.status == "connected") {
                deferred.resolve(doc, spaceTitle);
              }
            });
          }
        }, 500);
      };
      waitForYjs();

      // var deferred = $.Deferred();

      // Y({
      //     db: {
      //         name: "memory" // store the shared data in memory
      //     },
      //     connector: {
      //         name: "websockets-client", // use the websockets connector
      //         room: spaceTitle,
      //         options: { resource: "/socket.io"},
      //         url:"http://127.0.0.1:1234"
      //     },
      //     share: { // specify the shared content
      //         users: 'Map',
      //         join: 'Map',
      //         canvas: 'Map',
      //         nodes: 'Map',
      //         edges: 'Map',
      //         userList: 'Map',
      //         select: 'Map',
      //         views: 'Map',
      //         data: 'Map',
      //         activity:'Map',
      //         globalId: 'Array',
      //         text:"Text",
      //         widgetConfig: 'Map',
      //         metamodelStatus: 'Map'
      //     },
      //     type:["Text","Map"],
      //     sourceDir: 'http://127.0.0.1:8070/widgets/js/lib/vendor'
      // }).then(function(y) {
      //     deferred.resolve(y, spaceTitle);
      // });
      // return deferred.promise();
    };
});
