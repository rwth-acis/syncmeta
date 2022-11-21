import "jquery";
function WidgetTracker() {
  var start;
  return {
    init: function (
      userId,
      $parent_node = $(frameElement.offsetParent).parent()
    ) {
      $parent_node.find(".widget-wrapper").each(function () {
        $(this).hover(
          function (event) {
            //start = event.timeStamp;
            start = $.now();
          },
          function (event) {
            var $widget,
              now = $.now();
            //now = event.timeStamp;
            if ($(event.target).is(".widget-wrapper"))
              $widget = $(event.target);
            else $widget = $(event.target).parents(".widget-wrapper");
            if (now - start >= 1500) {
              const activityMap = y.getMap("activity");
              activityMap.set("ActivityOperation", {
                sender: userId,
                type: "WidgetTrackingActivity",
                entityId: $widget.find(".widget-title-bar span").text(),
                text: "",
                data: {
                  start: start,
                  end: now,
                },
              });
            }
          }
        );
      });
    },
  };
}
export default new WidgetTracker();
