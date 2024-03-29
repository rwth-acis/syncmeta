
    export default  function(color){
        return {
          //"bidirassociation": {}, //No overlays for bi-dir-association
          unidirassociation: {
            type: "Arrow",
            options: {
              width: 20,
              length: 30,
              location: 1,
              foldback: 0.1,
              paintStyle: {
                fill: "#ffffff",
                outlineWidth: 2,
                outlineStroke: color,
              },
            },
          },
          generalisation: {
            type: "Arrow",
            options: {
              width: 20,
              length: 30,
              location: 1,
              foldback: 1,
              paintStyle: {
                fill: "#ffffff",
                outlineWidth: 2,
                outlineStroke: color,
              },
            },
          },
          diamond: {
            type: "Arrow",
            options: {
              width: 20,
              length: 20,
              location: 1,
              foldback: 2,
              paintStyle: {
                fill: "#ffffff",
                outlineWidth: 2,
                outlineStroke: color,
              },
            },
          },
        };
    };
