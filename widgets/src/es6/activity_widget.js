/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
// import test from "./../es6-test/ActivityWidgetTest";
import { CONFIG, getWidgetTagName } from "./config";
import ActivityList from "./activity_widget/ActivityList";
import { yjsSync } from "./lib/yjs-sync";
import { WaitForCanvas } from "./WaitForCanvas";
import Util from "./Util";
import WidgetTracker from "./activity_widget/WidgetTracker";
$(function () {
  yjsSync()
    .then((y) => {
      window.y = y;

      console.info(
        "ACTIVITY: Yjs successfully initialized in room " +
          window.spaceTitle +
          " with y-user-id: " +
          y.clientID
      );
      var activtyList = new ActivityList($("#user_list"), $("#activity_list"));
      const joinMap = y.getMap("join");
      joinMap.observe(function (event) {
        // the username "invisible_user" is a special one, which can be used to join without
        // appearing in the activity list
        event.keysChanged.forEach((key) => {
          if (key != "invisible_user") {
            activtyList.addUser(key, event.currentTarget.get(key));
          }
        });
      });

      WaitForCanvas(CONFIG.WIDGET.NAME.ACTIVITY, y)
        .then(function (data) {
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
            activtyList.addUser(list[i]);
          }
          activtyList.init();
        })
        .catch(function (err) {
          console.error("ACTIVITY: Error while waiting for CANVAS: ", err);
        });

      // if (CONFIG.TEST.ACTIVITY) test;
    })
    .catch(function (err) {
      console.error("ACTIVITY: Error while initializing Yjs: " + err);
    });
});
