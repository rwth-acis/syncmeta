/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

import "jquery";
import "jquery-ui";
// import test from "./../es6-test/ActivityWidgetTest";
import { CONFIG } from "./config";
import ActivityList from "./activity_widget/ActivityList";
import yjsSync from "./lib/yjs-sync";
import WaitForCanvas from "./WaitForCanvas";
import Util from "./Util";
import WidgetTracker from "./activity_widget/WidgetTracker";

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
    const key = [...event.keysChanged][0];
    const value = event.currentTarget.get(key);
    if (key != "invisible_user") {
      activtyList.addUser(value);
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
    
