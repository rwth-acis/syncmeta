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
    'promise!User'
],function ($, yjsSync, ActivityList, WaitForCanvas, Util, User) {
        yjsSync().done(function(y){
            window.y = y;

            console.info('ACTIVITY: Yjs uccessfully initialized.');
            var activtyList = new ActivityList($("#user_list"),$("#activity_list"));   
            
            if(User){
                if(!y.share.userList.get(User.user[CONFIG.NS.PERSON.JABBERID])){
                    User.user.globalId = Util.getGlobalId(User, y);   
                    y.share.userList.set(User.user[CONFIG.NS.PERSON.JABBERID], User.user);
                }
            }
            else console.error('Openapp User promise empty! No user information for the activity widget. Pls refresh the activity widget.');

            y.share.join.observe(function(event){
                activtyList.addUser(event.name);
            });
           
            WaitForCanvas(CONFIG.WIDGET.NAME.ACTIVITY,7).done(function (userList) {
                console.info('ACTIVITY: Got message from CANVAS');
                for (var i = 0; i < userList.length; i++) {
                    activtyList.addUser(userList[i]);
                }
                activtyList.init();
            });

        if(CONFIG.TEST.ACTIVITY)
            require(['./../test/ActivityWidgetTest']);
    });
});