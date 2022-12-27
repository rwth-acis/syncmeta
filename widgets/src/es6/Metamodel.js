import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import { CONFIG } from "./config";
import { OpenAppProvider } from "./lib/openapp";
const openapp = new OpenAppProvider().openapp;
var resourceSpace = new openapp.oo.Resource(openapp.param.space());

/**
 * Metamodel
 * @name Metamodel
 */
function Metamodel() {
  var deferred = $.Deferred();
  //noinspection JSUnusedGlobalSymbols
  resourceSpace.getSubResources({
    relation: openapp.ns.role + "data",
    type: CONFIG.NS.MY.METAMODEL,
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

export default Metamodel();
