import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

// Syncmeta Widgets
import "./partials/main.widget";
import "./partials/attribute.widget";
import "./partials/debug.widget";
import "./partials/palette.widget";
import "./partials/activity.widget";

@customElement("widget-container")
export class WidgetContainer extends LitElement {
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
        <div class="col-9 innercontainer">
          <div class="row h-100">
            <div class="col-9 px-1 border-end h-100">
              <canvas-widget></canvas-widget>
            </div>
            <div class="col-3  h-100">
              <palette-widget> </palette-widget>
            </div>
          </div>
        </div>
        <div class="col-4 innercontainer ">
          <property-browser-widget></property-browser-widget>
        </div>
        <div class="col-2 innercontainer" style="display:none">
          <user-activity-widget></user-activity-widget>
        </div>

        <div
          class="modal fade"
          id="exportModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          style="z-index: 2147483647 !important;"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <debug-widget></debug-widget>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  connectedCallback(): void {
    super.connectedCallback();

    setTimeout(() => {
      const btnTemplate = `<button
                type="button"
                class="btn btn-secondary "
                data-bs-toggle="modal"
                data-bs-target="#exportModal"
                id="exportModel"
              >
                <i class="bi bi-cloud-fill me-1"></i>Import/Export
              </button>`;
      const rowContainer = document.querySelector(
        "#main-widget-utilities-container"
      );
      if (!rowContainer?.firstElementChild) {
        console.error(
          `Could not find the first col of row container. ${document.querySelector(
            "#main-widget-utilities-container"
          )} 
          This means that the debug widget button will not be added. 
          Make sure that the following selector is correct: #main-widget-utilities-container. The first child will be used to append the button.`
        );
        return;
      }
      rowContainer.firstElementChild?.appendChild(
        new DOMParser().parseFromString(btnTemplate, "text/html").body
          .firstChild as Node
      );
    }, 100);
  }
}
