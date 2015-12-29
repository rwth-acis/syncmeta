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
    'promise!Model'
],function ($, _, require, IWCOT, NodePreview, NodeAddOperation,NodeMoveOperation,NodeResizeOperation,NodeDeleteOperation, CanvasViewChangeOperation, model) {
    var iwc = IWCOT.getInstance(CONFIG.WIDGET.NAME.HEATMAP);
    var $heatmap = $("#heatmap");
    var scaleFactor = $heatmap.width() / 9000;
    var $window = $("<div style='position:absolute; z-index:10000; width:50px; height:50px; border-style:groove; border-width: 1px;'></div>");
    $window.hide();
    $heatmap.append($window);
    var previewNodes = {};
    var localUserId = iwc.getUser()[CONFIG.NS.PERSON.JABBERID];

    var minLeft = 4500;
    var minTop = 4500;
    var maxBottom = 5000;
    var maxRight = 5000;

    var addNodePreview = function(id, x, y, width, height, color){
        var nodePreview = new NodePreview(id, x, y, width, height, scaleFactor, color);
        previewNodes[id] = nodePreview;
        $heatmap.append(nodePreview.get$node());
        return nodePreview;
    };

    var operationCallback = function(operation){
        if(operation instanceof NodeAddOperation){
            var senderJabberId = operation.getOTOperation().getSender();
            var color = null;
            if(senderJabberId != localUserId)
                color = iwc.getUserColor(senderJabberId);
            var node = addNodePreview(operation.getEntityId(), operation.getLeft(), operation.getTop(), operation.getWidth(), operation.getHeight(), color);
            updateBoundingBox(node);
            updateZoom();
        }
        else if (operation instanceof NodeMoveOperation){
            var id = operation.getEntityId();
            if(previewNodes.hasOwnProperty(id)){
                var node = previewNodes[id];
                node.moveX(operation.getOffsetX());
                node.moveY(operation.getOffsetY());
                var senderJabberId = operation.getOTOperation().getSender();
                updateColor(node, senderJabberId);
                updateBoundingBox(node);
                updateZoom();
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
                updateBoundingBox(node);
                updateZoom();
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

    var updateZoom = function(){
        var width = maxRight - minLeft;
        var height = maxBottom - minTop;

        var bigger = width > height ? width : height;

        var centerX = minLeft + width / 2;
        var centerY = minTop + height / 2;

        var originX = centerX / 9000 * 100;
        var originY = centerY / 9000 * 100;

        var translateX = -(centerX - 4500) * scaleFactor;
        var translatY =  -(centerY - 4500) * scaleFactor;
        var zoom = 9000 / bigger * 0.9;
        $heatmap.css({
            "transform-origin": originX + "%" + " " + originY + "%",
            transform: "translate(" + translateX + "px, " + translatY + "px) scale(" + zoom + ")"
        })
    };

    var updateBoundingBox = function(node){
        if(node.originalX < minLeft)
            minLeft = node.originalX;
        if(node.originalY < minTop)
            minTop = node.originalY;
        if(node.originalX + node.originalWidth > maxRight)
            maxRight = node.originalX + node.originalWidth;
        if(node.originalY + node.originalHeight > maxBottom)
            maxBottom = node.originalY + node.originalHeight
    };

    registerCallbacks();

    for(var nodeId in model.nodes){
        var node = model.nodes[nodeId];
        var nodePreview = addNodePreview(nodeId, node.left, node.top, node.width, node.height, scaleFactor, null);
        updateColor(nodePreview, localUserId);
        updateBoundingBox(nodePreview);
    };
    updateZoom();

});