/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs([
    'jqueryui',
    'lib/yjs-sync',
    'activity_widget/ActivityList',
    'WaitForCanvas',
    'Util'],function ($, yjsSync, ActivityList, WaitForCanvas, Util) {
        yjsSync().done(function(y){
            window.y = y;

            console.info('ACTIVITY: Yjs successfully initialized.');
            var activtyList = new ActivityList($("#user_list"),$("#activity_list"));   
            
            y.share.join.observe(function(event){
                activtyList.addUser(event.name);
            });
           
            WaitForCanvas(CONFIG.WIDGET.NAME.ACTIVITY,7).done(function (data) {
                console.info('ACTIVITY: Got message from CANVAS');
                var user = data.local.user;
                if(!y.share.userList.get(user[CONFIG.NS.PERSON.JABBERID])){
                    user.globalId = Util.getGlobalId(data.local, y);   
                    y.share.userList.set(User.user[CONFIG.NS.PERSON.JABBERID], user);
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