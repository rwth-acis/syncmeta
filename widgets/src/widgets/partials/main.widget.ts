import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { SyncMetaWidget } from "../../widget";
import "../../es6/main_widget.js";
import { CONFIG, getWidgetTagName } from "../../es6/config";

// canvas widget
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.MAIN))
export class CanvasWidget extends SyncMetaWidget(LitElement) {
  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.9.2/jquery.contextMenu.min.css"
      />

      <style>
        ${getWidgetTagName(CONFIG.WIDGET.NAME.MAIN)} {
          height: 100%;
          position: relative;
        }
        .button_bar {
          width: 50%;
          float: left;
          display: flex;
          flex-wrap: wrap;
        }
        .main-container {
          position: relative;
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
          width: 100%;
          height: 100%;
          position: relative;
        }
        #canvas {
          width: 100%;
          height: 100%;
          max-width: none !important;
          max-height: none !important;
          border-radius: 6px;
          background-color: #e2e2e2;
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
        .attributes
          .list_attribute
          ul.list
          li.condition_predicate
          div.operator2 {
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

        .attributes
          .list_attribute
          ul.list
          li.key_value_attribute
          div.key
          input,
        .attributes
          .list_attribute
          ul.list
          li.key_value_attribute
          div.value
          input,
        .attributes
          .list_attribute
          ul.list
          li.condition_predicate
          div.val
          input,
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
        .main-container {
          position: relative;
        }
      </style>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.1/font/bootstrap-icons.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://code.jquery.com/ui/1.13.1/themes/smoothness/jquery-ui.css"
      />
      <!-- <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/vendor/bootstrap.min.prefixed.css"
      />
     -->
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossorigin="anonymous"
      />

      <div class="main-container container d-flex flex-column h-100">
        <div id="loading" class="loading"></div>
        <div class="row">
          <div class="col">
            <div class="flex">
              <button
                id="viewsHide"
                class="btn btn-light"
                title="Close the View Panel"
              >
                <i class="bi bi-caret-up"></i>
              </button>
              <button
                id="viewsShow"
                class="btn btn-light"
                title="Show the View Panel"
              >
                <i class="bi bi-caret-down"></i>
              </button>
              <button
                id="save"
                class="btn btn-light"
                title="Save the current state of the model"
              >
                <i class="bi bi-save"></i>
              </button>
              <!-- Uncommented the below line for Export as PNG! -->
              <button id="save_image" class="btn btn-light">
                <i class="bi bi-camera"></i>
              </button>
              <!--<button id="generate" style="display: none"><img width="20px" height="20px" src="<%= grunt.config('baseUrl') %>/img/generate.png" /></button>-->
              <span id="feedback"></span>
              <strong id="lblCurrentView"
                >View:<span id="lblCurrentViewId"></span
              ></strong>
            </div>
            <div id="ViewCtrlContainer" class="flex my-2" style="display:none">
              <button
                id="btnCreateViewpoint"
                class="btn btn-light"
                title="Create a viewpoint"
              >
                <i class="bi bi-plus-circle"></i>
              </button>
              <button
                class="btn btn-light"
                id="btnCancelCreateViewpoint"
                title="Cancel"
                style="display: none;"
              >
                <i class="bi bi-x-circle"></i>
              </button>
              <input
                id="txtNameViewpoint"
                type="text"
                placeholder="name"
                style="display: none;"
              />
              <select
                id="ddmViewpointSelection"
                style="display: none;"
              ></select>
              <button
                class="btn btn-light"
                id="btnAddViewpoint"
                title="Create an empty viewpoint"
                style="display: none;"
              >
                <i class="bi bi-check"></i>
              </button>

              <select id="ddmViewSelection"></select>
              <button
                id="btnShowView"
                class="btn btn-light"
                title="Apply a viewpoint to the current model or visualize the viewpoint"
              >
                Show
              </button>
              <button
                class="btn btn-light"
                id="btnRefreshView"
                title="Refresh viewpoint list"
                style="display: none;"
              >
                Refresh
              </button>
              <button
                class="btn btn-light"
                id="btnDelViewPoint"
                title="Delete current viewpoint in the list"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <div class="col d-flex justify-content-end align-items-start">
            <button
              id="showtype"
              class="btn btn-light"
              title="Show the types of nodes and edges"
            >
              <i class="bi bi-tag"></i>
            </button>
            <button
              id="hidetype"
              class="btn btn-light"
              title="Hide types of nodes and edges"
            >
              <i class="bi bi-tag-fill"></i>
            </button>
            <button id="applyLayout" class="btn btn-light" title="Apply Layout">
              <i class="bi bi-layout-wtf"></i>
            </button>
            <button id="zoomin" class="btn btn-light" title="Zoom in">
              <i class="bi bi-zoom-in"></i>
            </button>
            <button id="zoomout" class="btn btn-light" title="Zoom out">
              <i class="bi bi-zoom-out"></i>
            </button>
            <button
              id="undo"
              class="btn btn-light"
              title="Undo your latest changes"
            >
              <i class="bi bi-arrow-counterclockwise"></i>
            </button>
            <button
              id="redo"
              class="btn btn-light"
              title="Redo your latest changes"
            >
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
          <div
            class="col"
            id="dialog"
            style="display:none"
            title="Generate editor"
          >
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
              <span
                id="space_link_comment"
                style="color: #FF3333; display: none"
                >Space already exists, will be overwritten!</span
              >
            </p>
            <p>
              <strong>Editor space title:</strong
              ><input size="32" type="text" id="space_title" />
            </p>
          </div>
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
        <div
          class="row mx-auto border border-dark border-2 rounded"
          id="canvas-frame"
        >
          <div id="canvas"></div>
        </div>
        <div id="q"></div>
        <loading-spinner></loading-spinner>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  firstUpdated(e: any) {
    super.firstUpdated(e);
  }

  onSaveImage() {
    // canvas.toPNG().then(function (uri) {
    //   var link = document.createElement("a");
    //   link.download = "export.png";
    //   link.href = uri;
    //   link.click();
    // });
  }
}
