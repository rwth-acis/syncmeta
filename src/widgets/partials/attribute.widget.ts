import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "../../styles/attribute.widget.css";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import Quill from "quill/dist/quill";
import AttributeWrapper from "../../es6/attribute_widget/AttributeWrapper";
import { EntityManagerInstance as EntityManager } from "../../es6/attribute_widget/EntityManager";
import ViewGenerator from "../../es6/attribute_widget/view/ViewGenerator";
import { CONFIG, getWidgetTagName } from "../../es6/config";
import { getGuidanceModeling } from "../../es6/Guidancemodel";
import IWCW from "../../es6/lib/IWCWrapper";
import { yjsSync } from "../../es6/lib/yjs-sync";
import InitModelTypesOperation from "../../es6/operations/non_ot/InitModelTypesOperation";
import SetModelAttributeNodeOperation from "../../es6/operations/non_ot/SetModelAttributeNodeOperation";
import { WaitForCanvas } from "../../es6/WaitForCanvas";
import init from "../../es6/shared";
import { SyncMetaWidget } from "../../widget";

@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.ATTRIBUTE))
export class AttributeWidget extends SyncMetaWidget(
  LitElement,
  getWidgetTagName(CONFIG.WIDGET.NAME.ATTRIBUTE)
) {
  widgetName = getWidgetTagName(CONFIG.WIDGET.NAME.ATTRIBUTE);
  firstUpdated(e: any) {
    super.firstUpdated(e);
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
                JSONToGraph(model, attributeWrapper);
              }

              console.info(
                "ATTRIBUTE: Initialization of model completed",
                window.syncmetaLog
              );

              iwc.registerOnDataReceivedCallback(function (operation) {
                var modelAttributesNode;
                if (operation instanceof SetModelAttributeNodeOperation) {
                  modelAttributesNode =
                    attributeWrapper.getModelAttributesNode();
                  if (modelAttributesNode === null) {
                    modelAttributesNode =
                      EntityManager.createModelAttributesNode();
                    attributeWrapper.setModelAttributesNode(
                      modelAttributesNode
                    );
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

              const canvas = y.getMap("canvas");
              canvas.observe(function (event) {
                event.keysChanged.forEach((key) => {
                  switch (key) {
                    case "ReloadWidgetOperation": {
                      location.reload();
                    }
                  }
                });
              });
            })
            .catch((e) => {
              console.error(e);
              this.showErrorAlert("Cannot connect to Canvas widget.");
            })
            .finally(() => {
              $(getWidgetTagName(CONFIG.WIDGET.NAME.ATTRIBUTE))
                .find("loading-spinner")
                .hide();
            });
        })
        .catch((err) => {
          console.error(err);
          this.showErrorAlert("Cannot connect to Yjs server.");
        });
    } catch (error) {
      console.error(error);
    }
  }

  hideErrorAlert() {
    $(this.widgetName).find("#alert-message").text("");
    $(this.widgetName).find("error-alert").hide();
  }
  showErrorAlert(message: string) {
    $(this.widgetName).find("#alert-message").text(message);
    $(this.widgetName).find("error-alert").show();
  }

  render() {
    return html`
      <style>
        ${getWidgetTagName(CONFIG.WIDGET.NAME.ATTRIBUTE)} {
          height: 100%;
          position: relative;
        }
      </style>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://code.jquery.com/ui/1.13.1/themes/smoothness/jquery-ui.css"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
        crossorigin="anonymous"
      />

      <link
        href="https://cdn.quilljs.com/1.3.7/quill.snow.css"
        rel="stylesheet"
      />

      <div class="main-wrapper">
        <error-alert></error-alert>
        <div id="loading" class="loading"></div>
        <div id="wrapper"></div>
        <div id="q"></div>
        <loading-spinner></loading-spinner>
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

function JSONToGraph(json, wrapper) {
  var modelAttributesNode;

  if (json.attributes && Object.keys(json.attributes).length > 0) {
    modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(
      json.attributes
    );
    wrapper.setModelAttributesNode(modelAttributesNode);
    modelAttributesNode.addToWrapper(wrapper);
    modelAttributesNode.registerYType();
    wrapper.select(modelAttributesNode);
  }
  for (const nodeId in json.nodes) {
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
      node.addToWrapper(wrapper); // This has to be done before registering the YType, because otherwise Quill will not be able to find the DOM element (for MultiValue.js)
      if ("registerYType" in node) {
        node.registerYType();
      }
    }
  }
  for (const edgeId in json.edges) {
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
