import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";

import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";

import { css, CSSResultGroup, html, LitElement, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators.js";
import _ from "lodash-es";
import GenerateViewpointModel from "../../es6/canvas_widget/GenerateViewpointModel";
import { CONFIG, getWidgetTagName } from "../../es6/config";
import IWC from "../../es6/lib/IWCWrapper";
import { yjsSync } from "../../es6/lib/yjs-sync";
import UpdateViewListOperation from "../../es6/operations/non_ot/UpdateViewListOperation";
import init from "../../es6/shared";
import { SyncMetaWidget } from "../../widget";
// widget body used by all syncmeta widgets
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.VIEWCONTROL))
export class ViewControlWidget extends SyncMetaWidget(
  LitElement,
  getWidgetTagName(CONFIG.WIDGET.NAME.VIEWCONTROL)
) {
  protected async firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ) {
    super.firstUpdated(_changedProperties);
    try {
      const y = await yjsSync();
      console.info(
        "VIEWCONTROL: Yjs successfully initialized in room " +
          window.spaceTitle +
          " with y-user-id: " +
          y.clientID
      );
      const dataMap = y.getMap("data");
      var metamodel = dataMap.get("metamodel");
      var iwc = IWC.getInstance("VIEWCONTROL");

      var GetList = function (appendTo, tpl) {
        const viewsMap = y.getMap("views");
        var list = viewsMap.keys();
        for (var i = 0; i < list.length; i++) {
          var data = viewsMap.get(list[i]);
          if (data) {
            var $viewEntry = $(tpl({ name: data.id }));
            $viewEntry.find(".json").click(function (event) {
              var $this = $(this).addClass("loading_button");
              var viewId = $(event.target)
                .parents("tr")
                .find(".lblviewname")
                .text();

              var data = viewsMap.get(viewId);
              var link = document.createElement("a");
              link.download = data.id + ".json";
              link.href = "data:," + encodeURI(JSON.stringify(data, null, 4));
              link.click();
              $this.removeClass("loading_button");
            });
            $viewEntry.find(".del").click(function (event) {
              var viewId = $(event.target)
                .parents("tr")
                .find(".lblviewname")
                .text();
              viewsMap.set(viewId, null);
              $("#btnRefresh").click();
            });
            $viewEntry.find(".ToSpace").click(function (event) {
              var viewId = $(event.target)
                .parents("tr")
                .find(".lblviewname")
                .text();
              var viewpointmodel = GenerateViewpointModel(viewsMap.get(viewId));
              addMetamodelToYjs($("#space_label_view").val(), viewpointmodel);
            });
            $(appendTo).append($viewEntry);
          }
        }
      };

      var GetViewpointListEntryTemplate = function () {
        var templateString =
          '<tr><td class="lblviewname"><<= name >></td><td><button class="json">JSON</button></td><td><button class="del">Del</button></td></tr>'
            .replace(/<</g, "<" + "%")
            .replace(/>>/g, "%" + ">");
        return _.template(templateString);
      };
      var getFileContent = function () {
        var fileReader,
          files = ($("#btnImport")[0] as HTMLInputElement).files,
          file,
          deferred = $.Deferred();

        if (!files || files.length === 0) deferred.resolve([]);
        file = files[0];

        fileReader = new FileReader();
        fileReader.onload = function (e) {
          var data = e.target.result;
          try {
            data = JSON.parse(data);
          } catch (e) {
            data = [];
          }
          deferred.resolve(data);
        };
        fileReader.readAsText(file);
        return deferred.promise();
      };

      var LoadFileAndStoreToSpace = function () {
        const viewsMap = y.getMap("views");
        getFileContent().then(function (data) {
          if (data.id) {
            if (metamodel) {
              try {
                var vvs = GenerateViewpointModel(data);
                viewsMap.set(vvs.id, vvs);
              } catch (e) {
                console.error(e);
                viewsMap.set(data.id, data);
              }
            } else viewsMap.set(data.id, data);

            $("#btnRefresh").click();
          }
        });
      };

      //In metamodeling layer
      if (!metamodel) {
        $("#div1").show();
      }

      $("#btnLoadViewpoint").click(function () {
        LoadFileAndStoreToSpace();
      });
      GetList("#viewpointlist", GetViewpointListEntryTemplate());

      $("#btnRefresh").click(function () {
        $("#viewpointlist").empty();
        GetList("#viewpointlist", GetViewpointListEntryTemplate());
        var operation = new UpdateViewListOperation();
        iwc.sendLocalNonOTOperation(
          CONFIG.WIDGET.NAME.MAIN,
          operation.toNonOTOperation()
        );
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        type="text/css"
        href="https://code.jquery.com/ui/1.13.1/themes/smoothness/jquery-ui.css"
      />

      <div id="viewcontrol">
        <div class="seperating_box" style="display:none" id="div1">
          <h5>Add a Viewpoint to a Model Editor instance</h5>
          <strong>Editor space url:</strong>
          <br />
          <span id="space_link_input_view"
            ><%= grunt.config('roleSandboxUrl') %>/<input
              size="16"
              type="text"
              id="space_label_view"
          /></span>
          <br />
        </div>
        <div class="seperating_box">
          <h5>Select a JSON file</h5>
          <input type="file" id="btnImport" />
        </div>
        <div class="seperating_box">
          <h5>Control Elements</h5>
          <button id="btnRefresh">Refresh Lists</button>
          <button id="btnLoadViewpoint">Load a Viewpoint</button>
        </div>
        <div class="seperating_box">
          <strong>Viewpoint List</strong>
          <table id="viewpointlist"></table>
        </div>
      </div>
    `;
  }

  static styles?: CSSResultGroup = css`
    td {
      padding: 5;
    }
    .seperating_box {
      border: 1px solid;
      border-radius: 7px;
      margin: 18px 20px 7px 7px;
      padding: 7px 20px 7px 7px;
      position: relative;
    }
    .seperating_box > h5 {
      font-weight: normal;
      font-style: italic;
      position: absolute;
      top: -40px;
      left: 4px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}

function addMetamodelToYjs(roomName, metamodel) {
  yjsSync(roomName).then(function (yInstance) {
    yInstance.getMap("data").set("metamodel", metamodel);
  });
}
