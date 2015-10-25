/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs([
    'jqueryui',
    'lodash',
    'require',
    'iwcw',
    'heatmap_widget/Heatspot',
    'operations/ot/NodeAddOperation',
    'operations/ot/NodeMoveOperation',
    'operations/ot/NodeDeleteOperation',
    'operations/non_ot/CanvasDragOperation',
    'operations/non_ot/CanvasResizeOperation',
    'promise!Model'
],function ($, _, require, IWCOT, Heatspot, NodeAddOperation,NodeMoveOperation,NodeDeleteOperation, CanvasDragOperation, CanvasResizeOperation, model) {
    var iwc = IWCOT.getInstance(CONFIG.WIDGET.NAME.HEATMAP);
    var $heatmap = $("#heatmap");
    var scaleFactor = $heatmap.width() / 9000;
    var $window = $("<div style='position:absolute; z-index:10000; width:50px; height:50px; border-style:groove;'></div>");
    $heatmap.append($window);

    for(var nodeId in model.nodes){
        var node = model.nodes[nodeId];
        var nodeIndicator = $("<div style='background-color:red; position:absolute;'></div>");
        nodeIndicator.css({
            left: node.left * scaleFactor,
            top: node.top * scaleFactor,
            width: node.width * scaleFactor,
            height: node.height * scaleFactor
        });
        $heatmap.append(nodeIndicator);
    }

    var heatSpots = {};

    $("#canvas-frame").resize(function(){
        console.log("Canvas resize");
        $window.width($(this).width()*scaleFactor);
        $window.height($(this).height()*scaleFactor);
    });

    var addHeatSpot = function(id, x, y, width, height, color){
        var heatspot = new Heatspot(x, y, width, height, color);
        $heatmap.append(heatspot.get$node());
        heatSpots[id] = heatspot;
    };

    var operationCallback = function(operation){
        if(operation instanceof NodeAddOperation){
            var senderJabberId = operation.getOTOperation().getSender();
            color = iwc.getUserColor(senderJabberId);
            addHeatSpot(operation.getEntityId(), operation.getLeft() * scaleFactor, operation.getTop()* scaleFactor, operation.getWidth()*scaleFactor, operation.getHeight()*scaleFactor, color);
        }
        else if (operation instanceof NodeMoveOperation){
            
        }
        else if (operation instanceof NodeDeleteOperation){
            
        }
        else if (operation instanceof CanvasDragOperation){
            $window.css({
                top: -operation.getTop() * scaleFactor,
                left: -operation.getLeft() * scaleFactor
            });
        }
        else if(operation instanceof CanvasResizeOperation){
            $window.css({
                width: operation.getWidth() * scaleFactor,
                height: operation.getHeight() * scaleFactor
            });
        }
    };

    var registerCallbacks = function(){
        iwc.registerOnDataReceivedCallback(operationCallback);
    };

    registerCallbacks();
});