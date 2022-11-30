import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import MFExport from "./lib/mfexport";
$("#json").click(function () {
  var $this = $(this).addClass("loading_button");
  MFExport.getJSON(function (data, title) {
    var link = document.createElement("a");
    link.download = title + ".json";
    link.href = "data:," + encodeURI(JSON.stringify(data, null, 4));
    link.click();
    $this.removeClass("loading_button");
  });
});
$("#png").click(function () {
  var $this = $(this).addClass("loading_button");
  MFExport.getImageURL(function (url, title) {
    var link = document.createElement("a");
    link.download = title + ".png";
    link.href = url;
    link.click();
    $this.removeClass("loading_button");
  });
});
