import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import { yjsSync } from "./lib/yjs-sync";
import GenerateViewpointModel from "./canvas_widget/GenerateViewpointModel";
import { EntityManagerInstance as EntityManager } from "./canvas_widget/Manager";
import { getGuidanceModeling } from "./Guidancemodel";
import loadHTML from "./html.template.loader";

const loadingSpinnerHTML = await loadHTML(
  "../templates/loading-spinner.html",
  import.meta.url
);

const $spinner = $(loadingSpinnerHTML);

$(async function () {
  $("#debug-container").append($spinner);
  
  const guidance = getGuidanceModeling();
  yjsSync()
    .then((y) => {
      const dataMap = y.getMap("data");
      console.info(
        "DEBUG: Yjs suc cessfully initialized in room " +
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
        };

      var getFileContent = function () {
        var fileReader,
          files = $fileObject[0].files,
          file,
          deferred = $.Deferred();

        if (!files || files.length === 0) deferred.reject("No files selected");
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
        $exportModel.prop("disabled", true);
        $deleteModel.prop("disabled", true);
        const dataMap = y.getMap("data");
        //dataMap.delete('model');
        dataMap.set("model", null);
        const canvasMap = y.getMap("canvas");
        canvasMap.set("ReloadWidgetOperation", "delete");
        feedback("The model was deleted. The page will be reloaded.");
        location.reload();
      });

      $deleteMetamodel.click(function () {
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
      });

      $deleteGuidancemodel.click(function () {
        $exportGuidancemodel.prop("disabled", true);
        $deleteGuidancemodel.prop("disabled", true);
        const dataMap = y.getMap("data");
        dataMap.set("guidancemodel", null);
        feedback("The guidance model was deleted. The page will be reloaded.");
        location.reload();
      });

      $activityDelete.click(function () {
        const activityMap = y.getMap("activity");
        activityMap.set("log", null);
        feedback(
          "The activity log has been deleted. The page will be reloaded."
        );
        location.reload();
      });

      $exportModel.click(function () {
        const dataMap = y.getMap("data");
        var link = document.createElement("a");
        link.download = "model.json";
        link.href =
          "data:," +
          encodeURIComponent(JSON.stringify(dataMap.get("model"), null, 4));
        link.click();
      });

      $exportMetamodel.click(function () {
        const dataMap = y.getMap("data");
        var link = document.createElement("a");
        link.download = "vls.json";
        link.href =
          "data:," +
          encodeURIComponent(JSON.stringify(dataMap.get("metamodel"), null, 4));
        link.click();
      });

      $exportGuidancemodel.click(function () {
        const dataMap = y.getMap("data");
        var link = document.createElement("a");
        link.download = "guidance_model.json";
        link.href =
          "data:," +
          encodeURI(JSON.stringify(dataMap.get("guidancemodel"), null, 4));
        link.click();
      });

      $activityExport.click(function () {
        const activityMap = y.getMap("activity");
        var link = document.createElement("a");
        link.download = "activityList.json";
        link.href =
          "data:," + encodeURI(JSON.stringify(activityMap.get("log"), null, 4));
        link.click();
      });

      $importModel.click(function () {
        getFileContent()
          .then(function (data) {
            var initAttributes = function (attrs, map) {
              if (attrs.hasOwnProperty("[attributes]")) {
                var attr = attrs["[attributes]"].list;
                for (var key in attr) {
                  if (attr.hasOwnProperty(key)) {
                    if (attr[key].hasOwnProperty("key")) {
                      var ytext = map.set(attr[key].key.id, new Y.Text());
                      ytext.insert(0, attr[key].key.value);
                    } else {
                      var ytext = map.set(attr[key].value.id, new Y.Text());
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
                        var ytext = map.set(value.id, new Y.Text());
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
                nodesMap.set(key, new Y.Map());
                var attrs = entity.attributes;
                if (entity.hasOwnProperty("label")) {
                  var ytext = new Y.Text(entity.label.value.id);
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
                var map = edgeMap.set(key, new Y.Map());
                var attrs = entity.attributes;
                if (entity.hasOwnProperty("label")) {
                  var ytext = map.set(entity.label.value.id, new Y.Text());
                  ytext.insert(0, entity.label.value.value);
                }
                initAttributes(attrs, map);
              }
            }
            const canvasMap = y.getMap("canvas");
            canvasMap.set("ReloadWidgetOperation", "import");
            feedback("Imported model successfully! The page will be reloaded.");
            location.reload();
          })
          .catch(function (err) {
            console.error(err);
            feedback("Error: " + err);
          });
      });

      $importMetamodel.click(function () {
        $importMetamodel.prop("disabled", true);
        $spinner.show();
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
          })
          .catch(function (e) {
            feedback("Error: " + e);
          });
      });

      var checkExistence = function () {
        if (!dataMap.get("model")) {
          $exportModel.prop("disabled", true);
          $deleteModel.prop("disabled", true);
          $spinner.hide();
        } else {
          $exportModel.prop("disabled", false);
          $deleteModel.prop("disabled", false);
        }

        if (!dataMap.get("metamodel")) {
          $spinner.hide();
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
          console.log("No guidance model found!");
          $exportGuidancemodel.prop("disabled", true);
          $deleteGuidancemodel.prop("disabled", true);
        } else {
          $exportGuidancemodel.prop("disabled", false);
          $deleteGuidancemodel.prop("disabled", false);
        }
      };

      checkExistence();
      setInterval(checkExistence, 10000);
    })
    .catch((err) => {
      console.error(err);
    });
});
