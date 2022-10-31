import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { SyncMetaWidget } from "../../widget";
import "reflect-metadata";

// canvas widget
@customElement("syncmeta-canvas")
export class CanvasWidget extends SyncMetaWidget(LitElement) {
  render() {
    return html`
      <link
        rel="stylesheet"
        type="text/css"
        href="/node_modules/jquery-ui/themes/base/jquery-ui.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/vendor/jquery.contextMenu.css"
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
      <script src="/es6/main_widget.js"></script>
      <div id="loading" class="loading"></div>
      <div class="button_bar left">
        <button id="save" title="Save the current state of the model">
          <img width="20px" height="20px" src="/img/save.png" />
        </button>
        <!-- Uncommented the below line for Export as PNG! -->
        <button id="save_image">
          <img width="20px" height="20px" src="/img/save_image.png" />
        </button>
        <!--<button id="generate" style="display: none"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/generate.png" /></button>-->
        <span id="feedback"></span>
        <strong id="lblCurrentView"
          >View:<span id="lblCurrentViewId"></span
        ></strong>
      </div>
      <div id="dialog" style="display:none" title="Generate editor">
        <p>
          <strong>Editor space url:</strong>
          <br />
          <span id="space_link_input"
            ><%= grunt.config('roleSandboxUrl') %>/<input
              size="16"
              type="text"
              id="space_label"
          /></span>
          <span id="space_link_text" style="display: none"
            ><a id="space_link" target="_blank" href="#"></a
          ></span>
          <br />
          <span id="space_link_comment" style="color: #FF3333; display: none"
            >Space already exists, will be overwritten!</span
          >
        </p>
        <p>
          <strong>Editor space title:</strong
          ><input size="32" type="text" id="space_title" />
        </p>
      </div>
      <div class="button_bar right">
        <button id="viewsHide" title="Close the View Panel">
          <img width="20px" height="20px" src="/img/viewHide.png" />
        </button>
        <button id="viewsShow" title="Show the View Panel">
          <img width="20px" height="20px" src="/img/viewShow.png" />
        </button>
        <button id="showtype" title="Show the types of nodes and edges">
          <img width="20px" height="20px" src="/img/hidetype.png" />
        </button>
        <button id="hidetype" title="Hide types of nodes and edges">
          <img width="20px" height="20px" src="/img/showtype.png" />
        </button>
        <button id="applyLayout" title="Apply Layout">
          <img width="20px" height="20px" src="/img/layout.png" />
        </button>
        <button id="zoomin" title="Zoom in">
          <img width="20px" height="20px" src="/img/zoomin.png" />
        </button>
        <button id="zoomout" title="Zoom out">
          <img width="20px" height="20px" src="/img/zoomout.png" />
        </button>
        <button id="undo" title="Undo your latest changes">
          <img width="20px" height="20px" src="/img/undo.png" />
        </button>
        <button id="redo" title="Redo your latest changes">
          <img width="20px" height="20px" src="/img/redo.png" />
        </button>
      </div>
      <div id="ViewCtrlContainer" class="button_bar left">
        <button id="btnCreateViewpoint" title="Create a viewpoint">
          <img width="20px" height="20px" src="/img/add196.png" />
        </button>
        <input
          id="txtNameViewpoint"
          type="text"
          placeholder="name"
          style="display: none;"
        />
        <select id="ddmViewpointSelection" style="display: none;"></select>
        <button
          id="btnAddViewpoint"
          title="Create an empty viewpoint"
          style="display: none;"
        >
          <img width="20px" height="20px" src="/img/checked21.png" />
        </button>
        <button
          id="btnCancelCreateViewpoint"
          title="Cancel"
          style="display: none;"
        >
          <img width="20px" height="20px" src="/img/times1.png" />
        </button>
        <select id="ddmViewSelection"></select>
        <button
          id="btnShowView"
          title="Apply a viewpoint to the current model or visualize the viewpoint"
        >
          Show
        </button>
        <button
          id="btnRefreshView"
          title="Refresh viewpoint list"
          style="display: none;"
        >
          Refresh
        </button>
        <button
          id="btnDelViewPoint"
          title="Delete current viewpoint in the list"
        >
          <img width="20px" height="20px" src="/img/times1.png" />
        </button>
      </div>
      <div
        class="ui-state-error ui-corner-all"
        style="margin-top: 20px; padding: 0 .7em; display:none"
      >
        <p id="errorMsg">
          <span
            class="ui-icon ui-icon-alert"
            style="float: left; margin-right: .3em;"
          ></span>
          <strong>SYNCMETA!</strong>
        </p>
      </div>
      <div id="canvas-frame">
        <div id="canvas"></div>
      </div>
      <div id="q"></div>
    `;
  }

