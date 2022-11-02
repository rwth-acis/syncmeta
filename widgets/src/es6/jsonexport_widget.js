import $ from "jquery-ui";
import MFExport from "mfexport";
import ILDE from "ildeApi";
import _ from "lodash";
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
