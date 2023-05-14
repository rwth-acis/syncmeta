import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "../../styles/activity.widget.css";
import { html, LitElement, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators.js";
import "../../error-alert";
import ActivityList from "../../es6/activity_widget/ActivityList";
import WidgetTracker from "../../es6/activity_widget/WidgetTracker";
import { CONFIG, getWidgetTagName } from "../../es6/config";
import { getInstance } from "../../es6/lib/yjs-sync";
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

    const yjsInstance = getInstance({
      host: "localhost",
      port: 1234,
      protocol: "ws",
      spaceTitle: window.spaceTitle,
    });

    yjsInstance
      .connect()
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
