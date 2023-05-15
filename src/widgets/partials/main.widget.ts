import "@jsplumb/browser-ui/css/jsplumbtoolkit.css";
import "../../styles/main.widget.css";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";

import "https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/1.4.1/jquery-migrate.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import AbstractClassNodeTool from "../../es6/canvas_widget/AbstractClassNodeTool";
import BiDirAssociationEdgeTool from "../../es6/canvas_widget/BiDirAssociationEdgeTool";
import Canvas from "../../es6/canvas_widget/Canvas";
import EdgeShapeNodeTool from "../../es6/canvas_widget/EdgeShapeNodeTool";
import EdgeTool from "../../es6/canvas_widget/EdgeTool";
import EnumNodeTool from "../../es6/canvas_widget/EnumNodeTool";
import GeneralisationEdgeTool from "../../es6/canvas_widget/GeneralisationEdgeTool";
import GenerateViewpointModel from "../../es6/canvas_widget/GenerateViewpointModel";
import JSONtoGraph from "../../es6/canvas_widget/JSONtoGraph";
import {
  AbstractClassNode,
  BiDirAssociationEdge,
  EdgeShapeNode,
  EntityManagerInstance as EntityManager,
  EnumNode,
  GeneralisationEdge,
  HistoryManagerInstance as HistoryManager,
  NodeShapeNode,
  ObjectNode,
  RelationshipGroupNode,
  RelationshipNode,
  UniDirAssociationEdge,
  ViewObjectNode,
} from "../../es6/canvas_widget/Manager";
import { DeleteViewOperation } from "../../es6/operations/non_ot/DeleteViewOperation";
import NodeShapeNodeTool from "../../es6/canvas_widget/NodeShapeNodeTool";
import NodeTool from "../../es6/canvas_widget/NodeTool";
import { ObjectNodeTool } from "../../es6/canvas_widget/ObjectNodeTool";
import RelationshipGroupNodeTool from "../../es6/canvas_widget/RelationshipGroupNodeTool";
import RelationshipNodeTool from "../../es6/canvas_widget/RelationshipNodeTool";
import UniDirAssociationEdgeTool from "../../es6/canvas_widget/UniDirAssociationEdgeTool";
import ViewGenerator from "../../es6/canvas_widget/view/ViewGenerator";
import ViewManager from "../../es6/canvas_widget/viewpoint/ViewManager";
import ViewObjectNodeTool from "../../es6/canvas_widget/viewpoint/ViewObjectNodeTool";
import ViewRelationshipNode from "../../es6/canvas_widget/viewpoint/ViewRelationshipNode";
import ViewRelationshipNodeTool from "../../es6/canvas_widget/viewpoint/ViewRelationshipNodeTool";
import { CONFIG, getWidgetTagName } from "../../es6/config";
import { getGuidanceModeling } from "../../es6/Guidancemodel";
import IWCW from "../../es6/lib/IWCWrapper";
import { getInstance } from "../../es6/lib/yjs-sync";
import ActivityOperation from "../../es6/operations/non_ot/ActivityOperation";
import InitModelTypesOperation from "../../es6/operations/non_ot/InitModelTypesOperation";
import NonOTOperation from "../../es6/operations/non_ot/NonOTOperation";
import SetModelAttributeNodeOperation from "../../es6/operations/non_ot/SetModelAttributeNodeOperation";
import SetViewTypesOperation from "../../es6/operations/non_ot/SetViewTypesOperation";
import UpdateMetamodelOperation from "../../es6/operations/non_ot/UpdateMetamodelOperation";
import UpdateViewListOperation from "../../es6/operations/non_ot/UpdateViewListOperation";
import ViewInitOperation from "../../es6/operations/non_ot/ViewInitOperation";
import { getUserInfo } from "../../es6/User";
import Util from "../../es6/Util";
import { SyncMetaWidget } from "../../widget";
import { Doc as YDoc } from "yjs";

