import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";

$.fn.autoGrowInput = function (o) {
  o = $.extend(
    {
      maxWidth: 1000,
      minWidth: 0,
      comfortZone: 70,
    },
    o
  );

  this.filter("input:text").each(function () {
    var minWidth = o.minWidth || $(this).width(),
      val = "",
      input = $(this),
      testSubject = $("<tester/>").css({
        position: "absolute",
        top: -9999,
        left: -9999,
        width: "auto",
        fontSize: input.css("fontSize"),
        fontFamily: input.css("fontFamily"),
        fontWeight: input.css("fontWeight"),
        letterSpacing: input.css("letterSpacing"),
        whiteSpace: "nowrap",
      }),
      check = function () {
        val = input.val();

        // Enter new content into testSubject
        var escaped = val
          .replace(/&/g, "&amp;")
          .replace(/\s/g, "&nbsp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        testSubject.html(escaped);

        // Calculate new width + whether to change
        var testerWidth = testSubject.width(),
          newWidth =
            testerWidth + o.comfortZone >= minWidth
              ? testerWidth + o.comfortZone
              : minWidth,
          currentWidth = input.width(),
          isValidWidthChange =
            (newWidth < currentWidth && newWidth >= minWidth) ||
            (newWidth > minWidth && newWidth < o.maxWidth);

        // Animate width
        if (isValidWidthChange) {
          input.width(newWidth);
        }
      };

    $("body").append(testSubject);

    $(this).bind("keyup keydown blur update", check);
  });

  return this;
};
