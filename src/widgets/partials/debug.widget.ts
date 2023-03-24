import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import { html, LitElement, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators.js";
import _ from "lodash-es";
import GenerateViewpointModel from "../../es6/canvas_widget/GenerateViewpointModel";
import { EntityManagerInstance as EntityManager } from "../../es6/canvas_widget/Manager";
import { CONFIG, getWidgetTagName } from "../../es6/config";
import { getGuidanceModeling } from "../../es6/Guidancemodel";
import { yjsSync } from "../../es6/lib/yjs-sync";
import init from "../../es6/shared";
import { SyncMetaWidget } from "../../widget";
import { Text as YText, Map as YMap } from "yjs";
// widget body used by all syncmeta widgets
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.DEBUG))
export class DebugWidget extends SyncMetaWidget(
  LitElement,
  getWidgetTagName(CONFIG.WIDGET.NAME.DEBUG)
) {
  widgetName = getWidgetTagName(CONFIG.WIDGET.NAME.DEBUG);
  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    const $spinner = $(getWidgetTagName(CONFIG.WIDGET.NAME.DEBUG)).find(
      "loading-spinner"
    );

    const guidance = getGuidanceModeling();
    yjsSync()
      .then((y) => {
        const dataMap = y.getMap("data");
        console.info(
          "DEBUG: Yjs successfully initialized in room " +
            window.spaceTitle +
            " with y-user-id: " +
            y.clientID
        );

        var $deleteMetamodel = $("#delete-meta-model").prop("disabled", false),
          $exportMetamodel = $("#export-meta-model").prop("disabled", false),
          $importMetamodel = $("#import-meta-model"),
          $deleteModel = $("#delete-model").prop("disabled", false),
          $exportModel = $("#export-model").prop("disabled", false),
          $importModel = $("#import-model"),
          $deleteGuidancemodel = $("#delete-guidance-model").prop(
            "disabled",
            true
          ),
          $exportGuidancemodel = $("#export-guidance-model").prop(
            "disabled",
            true
          ),
          $importGuidancemodel = $("#import-guidance-model"),
          $fileObject = $("#file-object"),
          $activityExport = $("#export-activity-list").prop("disabled", false),
          $activityDelete = $("#delete-activity-list").prop("disabled", false),
          feedback = function (msg) {
            alert(msg);
            $spinner.hide();
          };
        $importGuidancemodel.hide();
        $importMetamodel.hide();
        $importModel.hide();

        var getFileContent = function () {
          var fileReader,
            files = ($fileObject[0] as HTMLInputElement).files,
            file,
            deferred = $.Deferred();

          if (!files || files.length === 0)
            deferred.reject("No files selected");
          file = files[0];

          fileReader = new FileReader();
          fileReader.onload = function (e) {
            var data = e.target.result;
            try {
              data = JSON.parse(data);
            } catch (e) {
              deferred.reject(
                "Incorrect file type. Please make sure that your file is in JSON format"
              );
            }
            deferred.resolve(data);
          };
          try {
            fileReader.readAsText(file);
            return deferred.promise();
          } catch (error) {
            return deferred.reject(
              "Incorrect file type. Please make sure that your file is in JSON format"
            );
          }
        };

        $deleteModel.click(function () {
          const retVal = confirm("Are you sure you want to delete the model ?");
          if (retVal) {
            $spinner.show();
            $exportModel.prop("disabled", true);
            $deleteModel.prop("disabled", true);
            const dataMap = y.getMap("data");
            //dataMap.delete('model');
            dataMap.set("model", null);
            const canvasMap = y.getMap("canvas");
            canvasMap.set("ReloadWidgetOperation", "delete");
            feedback("The model was deleted. The page will be reloaded.");
            location.reload();
          }
        });

        $deleteMetamodel.click(function () {
          const retVal = confirm(
            "Are you sure you want to delete the Metamodel ?"
          );
          if (retVal) {
            $spinner.show();
            $exportMetamodel.prop("disabled", true);
            $deleteMetamodel.prop("disabled", true);
            const dataMap = y.getMap("data");
            //this does not work ??????
            //dataMap.delete('metamodel');
            dataMap.set("metamodel", null);
            const canvasMap = y.getMap("canvas");
            canvasMap.set("ReloadWidgetOperation", "meta_delete");
            feedback("The meta model was deleted. The page will be reloaded.");
            location.reload();
          }
        });

        $deleteGuidancemodel.click(function () {
          const retVal = confirm(
            "Are you sure you want to delete the Guidancemodel ?"
          );
          if (retVal) {
            $spinner.show();
            $exportGuidancemodel.prop("disabled", true);
            $deleteGuidancemodel.prop("disabled", true);
            const dataMap = y.getMap("data");
            dataMap.set("guidancemodel", null);
            feedback(
              "The guidance model was deleted. The page will be reloaded."
            );
            location.reload();
          }
        });

        $activityDelete.click(function () {
          const retVal = confirm(
            "Are you sure you want to delete the activity list ?"
          );
          if (retVal) {
            $spinner.show();
            const activityMap = y.getMap("activity");
            activityMap.set("log", null);
            feedback(
              "The activity log has been deleted. The page will be reloaded."
            );
            location.reload();
          }
        });

        $exportModel.click(function () {
          $spinner.show();
          const dataMap = y.getMap("data");
          var link = document.createElement("a");
          link.download = "model.json";
          link.href =
            "data:," +
            encodeURIComponent(JSON.stringify(dataMap.get("model"), null, 4));
          link.click();
          $spinner.hide();
        });

        $exportMetamodel.click(function () {
          $spinner.show();
          const dataMap = y.getMap("data");
          var link = document.createElement("a");
          link.download = "vls.json";
          link.href =
            "data:," +
            encodeURIComponent(
              JSON.stringify(dataMap.get("metamodel"), null, 4)
            );
          link.click();
          $spinner.hide();
        });

        $exportGuidancemodel.click(function () {
          $spinner.show();
          const dataMap = y.getMap("data");
          var link = document.createElement("a");
          link.download = "guidance_model.json";
          link.href =
            "data:," +
            encodeURI(JSON.stringify(dataMap.get("guidancemodel"), null, 4));
          link.click();
          $spinner.hide();
        });

        $activityExport.click(function () {
          $spinner.show();

          const activityMap = y.getMap("activity");
          var link = document.createElement("a");
          link.download = "activityList.json";
          link.href =
            "data:," +
            encodeURI(JSON.stringify(activityMap.get("log"), null, 4));
          link.click();
          $spinner.hide();
        });

        $importModel.click(function () {
          $spinner.show();
          getFileContent()
            .then(function (data) {
              var initAttributes = function (attrs, map) {
                if (attrs.hasOwnProperty("[attributes]")) {
                  var attr = attrs["[attributes]"].list;
                  for (var key in attr) {
                    if (attr.hasOwnProperty(key)) {
                      if (attr[key].hasOwnProperty("key")) {
                        var ytext = map.set(attr[key].key.id, new YText());
                        ytext.insert(0, attr[key].key.value);
                      } else {
                        var ytext = map.set(attr[key].value.id, new YText());
                        ytext.insert(0, attr[key].value.value);
                      }
                    }
                  }
                } else {
                  for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                      var value = attrs[key].value;
                      if (!value.hasOwnProperty("option")) {
                        if (value.value instanceof String) {
                          var ytext = map.set(value.id, new YText());
                          ytext.insert(0, value.value);
                        }
                      }
                    }
                  }
                }
              };
              const dataMap = y.getMap("data");
              if (guidance.isGuidanceEditor()) {
                dataMap.set("guidancemodel", data);
              } else dataMap.set("model", data);
              for (var key in data.nodes) {
                if (data.nodes.hasOwnProperty(key)) {
                  var entity = data.nodes[key];
                  const nodesMap = y.getMap("nodes");
                  nodesMap.set(key, new YMap());
                  var attrs = entity.attributes;
                  if (entity.hasOwnProperty("label")) {
                    var ytext = new YText(entity.label.value.id);
                    nodesMap.set(entity.label.value.id, ytext);
                    ytext.insert(0, entity.label.value.value);
                  }
                  initAttributes(attrs, nodesMap);
                }
              }
              for (var key in data.edges) {
                if (data.edges.hasOwnProperty(key)) {
                  var entity = data.edges[key];
                  const edgeMap = y.getMap("edges");
                  var map = edgeMap.set(key, new YMap());
                  var attrs = entity.attributes;
                  if (entity.hasOwnProperty("label")) {
                    const ytext = new YText();
                    map.set(entity.label.value.id, ytext);
                    ytext.insert(0, entity.label.value.value);
                  }
                  initAttributes(attrs, map);
                }
              }
              const canvasMap = y.getMap("canvas");
              canvasMap.set("ReloadWidgetOperation", "import");
              feedback(
                "Imported model successfully! The page will be reloaded."
              );
              location.reload();
            })
            .catch(function (err) {
              console.error(err);
              feedback("Error: " + err);
              $spinner.hide();
            });
        });

        $importMetamodel.click(function () {
          $spinner.show();
          $importMetamodel.prop("disabled", true);
          getFileContent()
            .then(function (data) {
              const dataMap = y.getMap("data");
              try {
                var vls = GenerateViewpointModel(data, y);
                //if everything is empty. Maybe it is already a VLS
                if (
                  _.keys(vls.nodes).length === 0 &&
                  _.keys(vls.edges).length === 0 &&
                  _.keys(vls.attributes).length === 0
                ) {
                  dataMap.set("metamodel", data);
                } else {
                  dataMap.set("metamodel", vls);
                }
                feedback("Imported Meta Model, the page will reload now");
                setTimeout(() => {
                  location.reload();
                }, 1000);
              } catch (e) {
                feedback("Error: " + e);
                throw e;
              }
              $importMetamodel.prop("disabled", false);
              $spinner.hide();
            })
            .catch(function (err) {
              console.error(err);
              feedback("Error: " + err);
              $importMetamodel.prop("disabled", false);
              $spinner.hide();
            });
        });

        $importGuidancemodel.click(function () {
          $spinner.show();
          getFileContent()
            .then(function (data) {
              const dataMap = y.getMap("data");
              $exportGuidancemodel.prop("disabled", false);
              $deleteGuidancemodel.prop("disabled", false);
              EntityManager.setGuidance(guidance);
              dataMap.set(
                "guidancemodel",
                EntityManager.generateLogicalGuidanceRepresentation(data)
              );
              feedback("Done!");
              $spinner.hide();
            })
            .catch(function (e) {
              feedback("Error: " + e);
              $spinner.hide();
            });
        });

        var checkExistence = function () {
          if (!dataMap.get("model")) {
            $exportModel.prop("disabled", true);
            $deleteModel.prop("disabled", true);
          } else {
            $exportModel.prop("disabled", false);
            $deleteModel.prop("disabled", false);
          }

          if (!dataMap.get("metamodel")) {
            $exportMetamodel.prop("disabled", true);
            $deleteMetamodel.prop("disabled", true);
          } else {
            $exportMetamodel.prop("disabled", false);
            $deleteMetamodel.prop("disabled", false);
          }
          const activityMap = y.getMap("activity");
          if (!activityMap.get("log")) {
            $activityExport.prop("disabled", true);
            $activityDelete.prop("disabled", true);
          } else {
            $activityExport.prop("disabled", false);
            $activityDelete.prop("disabled", false);
          }

          if (!dataMap.get("guidancemodel")) {
            $exportGuidancemodel.prop("disabled", true);
            $deleteGuidancemodel.prop("disabled", true);
          } else {
            $exportGuidancemodel.prop("disabled", false);
            $deleteGuidancemodel.prop("disabled", false);
          }
        };

        checkExistence();
        setInterval(checkExistence, 10000);

        $spinner.hide();

        $("input:file").change(() => {
          $importGuidancemodel.show();
          $importMetamodel.show();
          $importModel.show();
        });
      })
      .catch((err) => {
        console.error(err);
        this.showErrorAlert("Cannot connect to Yjs server.");
      });
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
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
        crossorigin="anonymous"
      />
      <style>
        #debug-container {
          position: relative;
        }
        ${getWidgetTagName(CONFIG.WIDGET.NAME.DEBUG)} {
          position: relative;
          overflow-y: auto;
        }
      </style>

      
              <div id="debug-container">
                 <error-alert></error-alert>

                <div class="seperating_box">
                  <h6>Select a JSON file</h6>
                  <input
                    class="form-control"
                    type="file"
                    id="file-object"
                    accept=".json"
                    value="Load a file"
                  />
                </div>

                <hr />
                <div id="import-export-container">
                  <div id="modelDiv" class="seperating_box">
                    <h6>
                      <strong>(Meta- or Guidance-)Model</strong>
                    </h6>
                    <button
                      id="import-model"
                      class="btn btn-primary"
                      title="Import a model to the canvas"
                    >
                      Import
                    </button>
                    <button
                      id="export-model"
                      class="btn btn-secondary"
                      title="export the model as JSON"
                    >
                      Export
                    </button>
                    <button
                      id="delete-model"
                      title="delete the model"
                      class="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                  <hr />
                  <div id="vlsDiv" class="seperating_box">
                    <h6><strong>Metamodel</strong> (Model Editor only)</h6>
                    <button
                      class="btn btn-primary"
                      id="import-meta-model"
                      title="Refresh the role space to apply the new VLS."
                    >
                      Import
                    </button>
                    <button
                      id="export-meta-model"
                      title="Download the VLS as JSON"
                      class="btn btn-secondary"
                    >
                      Export
                    </button>
                    <button
                      id="delete-meta-model"
                      title="Refresh the role space and delete the current modeling language"
                      class="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                  <hr />
                  <div id="guidanceDiv" class="seperating_box">
                    <h6>
                      <strong>Logical Guidancemodel</strong> (Model Editor only)
                    </h6>
                    <button id="import-guidance-model" class="btn btn-primary">
                      Import
                    </button>
                    <button
                      id="export-guidance-model"
                      class="btn btn-secondary"
                    >
                      Export
                    </button>
                    <button id="delete-guidance-model" class="btn btn-danger">
                      Delete
                    </button>
                  </div>
                  <hr />
                  <div id="activityDiv" class="seperating_box">
                    <h6><strong>Activity list</strong></h6>
                    <button id="export-activity-list" class="btn btn-secondary">
                      Export
                    </button>
                    <button id="delete-activity-list" class="btn btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
                <loading-spinner></loading-spinner>
              </div>
              <br />
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