define([
'jqueryui',
'jsplumb',
'lodash'
],/** @lends ContextNode */function($, jsPlumb, _) {
    function GhostEdge(canvas, edgeFunction, source, target){
        var _jsPlumbConnection = null;
        var label = edgeFunction.getType();
        var _button = $(`<button class='bs-btn bs-btn-default bs-btn-xs'><i class='fa fa-plus'></i>${label}</button>`);
        var _canvas = canvas;

        _button.click(function(event){
            event.stopPropagation();
            _canvas.createEdge(edgeFunction.getType(),source.getEntityId(),target.getEntityId());
            jsPlumb.detach(_jsPlumbConnection);
        });
        this.connect = function(){
            var overlays = edgeFunction.getArrowOverlays();
            overlays.push(["Custom", {
                create:function(component) {
                    return $("<div></div>").append(_button);                
                },
                location:0.5,
                id:"customOverlay"
            }]);
            var connectOptions = {
                source: source.get$node(),
                target: target.get$node(),
                paintStyle:{
                    strokeStyle: edgeFunction.getColor(),
                    lineWidth: 2,
                    dashstyle: ""
                },
                endpoint: "Blank",
                anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
                connector: edgeFunction.getShape(),
                overlays: overlays,
                cssClass: ""
            };

            if(source === target){
                connectOptions.anchors = ["TopCenter","LeftMiddle"];
            }

            _jsPlumbConnection = jsPlumb.connect(connectOptions);
            _.each(require('canvas_widget/EntityManager').getEdges(),function(e){e.setZIndex();});
        };

        this.remove = function(){

        };
    };

    return GhostEdge;

});