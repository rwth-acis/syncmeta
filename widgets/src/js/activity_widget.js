/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs(
  [
    "jqueryui",
    "lib/yjs-sync",
    "activity_widget/ActivityList",
    "WaitForCanvas",
    "Util",
    "activity_widget/WidgetTracker",
  ],
  function ($, yjsSync, ActivityList, WaitForCanvas, Util, WidgetTracker) {
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

      if (CONFIG.TEST.ACTIVITY) require(["./../test/ActivityWidgetTest"]);
    });
  }
);
