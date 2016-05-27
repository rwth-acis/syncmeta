/**
 * Namespace for activity widget.
 * @namespace activity_widget
 */

requirejs([
    'jqueryui',
    'lib/yjs-sync',
    'activity_widget/ActivityList'
],function ($, yjsSync, ActivityList) {

    yjsSync().done(function(y){
        window.y = y;
        console.info('ACTIVITY: Yjs uccessfully initialized.');
        new ActivityList($("#user_list"),$("#activity_list"));
    });

    if(CONFIG.TEST_MODE)
        require(['./../test/ActivityWidgetTest']);

    /*
    $("#q").draggable({
        axis: "y",
        start: function(){
            var $c = $("body");
            $c.css('bottom', 'inherit');
            $(this).css('height',50);
        },
        drag: function( event, ui ) {
            var height = ui.position.top;
            $("body").css('height', height);
            gadgets.window.adjustHeight();
        },
        stop: function(){
            $(this).css('height',3);
            gadgets.window.adjustHeight();
            $(this).css('top','');
        }
    });*/

});