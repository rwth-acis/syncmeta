import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import { html, LitElement, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators.js";
import "../../error-alert";
import ActivityList from "../../es6/activity_widget/ActivityList";
import WidgetTracker from "../../es6/activity_widget/WidgetTracker";
import { CONFIG, getWidgetTagName } from "../../es6/config";
import { yjsSync } from "../../es6/lib/yjs-sync";
import init from "../../es6/shared";
import Util from "../../es6/Util";
import { WaitForCanvas } from "../../es6/WaitForCanvas";
import "../../loading-spinner";
import { SyncMetaWidget } from "../../widget";

@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.ACTIVITY))
export class ActivityWidget extends SyncMetaWidget(
  LitElement,
  getWidgetTagName(CONFIG.WIDGET.NAME.ACTIVITY)
) {
  widgetName = getWidgetTagName(CONFIG.WIDGET.NAME.ACTIVITY);
  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    yjsSync()
      .then((y) => {
        window.y = y;

        console.info(
          "ACTIVITY: Yjs successfully initialized in room " +
            window.spaceTitle +
            " with y-user-id: " +
            y.clientID
        );

        WaitForCanvas(CONFIG.WIDGET.NAME.ACTIVITY, y)
          .then(function (data) {
            var activityList = new ActivityList(
              $("#user_list"),
              $("#activity_list")
            );
            const joinMap = y.getMap("join");
            joinMap.observe(function (event) {
              // the username "invisible_user" is a special one, which can be used to join without
              // appearing in the activity list
              event.keysChanged.forEach((key) => {
                if (key != "invisible_user") {
                  activityList.addUser(key, event.currentTarget.get(key));
                }
              });
            });
            console.info("ACTIVITY: Got message from CANVAS");
            var user = data.local.user;
            const userMap = y.getMap("users");
            const userList = y.getMap("userList");
            userMap.set(y.clientID, user[CONFIG.NS.PERSON.JABBERID]);
            const $node = $(getWidgetTagName(CONFIG.WIDGET.NAME.ACTIVITY));
            WidgetTracker.init(user[CONFIG.NS.PERSON.JABBERID], $node);
            if (!userList.get(user[CONFIG.NS.PERSON.JABBERID])) {
              user.globalId = Util.getGlobalId(data.local, y);
              userList.set(user[CONFIG.NS.PERSON.JABBERID], user);
            }

            var list = data.list;
            for (var i = 0; i < list.length; i++) {
              activityList.addUser(list[i]);
            }
            activityList.init();
            $(getWidgetTagName(CONFIG.WIDGET.NAME.ACTIVITY))
              .find("loading-spinner")
              .hide();
          })
          .catch(function (err) {
            console.error("ACTIVITY: Error while waiting for CANVAS: ", err);
          });

        // if (CONFIG.TEST.ACTIVITY) test;
      })
      .catch((err) => {
        console.error("ACTIVITY: Error while initializing Yjs: " + err);
        this.showErrorAlert("Cannot connect to Yjs server.");
      });
  }

  hideErrorAlert() {
    $(this.widgetName).find("#alert-message").text("");
    $(this.widgetName).find("error-alert").hide();
  }
  showErrorAlert(message: string) {
    $(this.widgetName).find("#alert-message").text(message);
    $(this.widgetName).find("error-alert").show();
  }

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
