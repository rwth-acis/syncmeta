/**
 * Namespace for canvas widget.
 * @namespace canvas_widget
 */

import "jquery";
import "jquery-ui";
import Util from "./Util";
import IWCW from "./lib/IWCWrapper";
// import CanvasWidgetTest from "./../test/CanvasWidgetTest";
import { CONFIG } from "./config";
import yjsSync from "./lib/yjs-sync";
import {
  HistoryManagerInstance as HistoryManager,
  EntityManagerInstance as EntityManager,
  ObjectNode,
  EnumNode,
  GeneralisationEdge,
  UniDirAssociationEdge,
} from "./canvas_widget/Manager";
import { BiDirAssociationEdge } from "./canvas_widget/Manager";
import { RelationshipNode } from "./canvas_widget/Manager";
import {
  AbstractClassNode,
  EdgeShapeNode,
  NodeShapeNode,
  ViewObjectNode,
} from "./canvas_widget/Manager";
import NodeTool from "./canvas_widget/NodeTool";
import ToolSelectOperation from "./operations/non_ot/ToolSelectOperation";
import { RelationshipGroupNode } from "./canvas_widget/Manager";
import { getUserInfo } from "./User";
import { getGuidanceModeling } from "./GuidanceModel";
import Canvas from "./canvas_widget/Canvas";
import { ObjectNodeTool } from "./canvas_widget/ObjectNodeTool";
import NonOTOperation from "./operations/non_ot/NonOTOperation";
import ActivityOperation from "./operations/non_ot/ActivityOperation";
import ViewInitOperation from "./operations/non_ot/ViewInitOperation";
import UpdateViewListOperation from "./operations/non_ot/UpdateViewListOperation";
import SetViewTypesOperation from "./operations/non_ot/SetViewTypesOperation";
import InitModelTypesOperation from "./operations/non_ot/InitModelTypesOperation";
import SetModelAttributeNodeOperation from "./operations/non_ot/SetModelAttributeNodeOperation";
import UpdateMetamodelOperation from "./operations/non_ot/UpdateMetamodelOperation";
import AbstractClassNodeTool from "./canvas_widget/AbstractClassNodeTool";
import RelationshipNodeTool from "./canvas_widget/RelationshipNodeTool";
import RelationshipGroupNodeTool from "./canvas_widget/RelationshipGroupNodeTool";
import EnumNodeTool from "./canvas_widget/EnumNodeTool";
import NodeShapeNodeTool from "./canvas_widget/NodeShapeNodeTool";
import EdgeShapeNodeTool from "./canvas_widget/EdgeShapeNodeTool";
import EdgeTool from "./canvas_widget/EdgeTool";
import GeneralisationEdgeTool from "./canvas_widget/GeneralisationEdgeTool";
import BiDirAssociationEdgeTool from "./canvas_widget/BiDirAssociationEdgeTool";
import UniDirAssociationEdgeTool from "./canvas_widget/UniDirAssociationEdgeTool";
import ViewObjectNodeTool from "./canvas_widget/viewpoint/ViewObjectNodeTool";
import ViewRelationshipNode from "./canvas_widget/viewpoint/ViewRelationshipNode";
import ViewRelationshipNodeTool from "./canvas_widget/viewpoint/ViewRelationshipNodeTool";
import ViewManager from "./canvas_widget/viewpoint/ViewManager";
import ViewGenerator from "./canvas_widget/view/ViewGenerator";
import JSONtoGraph from "./canvas_widget/JSONtoGraph";
import GenerateViewpointModel from "./canvas_widget/GenerateViewpointModel";

