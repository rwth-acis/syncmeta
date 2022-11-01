import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { IWC } from "../../widgets/src/es6/lib/iwc.js";

// // Syncmeta Widgets
import "../../widgets/build/widgets/partials/main.widget";
import "../../widgets/build/widgets/partials/attribute.widget";
import "../../widgets/build/widgets/partials/debug.widget";
import "../../widgets/build/widgets/partials/palette.widget";
import "../../widgets/build/widgets/partials/activity.widget";

@customElement("widget-container")
class WidgetContainer extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <div class="maincontainer">
        <div class="innercontainer">
          <main-widget></main-widget>
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
  static styles = css`
    :host {
      display: block;
    }
    .maincontainer {
      display: flex;
      height: 600px;
      flex-flow: row wrap;
    }
    .innercontainer {
      padding: 5px;
      margin: 5px;
      flex: 1;
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
  `;
}
