import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import { OpenAppProvider } from "./lib/openapp";
const openapp = new OpenAppProvider().openapp;
var resourceSpace = new openapp.oo.Resource(openapp.param.space());

/**
 * Model
 * @name Model
 */
function SpaceInfo() {
  var deferred = $.Deferred();
  resourceSpace.getInfo(function (info) {
    deferred.resolve(info);
  });
  return deferred.promise();
}

export default SpaceInfo();
