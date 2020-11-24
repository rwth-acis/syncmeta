/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs([
    'jqueryui',
    'lib/yjs-sync',
    'activity_widget/ActivityList',
    'WaitForCanvas',
    'Util',
    'activity_widget/WidgetTracker'],function ($, yjsSync, ActivityList, WaitForCanvas, Util, WidgetTracker) {
        yjsSync().done(function(y, spaceTitle){
            window.y = y;

            console.info('ACTIVITY: Yjs successfully initialized in room ' + spaceTitle + ' with y-user-id: ' + y.db.userId);
            var activtyList = new ActivityList($("#user_list"),$("#activity_list"));   
            
            y.share.join.observe(function(event){
                // the username "invisible_user" is a special one, which can be used to join without 
                // appearing in the activity list
                if(event.name != "invisible_user") {
                    activtyList.addUser(event.name);
                }
            });
           
            WaitForCanvas(CONFIG.WIDGET.NAME.ACTIVITY,7).done(function (data) {
                console.info('ACTIVITY: Got message from CANVAS');
                var user = data.local.user;
                y.share.users.set(y.db.userId, user[CONFIG.NS.PERSON.JABBERID]);
                WidgetTracker.init(user[CONFIG.NS.PERSON.JABBERID]);
                if(!y.share.userList.get(user[CONFIG.NS.PERSON.JABBERID])){
                    user.globalId = Util.getGlobalId(data.local, y);   
                    y.share.userList.set(user[CONFIG.NS.PERSON.JABBERID], user);
                }

                var userList = data.list;
                for (var i = 0; i < userList.length; i++) {
                    activtyList.addUser(userList[i]);
                }
                activtyList.init();
            });

        if(CONFIG.TEST.ACTIVITY)
            require(['./../test/ActivityWidgetTest']);
    });
});