  static styles = css`
    .button_bar {
      width: 50%;
      float: left;
    }
    .button_bar.left {
      text-align: left;
    }
    .button_bar.right {
      text-align: right;
    }
    .node {
      z-index: 1;
      position: absolute;
      overflow: visible;
      border: 2px solid transparent;
    }
    .trace_awareness {
      z-index: 0;
      position: absolute;
      overflow: visible;
      opacity: 0;
      pointer-events: none;
    }
    div.class_node {
      height: inherit;
      width: inherit;
      border: 1px solid #aaa;
      border-radius: 1px;
      box-shadow: 2px 2px 2px #cccccc;
      color: #666 !important;
      font-size: 12px;
    }
    div.default_node {
      height: inherit;
      width: inherit;
    }
    div.custom_node {
      height: 100%;
      width: 100%;
      position: relative;
    }
    div.custom_node .fill_parent {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: inherit;
      height: inherit;
    }
    /*adjust label of custom nodes*/
    div.custom_node .fill_parent > div {
      left: 50%;
      top: 50%;
      -webkit-transform: translateY(-50%) translateX(-50%);
      -moz-transform: translateY(-50%) translateX(-50%);
    }

    div.simple_node {
      height: inherit;
      width: inherit;
      display: table;
    }

    .center .single_value_attribute .name {
      display: none;
    }
    .center .single_value_attribute .value .val {
      text-align: center;
    }

    div.simple_node div.label {
      display: table-cell;
      text-align: center;
      vertical-align: middle;
    }
    .box-overlay {
      position: absolute;
      background-color: #bbbbbb;
      opacity: 0;
      border-radius: 10px;
      cursor: move;
    }
    .selected {
      border: 3px solid #2bff6e;
    }
    #canvas-frame {
      overflow: hidden;
      border: 1px solid #aaa;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      margin-top: 32px;
      bottom: 0;
      left: 0;
      right: 0;
    }
    #canvas {
      width: 100%;
      height: 100%;
      background-color: #f5f5f5;
      position: absolute;
      background-image: none !important;
      opacity: 1 !important;
    }
    #canvas.tool-move {
      cursor: move !important;
    }
    #canvas.tool-move ._jsPlumb_connector {
      cursor: pointer !important;
    }
    #canvas.tool-node {
      cursor: pointer !important;
    }
    #canvas.tool-edge {
      cursor: default !important;
    }
    #canvas.tool-edge.dragging {
      cursor: move !important;
    }
    #canvas.tool-edge .node,
    #canvas.tool-node .node {
      opacity: 1;
    }
    #canvas.tool-edge .node {
      cursor: pointer !important;
    }
    #canvas.tool-edge.dragging .node {
      cursor: move !important;
    }

    #feedback {
      margin: 10px;
      color: #777777;
    }

    button[disabled="disabled"],
    button:disabled {
      opacity: 0.5;
    }

    ._jsPlumb_overlay {
      font-size: 12px;
    }

    .class_node,
    .edge_shape_node,
    .node_shape_node,
    .enum_node,
    .abstract_class_node,
    .object_node,
    .relation_node {
      overflow: hidden;
    }

    .class_node .label,
    .edge_shape_node .label,
    .node_shape_node .label,
    .enum_node .label,
    .abstract_class_node .label,
    .object_node .label,
    .relation_node .label {
      border-bottom: 1px solid #999999;
    }

    .edge_label .single_value_attribute .name,
    .label .single_value_attribute .name,
    .title .single_value_attribute .name,
    .name .single_value_attribute .name {
      display: none;
    }

    .class_node .label,
    .edge_shape_node .label,
    .node_shape_node .label,
    .enum_node .label,
    .abstract_class_node .label,
    .object_node .label,
    .relation_node .label {
      text-align: center;
      font-weight: bold;
      display: block;
    }

    .value input {
      border: 0;
      background: none;
      outline: none;
    }

    .edge_label {
      width: 200px;
      cursor: pointer;
    }

    .edge_label.fixed {
      background-color: #f5f5f5;
      width: auto;
      font-size: 14px;
    }

    .edge_label .single_value_attribute .value input,
    .label .single_value_attribute .value input,
    .title .single_value_attribute .value input,
    .name .single_value_attribute .value input {
      border: 0;
      background: none;
      width: 100%;
      text-align: center;
      font-weight: bold;
      outline: none;
      margin: 2px auto;
      display: block;
    }

    .edge_label .single_value_attribute .value div.val {
      text-align: center;
    }

    .attributes .list_attribute .name {
      display: none;
    }

    .attributes .list_attribute ul.list {
      padding: 2px;
      margin: 0;
      list-style: none;
    }

    .attributes .list_attribute ul.list li.key_value_attribute,
    .attributes .list_attribute ul.list li.condition_predicate,
    .attributes .list_attribute ul.list li.renaming_attr {
      overflow: hidden;
    }

    .attributes .list_attribute ul.list li.key_value_attribute div.key {
      float: left;
      width: 50%;
    }

    .attributes .list_attribute ul.list li.key_value_attribute div.value {
      float: left;
      width: 50%;
    }
    .attributes .list_attribute ul.list li.condition_predicate div.property,
    .attributes .list_attribute ul.list li.condition_predicate div.operator,
    .attributes .list_attribute ul.list li.condition_predicate div.val,
    .attributes .list_attribute ul.list li.condition_predicate div.operator2 {
      float: left;
      margin-left: 3px;
    }

    .attributes .list_attribute ul.list li.renaming_attr div.val,
    .attributes .list_attribute ul.list li.renaming_attr div.ref {
      float: left;
      margin-left: 3px;
      width: 50%;
    }

    .attributes .list_attribute ul.list li.renaming_attr div.vis {
      float: right;
      margin-left: 3px;
    }

    .attributes .list_attribute ul.list li.key_value_attribute div.key input,
    .attributes .list_attribute ul.list li.key_value_attribute div.value input,
    .attributes .list_attribute ul.list li.condition_predicate div.val input,
    .attributes .list_attribute ul.list li.renaming_attr div.val input,
    .attributes .list_attribute ul.list li.renaming_attr div.ref input {
      width: 100%;
      border: 0;
      outline: none;
      background: none;
    }

    .attributes .single_value_attribute {
      overflow: hidden;
      margin-left: 1px;
    }

    .attributes .single_value_attribute .name {
      width: 50%;
      float: left;
      margin: 3px 0;
    }

    .attributes .single_value_attribute .value {
      width: 50%;
      float: left;
    }

    .attributes .single_value_attribute .value input {
      border: 0;
      color: #666 !important;
      margin: 0;
      background: none;
    }

    .attributes .value div.val {
      text-align: right;
      margin: 3px;
    }

    .attributes .value input.val {
      text-align: right;
      float: right;
    }

    .size-preview {
      z-index: 99;
      background-color: #ffffff;
      color: #666666;
      position: absolute;
      top: 0;
      left: 0;
      border: 1px dashed black;
    }

    #canvas.tool-edge .node.lowlighted,
    #canvas.tool-edge .node.target {
      opacity: 0.5;
    }

    #canvas.tool-edge .node.source {
      opacity: 1;
    }

    #canvas.tool-edge.dragging .node.source {
      opacity: 0.5;
    }

    #canvas.tool-edge.dragging .node.source.current,
    #canvas.tool-edge.dragging .node.target {
      opacity: 1;
    }

    #canvas.tool-edge ._jsPlumb_connector {
      opacity: 0.5;
    }

    #canvas.tool-edge ._jsPlumb_connector._jsPlumb_dragging {
      opacity: 1;
    }

    /*noinspection CssUnknownProperty*/
    .type {
      position: absolute;
      bottom: 105%;
      left: 50%;
      transform: translateX(-50%);
      -o-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      -moz-transform: translateX(-50%);
      -webkit-transform: translateX(-50%);
      text-align: center;
      overflow: visible;
      white-space: nowrap;
      color: #aaaaaa;
      font-size: 0.9em;
    }

    #canvas.hide_type .type {
      display: none;
    }

    #viewsHide {
      display: none;
    }
    #viewCtrlContainer {
      display: none;
    }
    #lblCurrentView {
      display: none;
    }
    .user_highlight {
      position: absolute;
      top: 100%;
      left: 0;
      font-size: 12px;
      font-weight: bold;
      white-space: nowrap;
      text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    }

    .ghost-edge {
      opacity: 0.3;
      z-index: 30000;
    }

    .ghost-edge-overlay {
      z-index: 31000;
    }
    /* VML colors */
    .object {
      background-color: rgb(213, 235, 253);
    }
    .nodeshape {
      background-color: rgba(213, 235, 253, 0.5);
    }
    .enum {
      background-color: #f9ffc6;
    }
    .relationship {
      background-color: #ffcece;
    }
    .edgeshape {
      background-color: rgba(255, 206, 206, 0.5);
    }
    .relation {
      background-color: #d5f5d5;
    }
    .abstractclass {
      background-color: #ffffff;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