export default async function () {
  const user = await getUserInfo();
  if (!user) {
    console.error("user is undefined");
  }
  const _iwcw = IWCW.getInstance(CONFIG.WIDGET.NAME.MAIN);
  _iwcw.setSpace(user);

  yjsSync()
    .done(function (y, spaceTitle) {
      console.info(
        "CANVAS: Yjs Initialized successfully in room " +
          spaceTitle +
          " with y-user-id: " +
          y.clientID
      );
      const userMap = y.getMap("users");
      try {
        const user = _iwcw.getUser();
        if (!user) {
          throw new Error("User not set");
        }
        if (user.globalId !== -1) {
          userMap.set(y.clientID, _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
        }
      } catch (error) {
        console.error(error);
      }
      if (!userMap.get(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID])) {
        var userInfo = _iwcw.getUser();
        userInfo.globalId = Util.getGlobalId(user, y);
        userMap.set(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], userInfo);
      }
      var metamodel, model;
      const guidancemodel = getGuidanceModeling();
      if (guidancemodel.isGuidanceEditor()) {
        const dataMap = y.getMap("data");
        //Set the model which is shown by the editor to the guidancemodel
        model = dataMap.get("guidancemodel");
        //Set the metamodel to the guidance metamodel
        metamodel = dataMap.get("guidancemetamodel");
      } else {
        metamodel = y.getMap("data").get("metamodel");
        model = y.getMap("data").get("model");
      }
      if (model)
        console.info(
          "CANVAS: Found model in yjs room with " +
            Object.keys(model.nodes).length +
            " nodes and " +
            Object.keys(model.edges).length +
            " edges."
        );
      EntityManager.init(metamodel);
      EntityManager.setGuidance(guidancemodel);
      window.y = y;
      InitMainWidget(metamodel, model);
    })
    .fail(function () {
      console.info("yjs log: Yjs intialization failed!");
      window.y = undefined;
      InitMainWidget(undefined, undefined);
    });

  function InitMainWidget(metamodel, model) {
    var userList = [];
    const canvasElement = $("#canvas");
    var canvas = new Canvas(canvasElement);
    HistoryManager.init(canvas);

    //not working pretty well
    window.onbeforeunload = function () {
      // const userList = y.getMap("userList");
      // const userMap = y.getMap("users");
      //userList.delete(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]);
      //userMap.delete(y.clientID);
      const activityMap = y.getMap("activity");
      const leaveActivity = new ActivityOperation(
        "UserLeftActivity",
        null,
        _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]
      );
      activityMap.set("UserLeftActivity", leaveActivity.toJSON());
    };
    const joinMap = y.getMap("join");
    joinMap.observe(function (event) {
      if (userList.indexOf(event.name) === -1) {
        userList.push(event.name);
      }

      if (
        !event.value &&
        event.name !== _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID]
      ) {
        //send to activity widget that a remote user has joined.
        const joinMap = y.getMap("join");
        joinMap.set(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], true);
      } else if (
        event.name === _iwcw.getUser()[CONFIG.NS.PERSON.JABBERID] &&
        !event.value
      ) {
        canvas.resetTool();
        $("#loading").hide();

        // if (
        //   CONFIG.TEST.CANVAS &&
        //   (_iwcw.getUser()[CONFIG.NS.PERSON.TITLE] === CONFIG.TEST.USER ||
        //     _iwcw.getUser()[CONFIG.NS.PERSON.MBOX] === CONFIG.TEST.EMAIL)
        // )
        //   CanvasWidgetTest(canvas);

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
            yjsSyncLoader(operation.getModelingRoomName())
              .done(function (y) {
                const dataMap = y.getMap("data");
                dataMap.set("metamodel", vls);
                yjsSyncLoader(operation.getMetaModelingRoomName())
                  .done(function (y) {
                    const metaModelStatus = y.getMap("metaModelStatus");
                    metaModelStatus.set("uploaded", true);
                  })
                  .fail(() => {
                    const metaModelStatus = y.getMap("metaModelStatus");
                    metaModelStatus.set("error", true);
                  });
              })
              .fail(() => {
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
                    new NonOTOperation(
                      "WaitForCanvasOperation",
                      JSON.stringify(user)
                    )
                  );
                  break;
                case CONFIG.WIDGET.NAME.ATTRIBUTE:
                  _iwcw.sendLocalNonOTOperation(
                    CONFIG.WIDGET.NAME.ATTRIBUTE,
                    new NonOTOperation(
                      "WaitForCanvasOperation",
                      JSON.stringify(user)
                    )
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
        const canvasMap = y.getMap("canvas");
        canvasMap.observe(function (event) {
          switch (event.name) {
            case UpdateViewListOperation.TYPE: {
              ViewManager.GetViewpointList();
              break;
            }
            case "ReloadWidgetOperation": {
              var text;
              switch (event.value) {
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
              for (var key of nodesMap.keys()) {
                // check if the node also exists in the updated model

                var nodeInModel = dataMap.get("model").nodes[key];
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
                )
              );
              frameElement.contentWindow.location.reload();
            }
          }
        });
      }
    });

    if (metamodel) {
      if (metamodel.hasOwnProperty("nodes")) {
        var nodes = metamodel.nodes,
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
      if (metamodel.hasOwnProperty("edges")) {
        var edges = metamodel.edges,
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
        var operation = new InitModelTypesOperation(
          vvs,
          true
        ).toNonOTOperation();
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
      $("#viewsHide").click(function () {
        $(this).hide();
        $("#viewsShow").show();
        $("#ViewCtrlContainer").hide();

        var $lblCurrentViewId = $("#lblCurrentViewId");
        var viewpointId = $lblCurrentViewId.text();
        if (viewpointId.length > 0) {
          //var $loading = $("#loading");
          //$loading.show();

          //reset view
          var operation = new InitModelTypesOperation(metamodel, true);
          _iwcw.sendLocalNonOTOperation(
            CONFIG.WIDGET.NAME.PALETTE,
            operation.toNonOTOperation()
          );
          _iwcw.sendLocalNonOTOperation(
            CONFIG.WIDGET.NAME.ATTRIBUTE,
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

          EntityManager.setViewId(null);
          EntityManager.initModelTypes(metamodel);
          initTools(metamodel);

          ViewGenerator.reset(metamodel);

          $("#lblCurrentView").hide();
          $lblCurrentViewId.text("");
          // $loading.hide();
        }
      });

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
      //Add Node Tools
      canvas.addTool(ObjectNode.TYPE, new ObjectNodeTool());
      canvas.addTool(AbstractClassNode.TYPE, new AbstractClassNodeTool());
      canvas.addTool(RelationshipNode.TYPE, new RelationshipNodeTool());
      canvas.addTool(
        RelationshipGroupNode.TYPE,
        new RelationshipGroupNodeTool()
      );
      canvas.addTool(EnumNode.TYPE, new EnumNodeTool());
      canvas.addTool(NodeShapeNode.TYPE, new NodeShapeNodeTool());
      canvas.addTool(EdgeShapeNode.TYPE, new EdgeShapeNodeTool());

      //Add Edge Tools
      canvas.addTool(GeneralisationEdge.TYPE, new GeneralisationEdgeTool());
      canvas.addTool(BiDirAssociationEdge.TYPE, new BiDirAssociationEdgeTool());
      canvas.addTool(
        UniDirAssociationEdge.TYPE,
        new UniDirAssociationEdgeTool()
      );

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
        $("#loading").show();
        $("#lblCurrentView").show();
        $("#lblCurrentViewId").text(viewId);
        visualizeView(viewId);
      });

      $("#btnDelViewPoint").click(function () {
        const viewsMap = y.getMap("views");
        var viewId = ViewManager.getViewIdOfSelected();
        if (viewId !== $("#lblCurrentViewId").text()) {
          viewsMap.set(viewId, null);
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
        $("#ViewCtrlContainer").hide();

        var $lblCurrentViewId = $("#lblCurrentViewId");
        const dataMap = y.getMap("data");
        if ($lblCurrentViewId.text().length > 0) {
          var $loading = $("#loading");
          $loading.show();

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
          $("#loading").hide();
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
      $("#ddmViewSelection").hide();
      $("#btnShowView").hide();
      $("#btnDelViewPoint").hide();
      $("#txtNameViewpoint").show();
      $("#btnAddViewpoint").show();
      $("#btnCancelCreateViewpoint").show();
    };
    var HideCreateMenu = function () {
      $("#btnCreateViewpoint").show();
      $("#ddmViewSelection").show();
      $("#btnDelViewPoint").show();
      $("#btnShowView").show();
      $("#txtNameViewpoint").hide();
      $("#btnAddViewpoint").hide();
      $("#btnCancelCreateViewpoint").hide();
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
      for (nodeId in nodes) {
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
      $("#loading").hide();
      canvas.resetTool();
    }

    //-------------------------------------------------------------

    var $undo = $("#undo");
    $undo.prop("disabled", true);
    var $redo = $("#redo");
    $redo.prop("disabled", true);

    $undo.click(function () {
      HistoryManager.undo();
    });

    $redo.click(function () {
      HistoryManager.redo();
    });

    $("#showtype")
      .click(function () {
        canvas.get$node().removeClass("hide_type");
        $(this).hide();
        $("#hidetype").show();
      })
      .hide();

    $("#hidetype").click(function () {
      canvas.get$node().addClass("hide_type");
      $(this).hide();
      $("#showtype").show();
    });

    $("#viewsShow").click(function () {
      $(this).hide();
      $("#viewsHide").show();
      $("#ViewCtrlContainer").show();
    });

    $("#zoomin").click(function () {
      canvas.setZoom(canvas.getZoom() + 0.1);
    });

    $("#zoomout").click(function () {
      canvas.setZoom(canvas.getZoom() - 0.1);
    });

    $("#applyLayout").click(function () {
      const userMap = window.y.getMap("users");
      const canvasMap = window.y.getMap("canvas");
      canvasMap.set("applyLayout", userMap.get(window.y.clientID));
      const activityMap = window.y.getMap("activity");
      activityMap.set(
        "ApplyLayoutActivity",
        new ActivityOperation(
          "ApplyLayoutActivity",
          null,
          userMap.get(window.y.clientID),
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
            _iwcw.sendLocalNonOTOperation(
              CONFIG.WIDGET.NAME.ACTIVITY,
              operation
            );

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

    if (model) {
      var report = JSONtoGraph(model, canvas);
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
        var modelAttributesNode = EntityManager.createModelAttributesNode();
        modelAttributesNode.registerYMap();
        canvas.setModelAttributesNode(modelAttributesNode);
        modelAttributesNode.addToCanvas(canvas);
      }
    }
    //local user joins
    joinMap.set(_iwcw.getUser()[CONFIG.NS.PERSON.JABBERID], false);
    ViewManager.GetViewpointList();
  }
}