// canvas widget
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.MAIN))
export class CanvasWidget extends SyncMetaWidget(
  LitElement,
  getWidgetTagName(CONFIG.WIDGET.NAME.MAIN)
) {
  @property({ type: String }) yjsHost = "localhost";
  @property({ type: Number }) yjsPort = 1234;
  @property({ type: String }) yjsProtocol = "ws";
  @property({ type: String }) yjsSpaceTitle = window.spaceTitle;

  canvas: Canvas;
  metamodel: any;
  model: any;
  _iwcw: any;
  user: any;
  yjsInstance: any;

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.9.2/jquery.contextMenu.min.css"
      />

      <style>
        ${getWidgetTagName(CONFIG.WIDGET.NAME.MAIN)} {
          height: 100%;
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
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossorigin="anonymous"
      />

      <div class="main-container p-2 d-flex flex-column h-100">
        <error-alert></error-alert>
        <div class="row" id="main-widget-utilities-container">
          <div class="col-9 d-flex justify-content-between">
            <div class="layout-buttons btn-group">
              <button
                id="viewsHide"
                class="btn btn-light"
                title="Close the View Panel"
                @click=${this.hideViews}
              >
                <i class="bi bi-caret-up"></i>
              </button>
              <button
                id="viewsShow"
                class="btn btn-light"
                title="Show the View Panel"
                @click=${this.showViews}
              >
                <i class="bi bi-caret-down"></i>
              </button>

              <button
                id="showtype"
                class="btn btn-light"
                title="Show the types of nodes and edges"
              >
                <i class="bi bi-tag"></i>
              </button>
              <button
                id="hideType"
                class="btn btn-light"
                title="Hide types of nodes and edges"
              >
                <i class="bi bi-tag-fill"></i>
              </button>
              <button
                id="applyLayout"
                class="btn btn-light"
                title="Apply Layout"
              >
                <i class="bi bi-layout-wtf"></i>
              </button>
              <button id="zoomIn" class="btn btn-light" title="Zoom in">
                <i class="bi bi-zoom-in"></i>
              </button>
              <button id="zoomOut" class="btn btn-light" title="Zoom out">
                <i class="bi bi-zoom-out"></i>
              </button>
            </div>
            <button
                id="save"
                class="btn btn-light"
                title="Save the current state of the model"
              >
                <i class="bi bi-cloud-arrow-up"></i>
              </button>
            <div class="operation-buttons btn-group">
              
              <!-- Uncommented the below line for Export as PNG! -->
              <button id="save_image" class="btn btn-light">
                <i class="bi bi-camera"></i>
              </button>
              <button
                id="undo-btn"
                class="btn btn-light"
                title="Undo your latest changes"
              >
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
              <button
                id="redo-btn"
                class="btn btn-light"
                title="Redo your latest changes"
              >
                <i class="bi bi-arrow-clockwise"></i>
              </button>
            </div>
            <span id="feedback"></span>
            <strong id="lblCurrentView"
              >View:<span id="lblCurrentViewId"></span
            ></strong>
          </div>
          <div class="col-3">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Search Node..."
                aria-label="Search Node..."
                aria-describedby="button-addon2"
                id="searchNodeInput"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                id="searchNodeButton"
              >
                <i class="bi bi-search"></i>
              </button>
            </div>
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
        <div id="ViewCtrlContainer"  style="display:none">
          <div class="d-flex mt-1">
            <button
              id="btnCreateViewpoint"
              class="btn btn-success me-1"
              title="Create a viewpoint"
            >
              <i class="bi bi-plus-circle"></i>
            </button>

            <div
              class="input-group"
              id="create-view-input-group"
              style="display: none;"
            >
              <button
                class="btn btn-danger"
                id="btnCancelCreateViewpoint"
                title="Cancel"
              >
                <i class="bi bi-x-circle"></i>
              </button>
              <input
                type="text"
                class="form-control"
                placeholder="Viewpoint name"
                id="txtNameViewpoint"
                aria-label="Viewpoint name input"
                aria-describedby="button-addon1"
              />
              <!-- <select id="ddmViewpointSelection"></select> -->
              <button
                class="btn btn-success"
                id="btnAddViewpoint"
                title="Create an empty viewpoint"
              >
                <i class="bi bi-check"></i>
              </button>
            </div>

            <div class="input-group" id="viewpoint-list-input-group">
              <select
                class="form-select"
                id="ddmViewSelection"
                aria-label="Select a view"
              ></select>
              <button
                id="btnShowView"
                class="btn btn-outline-secondary"
                type="button"
                title="Apply a viewpoint to the current model or visualize the viewpoint"
              >
                Show
              </button>
              <button
                class="btn btn-danger"
                id="btnDelViewPoint"
                title="Delete current viewpoint in the list"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <button
              class="btn btn-light"
              id="btnRefreshView"
              title="Refresh viewpoint list"
              style="display: none;"
            >
              Refresh
            </button>
          </div>
          </div>
          <div class="my-1"></div>
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
            <loading-spinner></loading-spinner>
          </div>
          <div id="q"></div>
        </div>
      </div>
    `;
  }

  initTools(vvs) {
    //canvas.removeTools();
    //canvas.addTool(MoveTool.TYPE, new MoveTool());
    if (vvs && vvs.hasOwnProperty("nodes")) {
      var nodes = vvs.nodes,
        node;
      for (var nodeId in nodes) {
        if (nodes.hasOwnProperty(nodeId)) {
          node = nodes[nodeId];
          this.canvas.addTool(
            node.label,
            new NodeTool(
              node.label,
              null,
              null,
              node.shape.containment,
              node.shape.defaultWidth,
              node.shape.defaultHeight
            )
          );
        }
      }
    }

    if (vvs && vvs.hasOwnProperty("edges")) {
      var edges = vvs.edges,
        edge;
      for (var edgeId in edges) {
        if (edges.hasOwnProperty(edgeId)) {
          edge = edges[edgeId];
          this.canvas.addTool(
            edge.label,
            new EdgeTool(edge.label, edge.relations)
          );
        }
      }
    }
  }

  hideViews() {
    $("#viewsHide").hide();
    $("#viewsShow").show();
    $("#ViewCtrlContainer").hide();

    var $lblCurrentViewId = $("#lblCurrentViewId");
    var viewpointId = $lblCurrentViewId.text();
    if (viewpointId.length > 0) {
      //reset view
      var operation = new InitModelTypesOperation(this.metamodel, true);
      this._iwcw.sendLocalNonOTOperation(
        CONFIG.WIDGET.NAME.PALETTE,
        operation.toNonOTOperation()
      );
      this._iwcw.sendLocalNonOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        operation.toNonOTOperation()
      );

      var activityOperation = new ActivityOperation(
        "ViewApplyActivity",
        "",
        this._iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]
      );
      this._iwcw.sendLocalNonOTOperation(
        CONFIG.WIDGET.NAME.ACTIVITY,
        activityOperation.toNonOTOperation()
      );
      const canvasMap = window.y.getMap("canvas");
      canvasMap.set("ViewApplyActivity", {
        viewId: "",
        jabberId: this._iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
      });

      EntityManager.setViewId(null);
      EntityManager.initModelTypes(this.metamodel);
      this.initTools(this.metamodel);

      ViewGenerator.reset(this.metamodel);

      $("#lblCurrentView").hide();
      $lblCurrentViewId.text("");
    }
  }

  showViews() {
    $("#viewsShow").hide();
    $("#viewsHide").show();
    $("#ViewCtrlContainer").show("fast");
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  async firstUpdated(e: any) {
    super.firstUpdated(e);
    const alertDiv = $(getWidgetTagName(CONFIG.WIDGET.NAME.MAIN)).find(
      ".alert"
    );
    alertDiv.attr("style", "display:none !important");
    const user = await getUserInfo();
    if (!user) {
      console.error("user is undefined");
    }
    this.yjsInstance = getInstance({
      host: this.yjsHost,
      port: this.yjsPort,
      protocol: this.yjsProtocol,
      spaceTitle: this.yjsSpaceTitle,
    });
    this.yjsInstance
      .connect()
      .then((y: YDoc) => {
        console.info(
          "CANVAS: Yjs Initialized successfully in room " +
            this.yjsSpaceTitle +
            " with y-user-id: " +
            y.clientID
        );
        const _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN, y);
        _iwcw.setSpace(user);
        const userMap = y.getMap("users");
        const dataMap = y.getMap("data");

        // TODO: dataMap is empty as it seems to need some time to be initialized
        // This is a workaround to wait for the initialization
        setTimeout(() => {
          try {
            const user = _iwcw.getUser();
            if (!user) {
              throw new Error("User not set");
            }
            if (user.globalId !== -1) {
              userMap.set(
                y.clientID.toString(),
                _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]
              );
            }
          } catch (error) {
            console.error(error);
          }
          if (!userMap.get(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID])) {
            var userInfo = _iwcw.getUser();
            userInfo.globalId = Util.getGlobalId(user, y);
            userMap.set(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], userInfo);
          }
          let metamodel, model;

          const guidancemodel = getGuidanceModeling();
          if (guidancemodel.isGuidanceEditor()) {
            //Set the model which is shown by the editor to the guidancemodel
            model = dataMap.get("guidancemodel");
            //Set the metamodel to the guidance metamodel
            metamodel = dataMap.get("guidancemetamodel");
          } else {
            metamodel = dataMap.get("metamodel");
            model = dataMap.get("model");
          }
          if (model) {
            console.info(
              "CANVAS: Found model in yjs room with " +
                Object.keys(model.nodes).length +
                " nodes and " +
                Object.keys(model.edges).length +
                " edges."
            );
          }
          EntityManager.init(metamodel);
          EntityManager.setGuidance(guidancemodel);
          this.metamodel = metamodel;
          this.model = model;
          this._iwcw = _iwcw;
          this.user = user;

          InitMainWidget(metamodel, model, _iwcw, user);

          window.onbeforeunload = function () {
            const userList = y.getMap("userList");
            const userMap = y.getMap("users");
            userList.delete(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
            userMap.delete(y.clientID.toString());
            const activityMap = y.getMap("activity");
            const leaveActivity = new ActivityOperation(
              "UserLeftActivity",
              null,
              _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]
            );
            activityMap.set("UserLeftActivity", leaveActivity.toJSON());
          };
        }, 1000);
      })
      .catch(function (message) {
        console.warn(message);
        alertDiv.find("#alert-message").text("Cannot connect to Yjs server.");
        alertDiv.show();
        const $mainWidgetRef = $(getWidgetTagName(CONFIG.WIDGET.NAME.MAIN));
        const $spinner = $mainWidgetRef.find("loading-spinner");
        $spinner.hide();
        alert("ERROR: " + message);
      });
  }
}

function registerOnDataReceivedCallback(_iwcw, y, userList, user) {
  _iwcw.registerOnDataReceivedCallback(function (operation) {
    const canvasMap = y.getMap("canvas");
    if (operation instanceof SetModelAttributeNodeOperation) {
      _iwcw.sendLocalNonOTOperation(
        CONFIG.WIDGET.NAME.ATTRIBUTE,
        new SetModelAttributeNodeOperation().toNonOTOperation()
      );
    } else if (operation instanceof UpdateViewListOperation) {
      canvasMap.set(UpdateViewListOperation.TYPE, true);
    } else if (operation instanceof UpdateMetamodelOperation) {
      const dataMap = y.getMap("data");
      var model = dataMap.get("model");
      var vls = GenerateViewpointModel(model);
      this.yjsSpaceTitle = operation.getModelingRoomName();
      this.yjsInstance = getInstance({
        host: this.yjsHost,
        port: this.yjsPort,
        protocol: this.yjsProtocol,
        spaceTitle: this.yjsSpaceTitle,
      });
      this.yjsInstance
        .connect()
        .then((y) => {
          const dataMap = y.getMap("data");
          dataMap.set("metamodel", vls);

          const metaModelStatus = y.getMap("metaModelStatus");
          metaModelStatus.set("uploaded", true);
          setTimeout(() => {
            alert("Metamodel uploaded successfully, the page will reload.");
            dataMap.set("model", null);
            location.reload();
          }, 400);
        })
        .catch(() => {
          const metaModelStatus = y.getMap("metaModelStatus");
          metaModelStatus.set("error", true);
        });
    } else if (operation.hasOwnProperty("getType")) {
      if (operation.getType() === "WaitForCanvasOperation") {
        switch (operation.getData().widget) {
          case CONFIG.WIDGET.NAME.ACTIVITY:
            _iwcw.sendLocalNonOTOperation(
              CONFIG.WIDGET.NAME.ACTIVITY,
              new NonOTOperation(
                "WaitForCanvasOperation",
                JSON.stringify({ local: user, list: userList })
              )
            );
            break;
          case CONFIG.WIDGET.NAME.HEATMAP:
            _iwcw.sendLocalNonOTOperation(
              CONFIG.WIDGET.NAME.HEATMAP,
              new NonOTOperation("WaitForCanvasOperation", JSON.stringify(user))
            );
            break;
          case CONFIG.WIDGET.NAME.ATTRIBUTE:
            _iwcw.sendLocalNonOTOperation(
              CONFIG.WIDGET.NAME.ATTRIBUTE,
              new NonOTOperation("WaitForCanvasOperation", JSON.stringify(user))
            );
            break;
          case CONFIG.WIDGET.NAME.PALETTE:
            const dataMap = y.getMap("data");
            var metamodel = dataMap.get("metamodel");
            if (!metamodel) metamodel = "{}";
            else metamodel = JSON.stringify(metamodel);
            _iwcw.sendLocalNonOTOperation(
              CONFIG.WIDGET.NAME.PALETTE,
              new NonOTOperation("WaitForCanvasOperation", metamodel)
            );
            break;
        }
      }
    }
  });
}

function InitMainWidget(metamodel, model, _iwcw, user, y = window.y) {
  const $mainWidgetRef = $(getWidgetTagName(CONFIG.WIDGET.NAME.MAIN));
  const $spinner = $mainWidgetRef.find("loading-spinner");

  const userList = [];
  const canvasElement = $("#canvas");
  const canvas = new Canvas(canvasElement);
  window.canvas = canvas;
  const joinMap = y.getMap("join");

  HistoryManager.init(canvas);

  joinMap.forEach(function (value, key) {
    userList.push(key);
  });

  joinMap.observe(function (event) {
    event.keysChanged.forEach(function (key) {
      const userId = event.keysChanged[key];

      if (userList.indexOf(userId) === -1) {
        userList.push(userId);
      }

      if (userId !== _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]) {
        //send to activity widget that a remote user has joined.
        const joinMap = y.getMap("join");
        if (!joinMap.has(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]))
          joinMap.set(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], true);
      } else {
        canvas.resetTool();
      }
    });

    const canvasMap = y.getMap("canvas");
    canvasMap.observe(function (event) {
      event.keysChanged.forEach((key) => {
        switch (key) {
          case UpdateViewListOperation.TYPE: {
            ViewManager.GetViewpointList();
            break;
          }
          case "ReloadWidgetOperation": {
            var text;
            const value = event.currentTarget.get(key);
            switch (value) {
              case "import": {
                const dataMap = y.getMap("data");
                var model = dataMap.get("model");
                text =
                  "ATTENTION! Imported new model containing <strong>" +
                  Object.keys(model.nodes).length +
                  " nodes</strong> and <strong>" +
                  Object.keys(model.edges).length +
                  " edges</strong>. Some widgets will reload";
                break;
              }
              case "delete": {
                text =
                  "ATTENTION! Deleted current model. Some widgets will reload";
                break;
              }
              case "meta_delete": {
                text =
                  "ATTENTION! Deleted current metamodel. Some widgets will reload";
                break;
              }
              case "meta_import": {
                text =
                  "ATTENTION! Imported new metamodel. Some widgets will reload";
                break;
              }
            }

            // when event.value is "import", then previously the model in the Yjs room should have
            // been changed
            // Problem: when the new model contains a node, that the previous model also contained,
            // then the position of the node does not get updated
            // therefore, this is manually done here
            const dataMap = y.getMap("data");
            const nodesMap = y.getMap("nodes");
            for (const key of nodesMap.keys()) {
              // check if the node also exists in the updated model

              var nodeInModel = dataMap.get("model")?.nodes[key];
              if (nodeInModel) {
                // update left and top position values
                nodesMap.get(key).set("left", nodeInModel.left);
                nodesMap.get(key).set("top", nodeInModel.top);
              }
            }
            const activityMap = y.getMap("activity");
            activityMap.set(
              "ReloadWidgetOperation",
              new ActivityOperation(
                "ReloadWidgetOperation",
                undefined,
                _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
                text
              ).toJSON()
            );
            location.reload();
          }
        }
      });
    });
    ViewManager.GetViewpointList();
  });

  registerOnDataReceivedCallback(_iwcw, y, userList, user);

  if (metamodel) {
    if (metamodel.hasOwnProperty("nodes")) {
      let nodes = metamodel.nodes,
        node;
      for (const nodeId in nodes) {
        if (nodes.hasOwnProperty(nodeId)) {
          node = nodes[nodeId];
          canvas.addTool(
            node.label,
            new NodeTool(
              node.label,
              null,
              null,
              node.shape.containment,
              node.shape.defaultWidth,
              node.shape.defaultHeight
            )
          );
        }
      }
    }
    if (metamodel.hasOwnProperty("edges")) {
      var edges = metamodel.edges,
        edge;
      for (var edgeId in edges) {
        if (edges.hasOwnProperty(edgeId)) {
          edge = edges[edgeId];
          canvas.addTool(edge.label, new EdgeTool(edge.label, edge.relations));
        }
      }
    }
    ViewManager.GetViewpointList();

    //Not needed int the model editor
    $("#btnCreateViewpoint").hide();
    $("#btnDelViewPoint").hide();

    //init the new tools for the canvas
    var initTools = function (vvs) {
      //canvas.removeTools();
      //canvas.addTool(MoveTool.TYPE, new MoveTool());
      if (vvs && vvs.hasOwnProperty("nodes")) {
        var nodes = vvs.nodes,
          node;
        for (var nodeId in nodes) {
          if (nodes.hasOwnProperty(nodeId)) {
            node = nodes[nodeId];
            canvas.addTool(
              node.label,
              new NodeTool(
                node.label,
                null,
                null,
                node.shape.containment,
                node.shape.defaultWidth,
                node.shape.defaultHeight
              )
            );
          }
        }
      }

      if (vvs && vvs.hasOwnProperty("edges")) {
        var edges = vvs.edges,
          edge;
        for (var edgeId in edges) {
          if (edges.hasOwnProperty(edgeId)) {
            edge = edges[edgeId];
            canvas.addTool(
              edge.label,
              new EdgeTool(edge.label, edge.relations)
            );
          }
        }
      }
    };

    //Modeling layer implementation. View generation process starts here
    $("#btnShowView").click(function () {
      //Get identifier of the current selected view
      var viewId = ViewManager.getViewIdOfSelected();
      var $currentViewIdLabel = $("#lblCurrentViewId");
      if (viewId === $currentViewIdLabel.text()) return;
      const viewsMap = y.getMap("views");
      var vvs = viewsMap.get(viewId);
      EntityManager.initViewTypes(vvs);

      //send the new tools to the palette as well
      var operation = new InitModelTypesOperation(vvs, true).toNonOTOperation();
      _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.PALETTE, operation);
      _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ATTRIBUTE, operation);
      _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.METADATA, operation);
      _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.OPENAPI, operation);

      var activityOperation = new ActivityOperation(
        "ViewApplyActivity",
        vvs.id,
        _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]
      );
      _iwcw.sendLocalNonOTOperation(
        CONFIG.WIDGET.NAME.ACTIVITY,
        activityOperation.toNonOTOperation()
      );
      const canvasMap = y.getMap("canvas");
      canvasMap.set("ViewApplyActivity", {
        viewId: viewId,
        jabberId: _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
      });

      //init the tools for canvas
      initTools(vvs);
      ViewGenerator.generate(metamodel, vvs);

      $("#lblCurrentView").show();
      $currentViewIdLabel.text(viewId);
    });

    //Modelling layer implementation

    var $saveImage = $("#save_image");
    $saveImage.show();
    $saveImage.click(function () {
      canvas.toPNG().then(function (uri) {
        var link = document.createElement("a");
        link.download = "export.png";
        link.href = uri;
        link.click();
      });
    });
  } else {
    $("#save_image").hide();
    //Add Node Tools
    canvas.addTool(ObjectNode.TYPE, new ObjectNodeTool());
    canvas.addTool(AbstractClassNode.TYPE, new AbstractClassNodeTool());
    canvas.addTool(RelationshipNode.TYPE, new RelationshipNodeTool());
    canvas.addTool(RelationshipGroupNode.TYPE, new RelationshipGroupNodeTool());
    canvas.addTool(EnumNode.TYPE, new EnumNodeTool());
    canvas.addTool(NodeShapeNode.TYPE, new NodeShapeNodeTool());
    canvas.addTool(EdgeShapeNode.TYPE, new EdgeShapeNodeTool());

    //Add Edge Tools
    canvas.addTool(GeneralisationEdge.TYPE, new GeneralisationEdgeTool());
    canvas.addTool(BiDirAssociationEdge.TYPE, new BiDirAssociationEdgeTool());
    canvas.addTool(UniDirAssociationEdge.TYPE, new UniDirAssociationEdgeTool());

    //Add View Types
    canvas.addTool(ViewObjectNode.TYPE, new ViewObjectNodeTool());
    canvas.addTool(ViewRelationshipNode.TYPE, new ViewRelationshipNodeTool());

    //Init control elements for views
    $("#btnCreateViewpoint").click(function () {
      ShowViewCreateMenu();
    });
    $("#btnCancelCreateViewpoint").click(function () {
      HideCreateMenu();
    });

    $("#btnShowView").click(function () {
      var viewId = ViewManager.getViewIdOfSelected();
      if (viewId === $("#lblCurrentViewId").text()) return;

      $("#lblCurrentView").show();
      $("#lblCurrentViewId").text(viewId);
      visualizeView(viewId);
    });

    $("#btnDelViewPoint").click(function () {
      const viewsMap = y.getMap("views");
      var viewId = ViewManager.getViewIdOfSelected();
      if (viewId && viewId !== $("#lblCurrentViewId").text()) {
        viewsMap.delete(viewId);
        _iwcw.sendLocalNonOTOperation(
          CONFIG.WIDGET.NAME.ATTRIBUTE,
          new DeleteViewOperation(viewId).toNonOTOperation()
        );
        ViewManager.deleteView(viewId);
      } else {
        viewsMap.set(viewId, null);
        ViewManager.deleteView(viewId);
        $("#viewsHide").click();
      }
    });

    $("#btnAddViewpoint").click(function () {
      var viewId = $("#txtNameViewpoint").val();
      if (ViewManager.existsView(viewId)) {
        alert("View already exists");
        return;
      }
      ViewManager.addView(viewId);
      HideCreateMenu();
      const canvasMap = y.getMap("canvas");
      canvasMap.set(UpdateViewListOperation.TYPE, true);
    });

    //Meta-modelling layer implementation
    $("#viewsHide").click(function () {
      $(this).hide();
      $("#viewsShow").show();
      $("#ViewCtrlContainer").hide("fast");

      var $lblCurrentViewId = $("#lblCurrentViewId");
      const dataMap = y.getMap("data");
      if ($lblCurrentViewId.text().length > 0) {
        var model = dataMap.get("model");
        //Disable the view types in the palette
        var operation = new SetViewTypesOperation(false);
        _iwcw.sendLocalNonOTOperation(
          CONFIG.WIDGET.NAME.PALETTE,
          operation.toNonOTOperation()
        );

        var activityOperation = new ActivityOperation(
          "ViewApplyActivity",
          "",
          _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]
        );
        _iwcw.sendLocalNonOTOperation(
          CONFIG.WIDGET.NAME.ACTIVITY,
          activityOperation.toNonOTOperation()
        );
        const canvasMap = y.getMap("canvas");
        canvasMap.set("ViewApplyActivity", {
          viewId: "",
          jabberId: _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
        });

        resetCanvas();
        JSONtoGraph(model, canvas);

        canvas.resetTool();

        $("#lblCurrentView").hide();
        $lblCurrentViewId.text("");
        EntityManager.setViewId(null);
      }
    });
  }
  //Functions and Callbacks for the view-based modeling approach
  var ShowViewCreateMenu = function () {
    $("#btnCreateViewpoint").hide();

    $("#viewpoint-list-input-group").hide();
    $("#create-view-input-group").show();
  };
  var HideCreateMenu = function () {
    $("#btnCreateViewpoint").show();
    $("#viewpoint-list-input-group").show();
    ViewManager.GetViewpointList();
    $("#create-view-input-group").hide();
  };

  function resetCanvas() {
    var edges = EntityManager.getEdges();
    for (edgeId in edges) {
      if (edges.hasOwnProperty(edgeId)) {
        var edge = EntityManager.findEdge(edgeId);
        edge.remove();
        //edge.triggerDeletion();
      }
    }
    var nodes = EntityManager.getNodes();
    for (const nodeId in nodes) {
      if (nodes.hasOwnProperty(nodeId)) {
        var node = EntityManager.findNode(nodeId);
        //node.triggerDeletion();
        node.remove();
      }
    }
    EntityManager.deleteModelAttribute();
  }

  var visualizeView = function (viewId) {
    const viewsMap = y.getMap("views");
    //ViewManager.getViewResource(viewId).getRepresentation('rdfjson', function (viewData) {
    var viewData = viewsMap.get(viewId);
    if (viewData) {
      resetCanvas();
      ViewToGraph(viewData);
      $("#lblCurrentView").show();
      $("#lblCurrentViewId").text(viewData.id);
      EntityManager.setViewId(viewData.id);
      canvas.resetTool();
    }
    //});
  };

  function ViewToGraph(json) {
    //Initialize the attribute widget
    var operation = new ViewInitOperation(json);
    _iwcw.sendLocalNonOTOperation(
      CONFIG.WIDGET.NAME.ATTRIBUTE,
      operation.toNonOTOperation()
    );

    //Enable the view types in the palette
    operation = new SetViewTypesOperation(true);
    _iwcw.sendLocalNonOTOperation(
      CONFIG.WIDGET.NAME.PALETTE,
      operation.toNonOTOperation()
    );

    var activityOperation = new ActivityOperation(
      "ViewApplyActivity",
      json.id,
      _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]
    );
    _iwcw.sendLocalNonOTOperation(
      CONFIG.WIDGET.NAME.ACTIVITY,
      activityOperation.toNonOTOperation()
    );
    const canvasMap = y.getMap("canvas");
    canvasMap.set("ViewApplyActivity", {
      viewId: json.id,
      jabberId: _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
    });

    JSONtoGraph(json, canvas);

    canvas.resetTool();
  }

  //-------------------------------------------------------------

  var $undo = $("#undo-btn");

  var $redo = $("#redo-btn");

  $undo.on("click", function () {
    HistoryManager.undo();
  });
  $redo.on("click", function () {
    HistoryManager.redo();
  });

  $("#showtype")
    .click(function () {
      canvas.get$node().removeClass("hide_type");
      $(this).hide();
      $("#hideType").show();
    })
    .hide();

  $("#hideType").click(function () {
    canvas.get$node().addClass("hide_type");
    $(this).hide();
    $("#showtype").show();
  });

  $("#zoomIn").click(function () {
    canvas.setZoom(canvas.getZoom() + 0.1);
  });

  $("#zoomOut").click(function () {
    canvas.setZoom(canvas.getZoom() - 0.1);
  });

  $("#applyLayout").click(function () {
    const userMap = window.y.getMap("users");
    const canvasMap = window.y.getMap("canvas");
    canvasMap.set("applyLayout", userMap.get(window.y.clientID.toString()));
    const activityMap = window.y.getMap("activity");
    activityMap.set(
      "ApplyLayoutActivity",
      new ActivityOperation(
        "ApplyLayoutActivity",
        null,
        userMap.get(window.y.clientID.toString()),
        "..applied Layout"
      ).toJSON()
    );
  });

  var $feedback = $("#feedback");

  // Add code for PNG export

  // Work later on moving this functionality to Export Widget
  //var uri = canvas.toPNG();
  // const canvasMap = y.getMap("canvas");
  // canvasMap.set('PngMap', uri);
  // Work later on moving this functionality to Export Widget

  // Export as PNG
  /*var $saveImage = $("#save_image");
        $saveImage.show();
        $saveImage.click(function () {
             canvas.toPNG().then(function (uri) {
                var link = document.createElement('a');
                link.download = "exportModel.png";
                link.href = uri;
                link.click();
             });
        });
        */

  // Export as PNG ends

  var saveFunction = function () {
    $feedback.text("Saving...");

    var viewId = $("#lblCurrentViewId").text();
    if (viewId.length > 0 && !metamodel) {
      ViewManager.updateViewContent(viewId);
      $feedback.text("Saved!");
      setTimeout(function () {
        $feedback.text("");
      }, 1000);
    } else {
      EntityManager.storeDataYjs();
      $feedback.text("Saved!");
      setTimeout(function () {
        $feedback.text("");
      }, 1000);
    }
  };
  $("#save").click(function () {
    saveFunction();
  });

  $("#dialog").dialog({
    autoOpen: false,
    resizable: false,
    height: 350,
    width: 400,
    modal: true,
    buttons: {
      Generate: function (event) {
        var title = $("#space_title").val();
        var label = $("#space_label")
          .val()
          .toString()
          .replace(/[^a-zA-Z]/g, "")
          .toLowerCase();

        if (title === "" || label === "") return;
        EntityManager.generateSpace(label, title).then(function (spaceObj) {
          var operation = new ActivityOperation(
            "EditorGenerateActivity",
            "-1",
            _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID],
            '..generated new Editor <a href="' +
              spaceObj.spaceURI +
              '" target="_blank">' +
              spaceObj.spaceTitle +
              "</a>",
            {}
          ).toNonOTOperation();
          //_iwcw.sendRemoteNonOTOperation(operation);
          _iwcw.sendLocalNonOTOperation(CONFIG.WIDGET.NAME.ACTIVITY, operation);

          $("#space_link")
            .text(spaceObj.spaceURI)
            .attr({ href: spaceObj.spaceURI })
            .show();
          $("#space_link_text").show();
          $("#space_link_input").hide();
          $(event.target).parent().hide();
        });
      },
      Close: function () {
        $(this).dialog("close");
      },
    },
    open: function () {
      var name = canvas
        .getModelAttributesNode()
        .getAttribute("modelAttributes[name]")
        .getValue()
        .getValue();
      var $spaceTitle = $("#space_title");
      var $spaceLabel = $("#space_label");

      if ($spaceTitle.val() === "") $spaceTitle.val(name);
      if ($spaceLabel.val() === "")
        $spaceLabel.val(name.replace(/[^a-zA-Z]/g, "").toLowerCase());

      $(":button:contains('Generate')").show();
    },
    close: function (/*event, ui*/) {
      $("#space_link_text").hide();
      $("#space_link_input").show();
    },
  });

  var $generate = $("#generate").click(function () {
    $("#dialog").dialog("open");
  });

  if (
    !metamodel ||
    (!metamodel.hasOwnProperty("nodes") && !metamodel.hasOwnProperty("edges"))
  ) {
    $generate.show();
  }

  if (metamodel) {
    var op = new InitModelTypesOperation(metamodel);
    _iwcw.sendLocalNonOTOperation(
      CONFIG.WIDGET.NAME.PALETTE,
      op.toNonOTOperation()
    );
    _iwcw.sendLocalNonOTOperation(
      CONFIG.WIDGET.NAME.ATTRIBUTE,
      op.toNonOTOperation()
    );
  }

  const $searchInput = $("#searchNodeInput");
  const $searchButton = $("#searchNodeButton");
  $searchButton.click(function () {
    const searchValue = $searchInput.val();
    const searchResultNode = EntityManager.findObjectNodeByLabel(searchValue);
    if (searchResultNode) {
      canvas.scrollNodeIntoView(searchResultNode);
      canvas.select(searchResultNode);
    }
  });
  $searchInput.keypress(function (e) {
    //Enter key
    if (e.which == 13) {
      $searchButton.click();
    }
  });

  if (model) {
    try {
      var report = JSONtoGraph(model, canvas);
    } catch (error) {
      var $errorMsg = $("#errorMsg");

      $("#canvas-frame").hide();
      $errorMsg.parent().css("display", "inline-table");
      $errorMsg.text(
        "SYNCMETA: Model is not compatible to the current Metamodel! Delete the current model or change the metamodel. For more information see the console."
      );
    }
    console.info("CANVAS: Initialization of model completed ", report);
    //initialize guidance model's if we are in metamodeling layer
    const dataMap = y.getMap("data");
    if (EntityManager.getLayer() === CONFIG.LAYER.META) {
      dataMap.set(
        "guidancemetamodel",
        EntityManager.generateGuidanceMetamodel()
      );
      dataMap.set("metamodelpreview", EntityManager.generateMetaModel());
    }
  } else {
    if (canvas.getModelAttributesNode() === null) {
      var modelAttributesNode = EntityManager.createModelAttributesNode(y);
      modelAttributesNode.registerYMap();
      canvas.setModelAttributesNode(modelAttributesNode);
      modelAttributesNode.addToCanvas(canvas);
    }
  }
  //local user joins
  const userId = _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID];
  if (!joinMap.has(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]))
    joinMap.set(userId.toString(), false);
  ViewManager.GetViewpointList();

  $spinner.hide();
}
