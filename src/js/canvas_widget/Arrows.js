define(function () {
    return  function(color){
        return {
            //"bidirassociation": [], //No overlays for bi-dir-association
            "unidirassociation": ["Arrow", {
                width:20,
                length:30,
                location:1,
                foldback: 0.1,
                paintStyle: {
                    fillStyle: "#ffffff",
                    outlineWidth: 2,
                    outlineColor: color
                }
            }],
            "generalisation": ["Arrow", {
                width:20,
                length:30,
                location:1,
                foldback: 1,
                paintStyle: {
                    fillStyle: "#ffffff",
                    outlineWidth: 2,
                    outlineColor: color
                }
            }],
            "diamond": ["Arrow", {
                width:20,
                length:20,
                location:1,
                foldback: 2,
                paintStyle: {
                    fillStyle: "#ffffff",
                    outlineWidth: 2,
                    outlineColor: color
                }
            }]
        };
    };
});