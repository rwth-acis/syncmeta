import { LitElement, html, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "../../js/config";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget"; // needed to prevent ts errors when bundling with rollup
import { getWidgetTagName } from "../../es6/config";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import IWCW from "../../es6/lib/IWCWrapper";
import { yjsSync } from "../../es6/lib/yjs-sync";
import Util from "../../es6/Util";
import NodePreview from "../../es6/heatmap_widget/NodePreview";
import { NodeAddOperation } from "../../es6/operations/ot/EntityOperation";
import NodeMoveOperation from "../../es6/operations/ot/NodeMoveOperation";
import NodeResizeOperation from "../../es6/operations/ot/NodeResizeOperation";
import { NodeDeleteOperation } from "../../es6/operations/ot/EntityOperation";
import CanvasViewChangeOperation from "../../es6/operations/non_ot/CanvasViewChangeOperation";
import { WaitForCanvas } from "../../es6/WaitForCanvas";
import { CONFIG } from "../../es6/config";
// widget body used by all syncmeta widgets
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.HEATMAP))
export class HeatMapWidget extends SyncMetaWidget(
  LitElement,
  CONFIG.WIDGET.NAME.HEATMAP
) {
  protected async firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    try {
      const y = await yjsSync();
      console.info(
        "HEATMAP: Yjs successfully initialized in room " +
          window.spaceTitle +
          " with y-user-id: " +
          y.clientID
      );
      var model = y.getMap("data").get("model");
      var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.HEATMAP, y);
      const user = await WaitForCanvas(CONFIG.WIDGET.NAME.HEATMAP, y, 7);
      iwc.setSpace(user);

      var $heatmap = $("#heatmap");
      var scaleFactor = $heatmap.width() / 9000;
      var $window = $(
        "<div id='viewpoint' style='position:absolute; z-index:10000; width:50px; height:50px; border-style:groove; border-width: 1px;'></div>"
      );
      $window.hide();
      $heatmap.append($window);
      //$('#viewpoint').draggable({ cursor: "move", containment:'#heatmap'});
      var previewNodes = {};
      const userMap = y.getMap("users");
      var localUserId = userMap.get(y.clientID);

      /*if(guidancemodel.isGuidanceEditor()){
         model = guidancemodel.guidancemodel;
         }*/

      var minLeft = 4500;
      var minTop = 4500;
      var maxBottom = 5000;
      var maxRight = 5000;

      var addNodePreview = function (id, x, y, width, height, color) {
        var nodePreview = new NodePreview(
          id,
          x,
          y,
          width,
          height,
          scaleFactor,
          color
        );
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
          const userList = y.getMap("userList");
          color = Util.getColor(userList.get(senderJabberId).globalId);
          node = addNodePreview(
            operation.getEntityId(),
            operation.getLeft(),
            operation.getTop(),
            operation.getWidth(),
            operation.getHeight(),
            color
          );
          updateBoundingBox(node);
          updateZoom();
        } else if (operation instanceof NodeMoveOperation) {
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
        } else if (operation instanceof NodeResizeOperation) {
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
        } else if (operation instanceof NodeDeleteOperation) {
          id = operation.getEntityId();
          if (previewNodes.hasOwnProperty(id)) {
            node = previewNodes[id];
            node.remove();
            delete previewNodes[id];
          }
        } else if (operation instanceof CanvasViewChangeOperation) {
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
          top: (-top * scaleFactor) / zoom,
          left: (-left * scaleFactor) / zoom,
          width: (width * scaleFactor) / zoom,
          height: (height * scaleFactor) / zoom,
        });
        $window.show();
      };

      var updateColor = function (node, userId) {
        if (userId == localUserId) {
          node.resetColor();
        } else {
          //node.setColor(iwc.getUserColor(userId));
          const userList = y.getMap("userList");
          node.setColor(Util.getColor(userList.get(userId).globalId));
        }
      };

      var updateZoom = function () {
        var width = maxRight - minLeft;
        var height = maxBottom - minTop;

        var bigger = width > height ? width : height;

        var centerX = minLeft + width / 2;
        var centerY = minTop + height / 2;

        var originX = (centerX / 9000) * 100;
        var originY = (centerY / 9000) * 100;

        var translateX = -(centerX - 4500) * scaleFactor;
        var translatY = -(centerY - 4500) * scaleFactor;
        var zoom = (9000 / bigger) * 0.9;
        $heatmap.css({
          "transform-origin": originX + "%" + " " + originY + "%",
          transform:
            "translate(" +
            translateX +
            "px, " +
            translatY +
            "px) scale(" +
            zoom +
            ")",
        });
      };

      var updateBoundingBox = function (node) {
        if (node.originalX < minLeft) minLeft = node.originalX;
        if (node.originalY < minTop) minTop = node.originalY;
        if (node.originalX + node.originalWidth > maxRight)
          maxRight = node.originalX + node.originalWidth;
        if (node.originalY + node.originalHeight > maxBottom)
          maxBottom = node.originalY + node.originalHeight;
      };

      registerCallbacks();

      for (var nodeId in model.nodes) {
        if (model.nodes.hasOwnProperty(nodeId)) {
          var node = model.nodes[nodeId];
          var nodePreview = addNodePreview(
            nodeId,
            node.left,
            node.top,
            node.width,
            node.height,
            scaleFactor,
            null
          );
          updateColor(nodePreview, localUserId);
          updateBoundingBox(nodePreview);
        }
      }
      updateZoom();
    } catch (error) {
      console.error(error);
    }
  }
  render() {
    return html`
      <link
        rel="stylesheet"
        type="text/css"
        href="https://code.jquery.com/ui/1.13.1/themes/smoothness/jquery-ui.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/vendor/bootstrap.min.prefixed.css"
      />
      <!-- <link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/font-awesome/css/font-awesome.min.css"> -->
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"
      />
      <div
        id="heatmap"
        style="background-color: #f5f5f5; width: 100%;height: 100%;"
      >
        <div></div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
