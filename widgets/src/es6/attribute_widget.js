/**
 * Namespace for attribute widget.
 * @namespace attribute_widget
 */
import $ from "jquery-ui";
import IWCW from "./lib/IWCWrapper";
// import AttributeWidgetTest from "./../test/AttributeWidgetTest";

Promise.all([
  import("lib/yjs-sync"),
  import("WaitForCanvas"),
  import("attribute_widget/AttributeWrapper"),
  import("attribute_widget/EntityManager"),
  import("attribute_widget/view/ViewGenerator"),
  import("operations/non_ot/InitModelTypesOperation"),
  import("operations/non_ot/ViewInitOperation"),
  import("operations/non_ot/SetModelAttributeNodeOperation"),
  import("promise!Guidancemodel"),
]).then(function ([
  yjsSync,
  WaitForCanvas,
  AttributeWrapper,
  EntityManager,
  ViewGenerator,
  InitModelTypesOperation,
  ViewInitOperation,
  SetModelAttributeNodeOperation,
  guidancemodel,
]) {
  WaitForCanvas(CONFIG.WIDGET.NAME.ATTRIBUTE, 10, 1500)
    .done(function (user) {
      $("#wrapper")
        .find("h1")
        .text("Got Response from Canvas! Connecting to Yjs....");
      var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE);
      iwc.setSpace(user);

      yjsSync().done(function (y, spaceTitle) {
        window.y = y;
        window.syncmetaLog = {
          widget: "Attribute",
          initializedYTexts: 0,
          objects: {},
          errors: {},
          firstAttemptFail: {},
        };
        $("#wrapper").find("h1").text("Successfully connected to Yjs.");
        setTimeout(function () {
          $("#wrapper").find("h1").remove();
        }, 2000);
        console.info(
          "ATTRIBUTE: Yjs successfully initialized in room " +
            spaceTitle +
            " with y-user-id: " +
            y.clientID
        );
        const userMap = y.getMap("users");
        userMap.set(y.clientID, iwc.getUser()[CONFIG.NS.PERSON.JABBERID]);
        const dataMap = y.getMap("data");
        var model = dataMap.get("model");
        if (model)
          console.info(
            "ATTRIBUTE: Found model in yjs room with " +
              Object.keys(model.nodes).length +
              " nodes and " +
              Object.keys(model.edges).length +
              " edges."
          );
        // InitAttributeWidget(model);
        if (guidancemodel.isGuidanceEditor()) {
          const dataMap = y.getMap("data");
          EntityManager.init(dataMap.get("guidancemetamodel"));
          model = dataMap.get("guidancemodel");
        } else {
          EntityManager.init(dataMap.get("metamodel"));
        }
        var wrapper = new AttributeWrapper($("#wrapper"));

        if (model) {
          // JSONtoGraph(model);
          var modelAttributesNode;
          var nodeId, edgeId;
          if (json.attributes && !_.isEmpty(json.attributes)) {
            modelAttributesNode =
              EntityManager.createModelAttributesNodeFromJSON(json.attributes);
            wrapper.setModelAttributesNode(modelAttributesNode);
            modelAttributesNode.registerYType();
            modelAttributesNode.addToWrapper(wrapper);
            wrapper.select(modelAttributesNode);
          }
          for (nodeId in json.nodes) {
            if (json.nodes.hasOwnProperty(nodeId)) {
              var node = EntityManager.createNodeFromJSON(
                json.nodes[nodeId].type,
                nodeId,
                json.nodes[nodeId].left,
                json.nodes[nodeId].top,
                json.nodes[nodeId].width,
                json.nodes[nodeId].height,
                json.nodes[nodeId].zIndex,
                json.nodes[nodeId]
              );
              node.registerYType();
              node.addToWrapper(wrapper);
            }
          }
          for (edgeId in json.edges) {
            if (json.edges.hasOwnProperty(edgeId)) {
              var edge = EntityManager.createEdgeFromJSON(
                json.edges[edgeId].type,
                edgeId,
                json.edges[edgeId].source,
                json.edges[edgeId].target,
                json.edges[edgeId]
              );
              edge.registerYType();
              edge.addToWrapper(wrapper);
            }
          }
        }

        console.info(
          "ATTRIBUTE: Initialization of model completed",
          window.syncmetaLog
        );

        iwc.registerOnDataReceivedCallback(function (operation) {
          var modelAttributesNode;
          if (operation instanceof SetModelAttributeNodeOperation) {
            modelAttributesNode = wrapper.getModelAttributesNode();
            if (modelAttributesNode === null) {
              modelAttributesNode = EntityManager.createModelAttributesNode();
              wrapper.setModelAttributesNode(modelAttributesNode);
              modelAttributesNode.registerYType();
              modelAttributesNode.addToWrapper(wrapper);
            }
            wrapper.select(modelAttributesNode);
          } else if (operation instanceof InitModelTypesOperation) {
            var vvs = operation.getVLS();
            const dataMap = y.getMap("data");
            var metamodel = dataMap.get("metamodel");
            if (vvs.hasOwnProperty("id")) {
              EntityManager.initViewTypes(vvs);
              if (operation.getViewGenerationFlag()) {
                ViewGenerator.generate(metamodel, vvs);
              }
            } else {
              EntityManager.setViewId(null);
              if (operation.getViewGenerationFlag()) {
                ViewGenerator.reset(metamodel);
              }
            }
          }
        });

        var operation = new SetModelAttributeNodeOperation();
        iwc.sendLocalNonOTOperation(
          CONFIG.WIDGET.NAME.MAIN,
          operation.toNonOTOperation()
        );

        if (
          CONFIG.TEST.ATTRIBUTE &&
          (iwc.getUser()[CONFIG.NS.PERSON.TITLE] === CONFIG.TEST.USER ||
            iwc.getUser()[CONFIG.NS.PERSON.MBOX] === CONFIG.TEST.EMAIL)
        )
          AttributeWidgetTest();
        const canvas = y.getMap("canvas");
        canvas.observe(function (event) {
          switch (event.name) {
            case "ReloadWidgetOperation": {
              frameElement.contentWindow.location.reload();
            }
          }
        });

        $("#loading").hide();
      });
    })
    .fail(function (e) {
      $("#wrapper")
        .find("h1")
        .text("Add Canvas Widget to Space and refresh the widget.");
      $("#loading").hide();
    });
});

