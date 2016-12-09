/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs([
    'jqueryui',
    'lib/yjs-sync',
    'activity_widget/ActivityList',
    'WaitForCanvas'
],function ($, yjsSync, ActivityList, WaitForCanvas) {

        yjsSync().done(function(y){
            window.y = y;

            console.info('ACTIVITY: Yjs uccessfully initialized.');
            var activtyList = new ActivityList($("#user_list"),$("#activity_list"));
            activtyList.init();

            y.share.join.observe(function(event){
                activtyList.addUser(event.name);
            });
           
            WaitForCanvas(CONFIG.WIDGET.NAME.ACTIVITY).done(function (userList) {
               for(var i=0;i<userList.length;i++){
                    activtyList.addUser(userList[i]);
                }
            });


        if(CONFIG.TEST.ACTIVITY)
            require(['./../test/ActivityWidgetTest']);
    });
});