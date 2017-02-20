/**
 * Namespace for heatmap widget.
 * @namespace heatmap_widget
 */

requirejs([
    'jqueryui',
    'lodash',
    'require',
    'iwcw',
    'lib/yjs-sync',
    'Util',
    'heatmap_widget/NodePreview',
    'operations/ot/NodeAddOperation',
    'operations/ot/NodeMoveOperation',
    'operations/ot/NodeResizeOperation',
    'operations/ot/NodeDeleteOperation',
    'operations/non_ot/CanvasViewChangeOperation',
    'WaitForCanvas'
    //'promise!Guidancemodel',
], function ($, _, require, IWCW, yjsSync, Util, NodePreview, NodeAddOperation, NodeMoveOperation, NodeResizeOperation, NodeDeleteOperation, CanvasViewChangeOperation, WaitForCanvas/*, guidancemodel*/) {
    yjsSync().done(function (y, spaceTitle) {
        console.info('HEATMAP: Yjs successfully initialized in room ' + spaceTitle + ' with y-user-id: ' + y.db.userId);
        var model = y.share.data.get('model');
        var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.HEATMAP);
        WaitForCanvas(CONFIG.WIDGET.NAME.HEATMAP, 7).done(function (user) {
            iwc.setSpace(user);
        });

        var $heatmap = $("#heatmap");
        var scaleFactor = $heatmap.width() / 9000;
        var $window = $("<div id='viewpoint' style='position:absolute; z-index:10000; width:50px; height:50px; border-style:groove; border-width: 1px;'></div>");
        $window.hide();
        $heatmap.append($window);
        //$('#viewpoint').draggable({ cursor: "move", containment:'#heatmap'});
        var previewNodes = {};
        var localUserId = y.share.users.get(y.db.userId);

        /*if(guidancemodel.isGuidanceEditor()){
         model = guidancemodel.guidancemodel;
         }*/

        var minLeft = 4500;
        var minTop = 4500;
        var maxBottom = 5000;
        var maxRight = 5000;

        var addNodePreview = function (id, x, y, width, height, color) {
            var nodePreview = new NodePreview(id, x, y, width, height, scaleFactor, color);
            previewNodes[id] = nodePreview;
            $heatmap.append(nodePreview.get$node());
            return nodePreview;
        };

        var operationCallback = function (operation) {
            var id, node, senderJabberId;
            if (operation instanceof NodeAddOperation) {
                senderJabberId = operation.getJabberId();
                var color = null;
                //if(senderJabberId != localUserId)
                //color = iwc.getUserColor(senderJabberId);
                color = Util.getColor(y.share.userList.get(senderJabberId).globalId);
                node = addNodePreview(operation.getEntityId(), operation.getLeft(), operation.getTop(), operation.getWidth(), operation.getHeight(), color);
                updateBoundingBox(node);
                updateZoom();
            }
            else if (operation instanceof NodeMoveOperation) {
                id = operation.getEntityId();
                if (previewNodes.hasOwnProperty(id)) {
                    node = previewNodes[id];
                    node.moveX(operation.getOffsetX());
                    node.moveY(operation.getOffsetY());
                    senderJabberId = operation.getJabberId();
                    updateColor(node, senderJabberId);
                    updateBoundingBox(node);
                    updateZoom();
                }

            }
            else if (operation instanceof NodeResizeOperation) {
                id = operation.getEntityId();
                if (previewNodes.hasOwnProperty(id)) {
                    node = previewNodes[id];
                    node.changeWidth(operation.getOffsetX());
                    node.changeHeight(operation.getOffsetY());
                    senderJabberId = operation.getJabberId();
                    updateColor(node, senderJabberId);
                    updateBoundingBox(node);
                    updateZoom();
                }
            }
            else if (operation instanceof NodeDeleteOperation) {
                id = operation.getEntityId();
                if (previewNodes.hasOwnProperty(id)) {
                    node = previewNodes[id];
                    node.remove();
                    delete previewNodes[id];
                }
            }
            else if (operation instanceof CanvasViewChangeOperation) {
                updateWindow(operation);
            }
        };

        var registerCallbacks = function () {
            iwc.registerOnDataReceivedCallback(operationCallback);
        };

        var updateWindow = function (viewChangeOperation) {
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

        var updateColor = function (node, userId) {
            if (userId == localUserId) {
                node.resetColor();
            }
            else {
                //node.setColor(iwc.getUserColor(userId));
                node.setColor(Util.getColor(y.share.userList.get(userId).globalId));

            }
        };

        var updateZoom = function () {
            var width = maxRight - minLeft;
            var height = maxBottom - minTop;

            var bigger = width > height ? width : height;

            var centerX = minLeft + width / 2;
            var centerY = minTop + height / 2;

            var originX = centerX / 9000 * 100;
            var originY = centerY / 9000 * 100;

            var translateX = -(centerX - 4500) * scaleFactor;
            var translatY = -(centerY - 4500) * scaleFactor;
            var zoom = 9000 / bigger * 0.9;
            $heatmap.css({
                "transform-origin": originX + "%" + " " + originY + "%",
                transform: "translate(" + translateX + "px, " + translatY + "px) scale(" + zoom + ")"
            })
        };

        var updateBoundingBox = function (node) {
            if (node.originalX < minLeft)
                minLeft = node.originalX;
            if (node.originalY < minTop)
                minTop = node.originalY;
            if (node.originalX + node.originalWidth > maxRight)
                maxRight = node.originalX + node.originalWidth;
            if (node.originalY + node.originalHeight > maxBottom)
                maxBottom = node.originalY + node.originalHeight
        };

        registerCallbacks();

        for (var nodeId in model.nodes) {
            if (model.nodes.hasOwnProperty(nodeId)) {
                var node = model.nodes[nodeId];
                var nodePreview = addNodePreview(nodeId, node.left, node.top, node.width, node.height, scaleFactor, null);
                updateColor(nodePreview, localUserId);
                updateBoundingBox(nodePreview);
            }
        }
        updateZoom();
    });
});