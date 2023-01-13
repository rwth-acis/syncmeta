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
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossorigin="anonymous"
      />
      <style>
        :host {
          display: block;
        }

        .innercontainer {
          border-radius: 5px;
          flex: 1;
          height: 100%;
          resize: horizontal;
          -webkit-box-shadow: 0px 0px 30px 3px rgba(158, 158, 158, 0.89);
          box-shadow: 0px 0px 30px 3px rgba(158, 158, 158, 0.59);
        }
        .innercontainer:nth-of-type(1) {
          flex: 4;
          display: flex;
          flex-flow: column;
        }
        .innercontainer:nth-of-type(3) {
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
      <div class="container-fluid row w-100 px-0 mx-0" style="height:98vh">
        <div class="col-7 innercontainer">
          <div class="row h-100">
            <div class="col-9 px-1 border-end h-100">
              <canvas-widget></canvas-widget>
            </div>
            <div class="col-3  h-100">
              <palette-widget> </palette-widget>
            </div>
          </div>
        </div>
        <div class="col-3 middle-container ">
          <div class="innercontainer" style="max-height=48vh; overflow=auto">
            <property-browser-widget></property-browser-widget>
          </div>
          <div class="innercontainer" style="max-height=48vh; overflow=auto">
            <debug-widget></debug-widget>
          </div>
        </div>
        <div class="col-2 innercontainer" style="display:none">
          <user-activity-widget></user-activity-widget>
        </div>
      </div>
    `;
  }
}
