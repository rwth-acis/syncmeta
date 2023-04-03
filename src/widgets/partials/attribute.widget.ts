import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
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
    $(this.widgetName).find("error-alert").hide();
  }

  render() {
    return html`
      <style>
        ${getWidgetTagName(CONFIG.WIDGET.NAME.ATTRIBUTE)} {
          height: 100%;
          position: relative;
        }
        .ql-container {
          border-radius: 0.25rem;
        }
        #wrapper {
          overflow: auto;
          height: 100%;
          position: relative;
        }
        .main-wrapper {
          height: 100%;
        }
        .list_attribute ul.list {
          list-style: none;
          padding-left: 10px;
          margin: 5px 0;
        }

        .list_attribute div span.ui-icon {
          margin-left: 10px;
        }

        .key_value_attribute,
        .condition_predicate,
        .renaming_attr {
          overflow: auto;
        }

        .key_value_attribute div,
        .condition_predicate div,
        .renaming_attr div {
          width: 30%;
          float: left;
        }

        .key_value_attribute div input,
        .condition_predicate div input,
        .renaming_attr div input {
          border: 1px solid #aaaaaa;
        }

        .key_value_attribute span.ui-icon,
        .condition_predicate span.ui-icon {
          margin-top: 3px;
        }

        .single_value_attribute {
          overflow: auto;
        }

        .single_quiz_attribute {
          overflow: auto;
        }

        .single_value_attribute div {
          float: left;
          margin-right: 10px;
        }

        .single_quiz_attribute div {
          float: left;
          margin-right: 10px;
        }

        .list .single_value_attribute .name {
          display: none;
        }
        .list .single_quiz_attribute .name {
          display: none;
        }

        .single_value_attribute .name {
          width: 120px;
        }
        .single_quiz_attribute .name {
          width: 120px;
        }

        .single_value_attribute div.value span.color_preview {
          width: 12px;
          height: 18px;
          background-color: #ffffff;
          display: inline-block;
          border: 1px solid #4a4a4a;
          position: relative;
          top: 5px;
          left: -14px;
        }

        .single_quiz_attribute div.value span.color_preview {
          width: 12px;
          height: 18px;
          background-color: #ffffff;
          display: inline-block;
          border: 1px solid #4a4a4a;
          position: relative;
          top: 5px;
          left: -14px;
        }

        .single_value_attribute div.value textarea {
          width: 400px;
          height: 80px;
        }

        .single_quiz_attribute div.value textarea {
          width: 400px;
          height: 80px;
        }

        #modelAttributes .attribute_default_node .label {
          font-weight: bold;
        }

        .label {
          text-transform: capitalize;
        }

        .key_value_attribute input,
        select {
          width: 150px;
        }
        .condition_predicate input,
        select {
          width: 150px;
        }

        .renaming_attr input,
        select {
          width: 150px;
        }

        .type {
          font-weight: bold;
          margin: 0 0 3px;
        }

        .show_hint {
          font-size: 12px;
        }

        .hint {
          font-size: 12px;
          overflow-y: auto;
          max-height: 150px;
        }

        .codeEditorValue {
          position: absolute;
          width: 560px;
          height: 200px;
          overflow-y: auto;
        }
        .main-wrapper {
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
    modelAttributesNode.registerYType();
    modelAttributesNode.addToWrapper(wrapper);
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
      if ("registerYType" in node) {
        node.registerYType();
      }
      node.addToWrapper(wrapper);
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
