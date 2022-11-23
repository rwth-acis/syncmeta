import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";

import "../../es6/debug_widget.js";
import { CONFIG, getWidgetTagName } from "../../es6/config";
// widget body used by all syncmeta widgets
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.DEBUG))
export class DebugWidget extends SyncMetaWidget(LitElement) {
  render() {
    return html`
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
        crossorigin="anonymous"
      />

      <div class="seperating_box">
        <h6>Select a JSON file</h6>
        <input
          type="file"
          id="file-object"
          accept=".json"
          value="Load a file"
        />
      </div>

      <hr />
      <div id="modelDiv" class="seperating_box">
        <h6>
          Import/Export/Delete a <strong>(Meta- or Guidance-)Model</strong>
        </h6>
        <button
          id="import-model"
          class="btn btn-secondary"
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
        <h6>
          Import/Export/Delete a <strong>Metamodel</strong> (Model Editor only)
        </h6>
        <button
          class="btn btn-secondary"
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
          Import/Export/Delete a <strong>Logical Guidancemodel</strong> (Model
          Editor only)
        </h6>
        <button id="import-guidance-model" class="btn btn-secondary">
          Import
        </button>
        <button id="export-guidance-model" class="btn btn-secondary">
          Export
        </button>
        <button id="delete-guidance-model" class="btn btn-danger">
          Delete
        </button>
      </div>
      <hr />
      <div id="activityDiv" class="seperating_box">
        <h6>Export/Delete a <strong>Activity list</strong></h6>
        <button id="export-activity-list" class="btn btn-secondary">
          Export
        </button>
        <button id="delete-activity-list" class="btn btn-danger">Delete</button>
      </div>
      <br />
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
