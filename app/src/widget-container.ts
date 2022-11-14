import { LitElement, html, css } from "lit";
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
          flex: 2;
          display: flex;
          flex-flow: column;
        }
      </style>
      <div class="maincontainer">
        <div class="innercontainer">
          <main-widget style="height:100%"></main-widget>
        </div>
        <div class="innercontainer">
          <attribute-widget></attribute-widget>
          <debug-widget></debug-widget>
        </div>
        <div class="innercontainer">
          <palette-widget> </palette-widget>
        </div>
        <div class="innercontainer">
          <activity-widget></activity-widget>
        </div>
      </div>
    `;
  }
  static styles = css``;
}
