import "jquery-ui";
import _ from "lodash-es";
import EntityManager from "../EntityManager";
const optionHtml = await loadHTML(
  "../../../html/templates/canvas_widget/select_option.html",
  import.meta.url
);

/**
 * the view manager manges a arbitrary number of views
 * @returns {{GetViewpointList: Function, existsView: Function, getViewIdOfSelected: Function, getViewUri: Function, getViewpointUri: Function, getSelected$node: Function, getResource: Function, addView: Function, deleteView: Function, initViewList: Function}}
 * @constructor
 */
function ViewManager() {
  /**
   * represent a reference to the view selection html element
   * @type {jQuery}
   * @private
   */
  var _$selection = $("#ddmViewSelection");

  /**
   * html option element template
   * @type {function}
   */
  var optionTpl = _.template(optionHtml);

  return {
    /**
     * initialize the viewpoint selection list of the generic editor instance
     */
    GetViewpointList: function () {
      const viewsMap = y.getMap("views");
      _$selection.empty();
      var viewpointList = viewsMap.keys();
      for (var i = 0; i < viewpointList.length; i++) {
        var viewpoint = viewsMap.get(viewpointList[i]);
        if (viewpoint) {
          _$selection.append(
            $(
              optionTpl({
                id: viewpointList[i],
              })
            )
          );
        } else viewsMap.delete(viewpointList[i]);
      }
    },
    /**
     * checks if a view exists
     * @param viewId the viewId of the vie
     * @returns {boolean} true if the view already exits false if not
     */
    existsView: function (viewId) {
      const viewsMap = y.getMap("views");
      return viewsMap.keys().indexOf(viewId) != -1;
    },
    /**
     * returns the view identifier of  currently selected html selection element
     * @returns {string} the identifier of the view
     */
    getViewIdOfSelected: function () {
      return this.getSelected$node().attr("id");
    },
    /**
     * returns the currently selected option node of the html selection element
     * @returns {object} jquery object
     */
    getSelected$node: function () {
      return _$selection.find("option:selected");
    },
    /**
     * adds a view to the ViewManager
     * @param {string} viewId the view identifier
     */
    addView: function (viewId) {
      const viewsMap = y.getMap("views");
      if (viewsMap.keys().indexOf(viewId) == -1) {
        viewsMap.set(viewId, {
          viewId: viewId,
          attributes: {},
          nodes: {},
          edges: {},
        });
        return true;
      } else return false;
    },
    /**
     * deletes a view from the view manager
     * @param {string} viewId the identifier of the view
     */
    deleteView: function (viewId) {
      const viewsMap = y.getMap("views");
      viewsMap.delete(viewId);
      _$selection.find("#" + viewId).remove();
    },
    /**
     * Update a view representation in the ROLE Space
     * @param {string} viewId The view identifier
     * @param {string} viewId The Identifier of the view
     * @param {object} resource openapp.oo.resource of the the view
     * @returns {object} jquery promise
     */
    updateViewContent: function (viewId) {
      const viewsMap = y.getMap("views");
      var data = this.viewToJSON(viewId);
      viewsMap.set(viewId, data);
    },
    /**
     * generates the json representation of a view
     * @param viewId the unique name of the view
     * @returns {Object}
     */
    viewToJSON: function (viewId) {
      var vls = EntityManager.graphToJSON();
      vls["id"] = viewId;
      return vls;
    },
  };
}
export default new ViewManager();
