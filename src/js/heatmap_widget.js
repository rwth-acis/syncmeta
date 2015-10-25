/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs([
    'jqueryui',
    'lodash',
    'require',
    'iwcw',
    'heatmap_widget/NodePreview',
    'operations/ot/NodeAddOperation',
    'operations/ot/NodeMoveOperation',
    'operations/ot/NodeResizeOperation',
    'operations/ot/NodeDeleteOperation',
    'operations/non_ot/CanvasViewChangeOperation',
    'operations/non_ot/CanvasResizeOperation',
    'operations/non_ot/CanvasZoomOperation',
    'promise!Model'
],function ($, _, require, IWCOT, NodePreview, NodeAddOperation,NodeMoveOperation,NodeResizeOperation,NodeDeleteOperation, CanvasViewChangeOperation, CanvasResizeOperation, CanvasZoomOperation, model) {
    var iwc = IWCOT.getInstance(CONFIG.WIDGET.NAME.HEATMAP);
    var $heatmap = $("#heatmap");
    var scaleFactor = $heatmap.width() / 9000;
    var $window = $("<div style='position:absolute; z-index:10000; width:50px; height:50px; border-style:groove;'></div>");
    $window.hide();
    $heatmap.append($window);
    var previewNodes = {};
    var localUserId;

    var addNodePreview = function(id, x, y, width, height, color){
        var nodePreview = new NodePreview(id, x, y, width, height, scaleFactor, color);
        previewNodes[id] = nodePreview;
        $heatmap.append(nodePreview.get$node());
    };

    var operationCallback = function(operation){
        if(operation instanceof NodeAddOperation){
            var senderJabberId = operation.getOTOperation().getSender();
            var color = null;
            if(senderJabberId != localUserId)
                color = iwc.getUserColor(senderJabberId);
            addNodePreview(operation.getEntityId(), operation.getLeft(), operation.getTop(), operation.getWidth(), operation.getHeight(), color);
        }
        else if (operation instanceof NodeMoveOperation){
            var id = operation.getEntityId();
            if(previewNodes.hasOwnProperty(id)){
                var node = previewNodes[id];
                node.moveX(operation.getOffsetX());
                node.moveY(operation.getOffsetY());
                var senderJabberId = operation.getOTOperation().getSender();
                updateColor(node, senderJabberId);
            }

        }
        else if (operation instanceof NodeResizeOperation){
            var id = operation.getEntityId();
            if(previewNodes.hasOwnProperty(id)){
                var node = previewNodes[id];
                node.changeWidth(operation.getOffsetX());
                node.changeHeight(operation.getOffsetY());
                var senderJabberId = operation.getOTOperation().getSender();
                updateColor(node, senderJabberId);
            }
        }
        else if (operation instanceof NodeDeleteOperation){
            var id = operation.getEntityId();
            if(previewNodes.hasOwnProperty(id)){
                var node = previewNodes[id];
                node.remove();
                delete previewNodes[id];
            }
        }
        else if (operation instanceof CanvasViewChangeOperation){
            localUserId = operation.getNonOTOperation().getSender();
            updateWindow(operation);
        }
    };

    var registerCallbacks = function(){
        iwc.registerOnDataReceivedCallback(operationCallback);
    };

    var updateWindow = function(viewChangeOperation){
        var top = viewChangeOperation.getTop();
        var left = viewChangeOperation.getLeft();
        var width = viewChangeOperation.getWidth();
        var height = viewChangeOperation.getHeight();
        var zoom = viewChangeOperation.getZoom();
        $window.css({
            top: -top * scaleFactor / zoom,
            left: -left * scaleFactor / zoom,
            width: width * scaleFactor / zoom,
            height: height * scaleFactor / zoom
        });
        $window.show();
    };

    var updateColor = function(node, userId){
        if(userId == localUserId){
            node.resetColor();
        }
        else{
            node.setColor(iwc.getUserColor(userId));
        }
    };

    registerCallbacks();

    for(var nodeId in model.nodes){
        var node = model.nodes[nodeId];
        addNodePreview(nodeId, node.left, node.top, node.width, node.height, scaleFactor, null);
    };
});