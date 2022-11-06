/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

import "jquery";
import "jquery-ui";
// import test from "./../es6-test/ActivityWidgetTest";
import { CONFIG } from "./config";
Promise.all([
  import("./lib/yjs-sync"),
  import("./activity_widget/ActivityList"),
  import("./WaitForCanvas"),
  import("./Util"),
  import("./activity_widget/WidgetTracker"),
]).then(function (yjsSync, ActivityList, WaitForCanvas, Util, WidgetTracker) {
  yjsSync().done(function (y, spaceTitle) {
    window.y = y;

    console.info(
      "ACTIVITY: Yjs successfully initialized in room " +
        spaceTitle +
        " with y-user-id: " +
        y.clientID
    );
    var activtyList = new ActivityList($("#user_list"), $("#activity_list"));
    const joinMap = y.getMap("join");
    joinMap.observe(function (event) {
      // the username "invisible_user" is a special one, which can be used to join without
      // appearing in the activity list
      if (event.name != "invisible_user") {
        activtyList.addUser(event.name);
      }
    });

    WaitForCanvas(CONFIG.WIDGET.NAME.ACTIVITY, 7).done(function (data) {
      console.info("ACTIVITY: Got message from CANVAS");
      var user = data.local.user;
      const userMap = y.getMap("users");
      const userList = y.getMap("userList");
      userMap.set(y.clientID, user[CONFIG.NS.PERSON.JABBERID]);
      WidgetTracker.init(user[CONFIG.NS.PERSON.JABBERID]);
      if (!userList.get(user[CONFIG.NS.PERSON.JABBERID])) {
        user.globalId = Util.getGlobalId(data.local, y);
        userList.set(user[CONFIG.NS.PERSON.JABBERID], user);
      }

      var list = data.list;
      for (var i = 0; i < list.length; i++) {
        activtyList.addUser(list[i]);
      }
      activtyList.init();
    });

    // if (CONFIG.TEST.ACTIVITY) test;
  });
});
