import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import init from "../../es6/shared";
import { SyncMetaWidget } from "../../widget";

import "../../es6/activity_widget.js";

// widget body used by all syncmeta widgets
@customElement("activity-widget")
export class ActivityWidget extends SyncMetaWidget(LitElement) {
  render() {
    return html`
      <!-- had to use inline script to get this to work. static styles was not
      working after bundling -->
      <style>
        h2 {
          font-size: 0.8em;
          margin: 1px 1px 3px;
          color: #666666;
        }

        .list {
          width: 100%;
          height: auto;
          font-size: 60%;
          overflow: hidden;
        }

        #user_list .item {
          background-color: rgb(138, 255, 200);
          display: block;
          border-radius: 2px;
          border: 1px solid #ccc;
          margin: 0 0.5em 0.5em 0;
          font-size: 100%;
          box-shadow: 2px 2px 2px #e3e3e3;
          position: relative;
        }

        #user_list .item h3 {
          margin: 1px 25px 1px 1px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        #user_list .item span {
          position: absolute;
          right: 0;
          top: 0;
          display: block;
          width: 25px;
          font-weight: bold;
          font-size: 1.2em;
          text-align: right;
        }

        #activity_list {
          height: 90%;
          box-sizing: border-box;
          padding-bottom: 150%;
          margin-right: -20px;
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
      </style>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://code.jquery.com/ui/1.13.1/themes/smoothness/jquery-ui.css"
      />
      <h2>Users online</h2>
      <div class="list_wrapper">
        <div id="user_list" class="list"></div>
      </div>
      <h2>Activities</h2>
      <div class="list_wrapper">
        <div id="activity_list" class="list"></div>
      </div>
      <div id="q"></div>
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
