/**
 * Namespace for attribute widget.
 * @namespace attribute_widget
 */
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";

import IWCW from "./lib/IWCWrapper";
import { CONFIG } from "./config";
// import AttributeWidgetTest from "./../test/AttributeWidgetTest";
import { EntityManagerInstance as EntityManager } from "./attribute_widget/EntityManager";
import { yjsSync } from "./lib/yjs-sync";
import { WaitForCanvas } from "./WaitForCanvas";
import AttributeWrapper from "./attribute_widget/AttributeWrapper";
import ViewGenerator from "./attribute_widget/view/ViewGenerator";
import InitModelTypesOperation from "./operations/non_ot/InitModelTypesOperation";
import SetModelAttributeNodeOperation from "./operations/non_ot/SetModelAttributeNodeOperation";
import { getGuidanceModeling } from "./Guidancemodel"; //promise!Guidancemod
import { getWidgetTagName } from "./config.js";

$(function () {
  const alertDiv = $(getWidgetTagName(CONFIG.WIDGET.NAME.ATTRIBUTE)).find(
    ".alert"
  );
  alertDiv.attr("style", "display:none !important");
  const guidancemodel = getGuidanceModeling();
  try {
    yjsSync()
      .then((y) => {
        WaitForCanvas(CONFIG.WIDGET.NAME.ATTRIBUTE, y)
          .then((user) => {
            var iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.ATTRIBUTE, y);
            iwc.setSpace(user);
            if (!window.y) window.y = y;
            window.syncmetaLog = {
              widget: "Attribute",
              initializedYTexts: 0,
              objects: {},
              errors: {},
              firstAttemptFail: {},
            };

            console.info(
              "ATTRIBUTE: Yjs successfully initialized in room " +
                undefined +
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
            var attributeWrapper = new AttributeWrapper($("#wrapper"));

            if (model) {
              JSONtoGraph(model, attributeWrapper);
            }

            console.info(
              "ATTRIBUTE: Initialization of model completed",
              window.syncmetaLog
            );

            iwc.registerOnDataReceivedCallback(function (operation) {
              var modelAttributesNode;
              if (operation instanceof SetModelAttributeNodeOperation) {
                modelAttributesNode = attributeWrapper.getModelAttributesNode();
                if (modelAttributesNode === null) {
                  modelAttributesNode =
                    EntityManager.createModelAttributesNode();
                  attributeWrapper.setModelAttributesNode(modelAttributesNode);
                  modelAttributesNode.registerYType();
                  modelAttributesNode.addToWrapper(attributeWrapper);
                }
                attributeWrapper.select(modelAttributesNode);
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

            // if (
            //   CONFIG.TEST.ATTRIBUTE &&
            //   (iwc.getUser()[CONFIG.NS.PERSON.TITLE] === CONFIG.TEST.USER ||
            //     iwc.getUser()[CONFIG.NS.PERSON.MBOX] === CONFIG.TEST.EMAIL)
            // )
            //   AttributeWidgetTest();
            const canvas = y.getMap("canvas");
            canvas.observe(function (event) {
              event.keysChanged.forEach((key) => {
                switch (key) {
                  case "ReloadWidgetOperation": {
                    frameElement.contentWindow.location.reload();
                  }
                }
              });
            });
          })
          .catch(function (e) {
            console.error(e);
            alertDiv
              .find("#alert-message")
              .text("Cannot connect to Canvas widget.");
            alertDiv.show();
          })
          .finally(() => {
            $(getWidgetTagName(CONFIG.WIDGET.NAME.ATTRIBUTE))
              .find("loading-spinner")
              .hide();
          });
      })
      .catch((err) => {
        console.error(err);
        alertDiv.find("#alert-message").text("Cannot connect to Yjs server.");
        alertDiv.show();
      });
  } catch (error) {
    console.error(error);
  }
});

function JSONtoGraph(json, wrapper) {
  var modelAttributesNode;
  var nodeId, edgeId;

  if (json.attributes && Object.keys(json.attributes).length > 0) {
    modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(
      json.attributes
    );
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
      if (!node) {
        throw new Error("Node could not be created from JSON");
      }
      if ("registerYMap" in node) {
        // this fixes #93. For some reason, the attributes of EnumNode are not initialized
        // when calling registerYType. Since regisiterYMap also internally call registerYType this
        // fix should not break anything.
        node.registerYMap();
      } else {
        node.registerYType();
      }
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
