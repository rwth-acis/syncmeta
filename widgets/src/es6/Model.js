import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "jquery-ui";
import { CONFIG } from "./config";
import { OpenAppProvider } from "./lib/openapp";
const openapp = new OpenAppProvider().openapp;
var resourceSpace = new openapp.oo.Resource(openapp.param.space());

/**
 * Model
 * @name Model
 */
function Model() {
  var deferred = $.Deferred();
  resourceSpace.getSubResources({
    relation: openapp.ns.role + "data",
    type: CONFIG.NS.MY.MODEL,
    onAll: function (data) {
      if (data === null || data.length === 0) {
        deferred.resolve([]);
      } else {
        data[0].getRepresentation("rdfjson", function (representation) {
          if (!representation) {
            deferred.resolve([]);
          } else {
            deferred.resolve(representation);
          }
        });
      }
    },
  });
  return deferred.promise();
}

export default Model();
