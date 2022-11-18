import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

// // Syncmeta Widgets
import "../../widgets/build/widgets/partials/main.widget";
import "../../widgets/build/widgets/partials/attribute.widget";
import "../../widgets/build/widgets/partials/debug.widget";
import "../../widgets/build/widgets/partials/palette.widget";
import "../../widgets/build/widgets/partials/activity.widget";

@customElement("widget-container")
class WidgetContainer extends LitElement {
  createRenderRoot() {
    return this;
  }
  constructor() {
    super();
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
        }
        .maincontainer {
          display: flex;

          height: 600px;
          flex-flow: row wrap;
        }
        .innercontainer {
          border-radius: 5px;
          padding: 5px;
          margin: 4px;
          flex: 1;

          resize: horizontal;
          -webkit-box-shadow: 0px 0px 30px 3px rgba(158, 158, 158, 0.89);
          box-shadow: 0px 0px 30px 3px rgba(158, 158, 158, 0.59);
        }
        .innercontainer:nth-of-type(1) {
          flex: 4;
          display: flex;
          flex-flow: column;
        }
        .innercontainer:nth-of-type(2) {
          display: flex;
          flex-flow: column;
        }
        .middle-container {
          flex: 2;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
        }
      </style>
      <div class="maincontainer">
        <div class="innercontainer">
          <canvas-widget style="height:100%"></canvas-widget>
        </div>
        <div class="middle-container">
          <div class="innercontainer">
            <attribute-widget></attribute-widget>
          </div>
          <div class="innercontainer">
            <debug-widget></debug-widget>
          </div>
        </div>
        <div class="innercontainer">
          <palette-widget> </palette-widget>
        </div>
        <div class="innercontainer">
          <user-activity-widget></user-activity-widget>
        </div>
      </div>
    `;
  }
}