// function InitAttributeWidget(model) {
//   if (guidancemodel.isGuidanceEditor()) {
//     const dataMap = y.getMap("data");
//     EntityManager.init(dataMap.get("guidancemetamodel"));
//     model = dataMap.get("guidancemodel");
//   } else {
//     EntityManager.init(dataMap.get("metamodel"));
//   }
//   var wrapper = new AttributeWrapper($("#wrapper"));

//   if (model) JSONtoGraph(model);
//   console.info(
//     "ATTRIBUTE: Initialization of model completed",
//     window.syncmetaLog
//   );
// }

// function JSONtoGraph(json) {
//   var modelAttributesNode;
//   var nodeId, edgeId;
//   if (json.attributes && !_.isEmpty(json.attributes)) {
//     modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(
//       json.attributes
//     );
//     wrapper.setModelAttributesNode(modelAttributesNode);
//     modelAttributesNode.registerYType();
//     modelAttributesNode.addToWrapper(wrapper);
//     wrapper.select(modelAttributesNode);
//   }
//   for (nodeId in json.nodes) {
//     if (json.nodes.hasOwnProperty(nodeId)) {
//       var node = EntityManager.createNodeFromJSON(
//         json.nodes[nodeId].type,
//         nodeId,
//         json.nodes[nodeId].left,
//         json.nodes[nodeId].top,
//         json.nodes[nodeId].width,
//         json.nodes[nodeId].height,
//         json.nodes[nodeId].zIndex,
//         json.nodes[nodeId]
//       );
//       node.registerYType();
//       node.addToWrapper(wrapper);
//     }
//   }
//   for (edgeId in json.edges) {
//     if (json.edges.hasOwnProperty(edgeId)) {
//       var edge = EntityManager.createEdgeFromJSON(
//         json.edges[edgeId].type,
//         edgeId,
//         json.edges[edgeId].source,
//         json.edges[edgeId].target,
//         json.edges[edgeId]
//       );
//       edge.registerYType();
//       edge.addToWrapper(wrapper);
//     }
//   }
// }
