import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import init from "../../es6/shared";
import { SyncMetaWidget } from "../../widget";
import { CONFIG, getWidgetTagName } from "../../es6/config";
import "../../es6/activity_widget.js";
import "../../loading-spinner";
import "../../error-alert";

// widget body used by all syncmeta widgets
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.ACTIVITY))
export class ActivityWidget extends SyncMetaWidget(LitElement) {
  render() {
    return html`
      <style>
        ${getWidgetTagName(CONFIG.WIDGET.NAME.ACTIVITY)} {
          height: 100%;
          position: relative;
        }
        h2 {
          font-size: 0.8em;
          margin: 1px 1px 3px;
          color: #666666;
        }

        .list {
          width: 100%;
          height: auto;
          overflow: hidden;
        }
        .fs-sm {
          font-size: 50%;
        }
        .toast {
          display: block;
        }
        #user_list .item {
          background-color: rgb(138, 255, 200);
          display: block;
          border-radius: 3px;
          border: 2px solid #ccc;
          box-shadow: 2px 2px 2px #e3e3e3;
          position: relative;
          margin-top: 5px;
          margin-bottom: 5px;
        }

        #user_list .item h3 {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        #user_list .item span {
          font-size: 0.8em;
          text-align: end;
        }

        #activity_list {
          width: auto;
          box-sizing: border-box;
          padding-bottom: 150%;
          overflow-y: auto;
        }

        #activity_list .item {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 0.4em;
          margin: 0 0.5em 0.5em 0;
          background: #f3f3f3 linear-gradient(to bottom, #ffffff, #e3e3e3);
          box-shadow: 2px 2px 2px #e3e3e3;
        }
        #activity_list .item h3 {
          background: #d3d3d3
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.7),
              rgba(200, 200, 200, 0)
            );
          border: 1px solid #ccc;
          border-radius: 2px;
          margin: 0;
          padding: 0.2em;
          text-align: center;
          font-size: 1.1em;
          font-weight: bold;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        #activity_list .item p {
          margin: 0.4em 0.2em;
        }

        .timestamp {
          border-radius: 8px;
          border-style: solid;
          border-width: 0.5px;
          text-align: center;
        }
        /* custom scrollbar */
        ::-webkit-scrollbar {
          width: 20px;
        }

        ::-webkit-scrollbar-track {
          background-color: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background-color: #d6dee1;
          border-radius: 20px;
          border: 6px solid transparent;
          background-clip: content-box;
        }

        ::-webkit-scrollbar-thumb:hover {
          background-color: #a8bbbf;
        }
      </style>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://code.jquery.com/ui/1.13.1/themes/smoothness/jquery-ui.css"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossorigin="anonymous"
      />
      <div class="h-100" style="overflow-y:auto">
        <error-alert></error-alert>
        <h4>Users online</h4>
        <div class="list_wrapper">
          <div id="user_list" class="list"></div>
        </div>
        <h4>Activities</h4>
        <div class="list_wrapper">
          <div id="activity_list" class="list"></div>
        </div>
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
