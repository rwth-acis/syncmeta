define(['jquery'], function ($) {
    function WidgetTracker() {
        var start;
        return {
            init : function(userId){
                $(frameElement.offsetParent).parent().find('.widget-wrapper').each(function () {
                    $(this).hover(function (event) {
                        //start = event.timeStamp;
                        start = $.now();
                    }, function (event) {
                        var $widget,
                            now = $.now(); 
                            //now = event.timeStamp;
                        if ($(event.target).is('.widget-wrapper'))
                            $widget = $(event.target);
                        else
                            $widget = $(event.target).parents('.widget-wrapper'); 
                        if(now - start >= 1500){
                            y.share.activity.set('ActivityOperation', {
                                sender: userId,
                                type : 'WidgetTrackingActivity',
                                entityId : $widget.find('.widget-title-bar span').text(),
                                text : '',
                                data : {
                                    start : start,
                                    end : now
                                }
                            });
                        }
                    });
                });
            }
        };
    }
    return new WidgetTracker();
});