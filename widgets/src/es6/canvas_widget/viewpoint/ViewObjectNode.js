import "jquery";
import "jquery-ui";
import _ from "lodash-es";
import SingleSelectionAttribute from "../SingleSelectionAttribute";
import RenamingListAttribute from "../viewpoint/RenamingListAttribute";
import ConditionListAttribute from "../viewpoint/ConditionListAttribute";
import ViewTypesUtil from "../viewpoint/ViewTypesUtil";
import LogicalOperator from "../viewpoint/LogicalOperator";
import LogicalConjunctions from "../viewpoint/LogicalConjunctions";
import $__canvas_widget_NodeShapeNode from "../NodeShapeNode";
import $__canvas_widget_BiDirAssociationEdge from "../BiDirAssociationEdge";
import $__canvas_widget_UniDirAssociationEdge from "../UniDirAssociationEdge";
import loadHTML from "../../html.template.loader";
import { AbstractNode } from "../Manager";

const viewobjectNodeHtml = await loadHTML(
  "../../../templates/canvas_widget/viewobject_node.html",
  import.meta.url
);

/**
 * ViewObjectNode
 * @class canvas_widget.ViewObjectNode
 * @extends canvas_widget.AbstractNode
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of node
 * @param {number} left x-coordinate of node position
 * @param {number} top y-coordinate of node position
 * @param {number} width Width of node
 * @param {number} height Height of node
 * @param {number} zIndex Position of node on z-axis
 * @param {object} jsonFromResource the ViewObjectNode is created from a json
 */
class ViewObjectNode extends AbstractNode {
  static TYPE = "ViewObject";
static DEFAULT_WIDTH = 150;
static DEFAULT_HEIGHT = 100;
  constructor(id, left, top, width, height, zIndex, json) {
    var that = this;

    super(
      id,
      "ViewObject",
      left,
      top,
      width,
      height,
      zIndex,
      json
    );

    /**
     * jQuery object of node template
     * @type {jQuery}
     * @private
     */
    var _$template = $(
      _.template(viewobjectNodeHtml)({ type: that.getType() })
    );

    /**
     * jQuery object of DOM node representing the node
     * @type {jQuery}
     * @private
     */
    var _$node = AbstractNode.prototype.get$node
      .call(this)
      .append(_$template)
      .addClass("viewobject");

    /**
     * jQuery object of DOM node representing the attributes
     * @type {jQuery}
     * @private
     */
    var _$attributeNode = _$node.find(".attributes");

    /**
     * Attributes of node
     * @type {Object}
     * @private
     */
    var _attributes = this.getAttributes();

    /**
     * Get JSON representation of the node
     * @returns {Object}
     */
    this.toJSON = function () {
      return AbstractNode.prototype.toJSON.call(this);
    };

    this.createConditionListAttribute = function (refAttrs) {
      var targetAttrList = {};
      if (refAttrs && refAttrs.constructor.name === "RenamingListAttribute") {
        var attrs = refAttrs.getAttributes();
        for (var key in attrs) {
          if (attrs.hasOwnProperty(key)) {
            targetAttrList[key] = attrs[key].getKey().getValue();
          }
        }
      } else {
        for (var key in refAttrs) {
          if (refAttrs.hasOwnProperty(key)) {
            targetAttrList[key] = refAttrs[key].val.value;
          }
        }
      }
      var conditionListAttr = new ConditionListAttribute(
        "[condition]",
        "Conditions",
        that,
        targetAttrList,
        LogicalOperator
      );
      that.addAttribute(conditionListAttr);
      _$attributeNode.append(conditionListAttr.get$node());
      conditionListAttr.get$node().hide();
      return conditionListAttr;
    };

    this.registerYMap = function () {
      AbstractNode.prototype.registerYMap.call(this);
      that.getLabel().getValue().registerYType();
      renamingList.registerYMap();
      if (cla) cla.registerYMap();
      targetAttribute.getValue().registerYType();
      conjSelection.getValue().registerYType();
    };

    this.showAttributes = function () {
      if (renamingList.get$node().is(":hidden")) renamingList.get$node().show();
      if (conjSelection.get$node().is(":hidden"))
        conjSelection.get$node().show();
      if (cla.get$node().is(":hidden")) cla.get$node().show();
      if (!targetAttribute.get$node().is(":hidden"))
        targetAttribute.get$node().hide();
    };

    var targetAttribute, renamingList, conjSelection, cla;
    _$node.find(".label").append(this.getLabel().get$node());
    if (window.hasOwnProperty("y")) {
      const dataMap = y.getMap("data");
      var model = dataMap.get("model");
      if (model) {
        var selectionValues =
          ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2(model.nodes, [
            "Object",
          ]);
        targetAttribute = new SingleSelectionAttribute(
          id + "[target]",
          "Target",
          that,
          selectionValues
        );
        that.addAttribute(targetAttribute);
        _$attributeNode.prepend(targetAttribute.get$node());
      }
      if (json)
        cla = that.createConditionListAttribute(
          json.attributes["[attributes]"].list
        );
      else cla = that.createConditionListAttribute();
    }

    renamingList = new RenamingListAttribute(
      "[attributes]",
      "Attributes",
      that,
      {
        show: "Visible",
        hide: "Hidden",
      }
    );
    that.addAttribute(renamingList);
    _$attributeNode.append(renamingList.get$node());
    renamingList.get$node().hide();

    conjSelection = new SingleSelectionAttribute(
      id + "[conjunction]",
      "Conjunction",
      that,
      LogicalConjunctions
    );
    that.addAttribute(conjSelection);
    _$attributeNode.append(conjSelection.get$node());
    conjSelection.get$node().hide();

    if (json && conjSelection && cla && renamingList && targetAttribute)
      that.showAttributes();

    this.setContextMenuItemCallback(function () {
      var NodeShapeNode = $__canvas_widget_NodeShapeNode,
        BiDirAssociationEdge = $__canvas_widget_BiDirAssociationEdge,
        UniDirAssociationEdge = $__canvas_widget_UniDirAssociationEdge;
      var viewId = $("#lblCurrentView").text();
      return {
        addShape: {
          name: "Add Node Shape",
          callback: function () {
            var canvas = that.getCanvas(),
              appearance = that.getAppearance(),
              nodeId;

            //noinspection JSAccessibilityCheck
            canvas
              .createNode(
                NodeShapeNode.TYPE,
                appearance.left + appearance.width + 50,
                appearance.top,
                150,
                100
              )
              .done(function (nodeId) {
                canvas.createEdge(
                  BiDirAssociationEdge.TYPE,
                  that.getEntityId(),
                  nodeId,
                  null,
                  null,
                  viewId
                );
              });
          },
          disabled: function () {
            var edges = that.getEdges(),
              edge,
              edgeId;

            for (edgeId in edges) {
              if (edges.hasOwnProperty(edgeId)) {
                edge = edges[edgeId];
                if (
                  (edge instanceof BiDirAssociationEdge &&
                    ((edge.getTarget() === that &&
                      edge.getSource() instanceof NodeShapeNode) ||
                      (edge.getSource() === that &&
                        edge.getTarget() instanceof NodeShapeNode))) ||
                  (edge instanceof UniDirAssociationEdge &&
                    edge.getTarget() instanceof NodeShapeNode)
                ) {
                  return true;
                }
              }
            }
            return false;
          },
        },
        sep: "---------",
      };
    });
  }
}

export default ViewObjectNode;
