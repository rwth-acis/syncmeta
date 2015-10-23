define([
'jqueryui',
'jsplumb',
'lodash'
],/** @lends ContextNode */function($, jsPlumb, _) {
    function GhostEdge(canvas, edgeFunction, source, target){
        var _jsPlumbConnection = null;
        var label = edgeFunction.getType();
        var _button = $(`<button class='bs-btn bs-btn-default bs-btn-s' style="z-index: 30000; opacity:0.4;"><i class='fa fa-plus' style='margin-right:5px;'></i>${label}</button>`);
        var _canvas = canvas;
        var that = this;

        _button.click(function(event){
            event.stopPropagation();
            that.remove();
            _canvas.createEdge(edgeFunction.getType(),source.getEntityId(),target.getEntityId());
        });
        _button.hover(function(){
            $(this).css({"opacity": 1});
        },function(){
            $(this).css({"opacity": 0.4});
        });
        this.connect = function(){
            var overlays = edgeFunction.getArrowOverlays();
            overlays.push(["Custom", {
                create:function(component) {
                    return $("<div></div>").append(_button);                
                },
                location:0.5,
                id:"customOverlay",
                cssClass: "ghost-edge-overlay"
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
                cssClass: "ghost-edge"
            };

            if(source === target){
                connectOptions.anchors = ["TopCenter","LeftMiddle"];
            }

            _jsPlumbConnection = jsPlumb.connect(connectOptions);
            _.each(require('canvas_widget/EntityManager').getEdges(),function(e){e.setZIndex();});
        };

        this.remove = function(){
            if(_jsPlumbConnection)
                jsPlumb.detach(_jsPlumbConnection);
            _jsPlumbConnection = null;
        };
    };

    return GhostEdge;

});