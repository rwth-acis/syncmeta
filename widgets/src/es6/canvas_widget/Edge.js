import "jquery";
import "jquery-ui";
import jsPlumb from "jsPlumb/dist/js/jquery.jsPlumb-1.5.5-min.js";
import _ from "lodash-es";
import BooleanAttribute from "./BooleanAttribute";
import IntegerAttribute from "./IntegerAttribute";
import FileAttribute from "./FileAttribute";
import SingleValueAttribute from "./SingleValueAttribute";
import SingleSelectionAttribute from "./SingleSelectionAttribute";
import AbstractEdge from "./AbstractEdge";
import Arrows from "./Arrows";
import $__canvas_widget_EntityManager from "./EntityManager";

var shapes = {
  straight: ["Straight", { gap: 0 }],
  curved: ["Bezier", { gap: 0 }],
  segmented: ["Flowchart", { gap: 0 }],
};

var $colorTestElement = $("<div></div>");

/**
 * makeEdge
 * @class canvas_widget.makeEdge
 * @memberof canvas_widget
 * @constructor
 * @param {string} type Type of edge
 * @param arrowType
 * @param shapeType
 * @param color
 * @param dashstyle
 * @param overlay
 * @param overlayPosition
 * @param overlayRotate
 * @param attributes
 * @returns {Edge}
 */
function makeEdge(
  type,
  arrowType,
  shapeType,
  color,
  dashstyle,
  overlay,
  overlayPosition,
  overlayRotate,
  attributes
) {
  var shape = shapes.hasOwnProperty(shapeType)
    ? shapes[shapeType]
    : _.values(shapes)[0];
  color = color
    ? $colorTestElement.css("color", "#aaaaaa").css("color", color).css("color")
    : "#aaaaaa";

  dashstyle = dashstyle || "";
  Edge.prototype = new AbstractEdge();
  Edge.prototype.constructor = Edge;

  /**
   * Edge
   * @class canvas_widget.Edge
   * @extends canvas_widget.AbstractEdge
   * @constructor
   * @param {string} id Entity identifier of edge
   * @param {canvas_widget.AbstractNode} source Source node
   * @param {canvas_widget.AbstractNode} target Target node
   */
  function Edge(id, source, target) {
    var that = this;

    var currentViewType = null;

    /**
     * Set the currently applied view type
     * @param {string} type
     */
    this.setCurrentViewType = function (type) {
      currentViewType = type;
    };

    /**
     * Get the currently applied view type
     * @returns {string} the view type
     */
    this.getCurrentViewType = function () {
      return currentViewType;
    };

    AbstractEdge.call(this, id, type, source, target, overlayRotate);

    /**
     * Stores jsPlumb overlays for the edge
     * @type {Array}
     */
    var overlays = [];

    /**
     * make jsPlumb overlay
     * @param text
     * @returns {Function}
     */
    var makeOverlayFunction = function (text) {
      return function () {
        return $("<div></div>").append(
          $("<div></div>")
            .addClass("edge_label fixed")
            .css("color", color)
            .text(text)
        );
      };
    };

    /**
     * make a jsPlumb overlay for a attribute
     * @param attribute
     * @returns {Function}
     */
    var makeAttributeOverlayFunction = function (attribute) {
      return function () {
        return $("<div></div>").append(
          $("<div></div>").addClass("edge_label").append(attribute.get$node())
        );
      };
    };
    var init = function () {
      var attribute, attributeId, attrObj;

      if (Arrows().hasOwnProperty(arrowType)) {
        overlays.push(Arrows(color)[arrowType]);
      }

      if (overlay) {
        switch (overlayPosition) {
          case "top":
            overlays.push([
              "Custom",
              {
                create: makeOverlayFunction(overlay),
                location: 0.9,
                id: "label",
              },
            ]);
            break;
          case "bottom":
            overlays.push([
              "Custom",
              {
                create: makeOverlayFunction(overlay),
                location: 0.1,
                id: "label",
              },
            ]);
            break;
          default:
          case "center":
            overlays.push([
              "Custom",
              {
                create: makeOverlayFunction(overlay),
                location: 0.5,
                id: "label",
              },
            ]);
            break;
        }
      }

      attrObj = {};
      for (attributeId in attributes) {
        if (attributes.hasOwnProperty(attributeId)) {
          attribute = attributes[attributeId];
          switch (attribute.value) {
            case "boolean":
              attrObj[attributeId] = new BooleanAttribute(
                id + "[" + attribute.key.toLowerCase() + "]",
                attribute.key,
                that
              );
              break;
            case "string":
              attrObj[attributeId] = new SingleValueAttribute(
                id + "[" + attribute.key.toLowerCase() + "]",
                attribute.key,
                that
              );
              break;
            case "integer":
              attrObj[attributeId] = new IntegerAttribute(
                id + "[" + attribute.key.toLowerCase() + "]",
                attribute.key,
                that
              );
              break;
            case "file":
              attrObj[attributeId] = new FileAttribute(
                id + "[" + attribute.key.toLowerCase() + "]",
                attribute.key,
                that
              );
              break;
            default:
              if (attribute.options) {
                attrObj[attributeId] = new SingleSelectionAttribute(
                  id + "[" + attribute.key.toLowerCase() + "]",
                  attribute.key,
                  that,
                  attribute.options
                );
              }
          }

          switch (attribute.position) {
            case "top":
              overlays.push([
                "Custom",
                {
                  create: makeAttributeOverlayFunction(attrObj[attributeId]),
                  location: 1,
                  id: "label " + attributeId,
                },
              ]);
              break;
            case "center":
              overlays.push([
                "Custom",
                {
                  create: makeAttributeOverlayFunction(attrObj[attributeId]),
                  location: 0.5,
                  id: "label " + attributeId,
                },
              ]);
              break;
            case "bottom":
              overlays.push([
                "Custom",
                {
                  create: makeAttributeOverlayFunction(attrObj[attributeId]),
                  location: 0,
                  id: "label " + attributeId,
                },
              ]);
              break;
          }
        }
      }
      that.setAttributes(attrObj);

      overlays.push([
        "Custom",
        {
          create: function () {
            that.get$overlay().hide().find(".type").addClass(shapeType);
            return that.get$overlay();
          },
          location: 0.5,
          id: "label",
        },
      ]);

      if (overlay) {
        that
          .get$overlay()
          .find("input[name='Label']")
          .css("visibility", "hidden");
      }

      that.setDefaultPaintStyle({
        strokeStyle: color,
        lineWidth: 2,
      });
    };

    /**
     * Connect source and target node and draw the edge on canvas
     */
    this.connect = function () {
      var source = this.getSource();
      var target = this.getTarget();
      var connectOptions = {
        source: source.get$node(),
        target: target.get$node(),

        paintStyle: that.getDefaultPaintStyle(),
        endpoint: "Blank",
        anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
        connector: shape,
        overlays: overlays,
        cssClass: this.getEntityId(),
      };

      if (source === target) {
        connectOptions.anchors = ["TopCenter", "LeftMiddle"];
      }

      source.addOutgoingEdge(this);
      target.addIngoingEdge(this);

      this.setJsPlumbConnection(jsPlumb.connect(connectOptions));
      this.repaintOverlays();
      _.each($__canvas_widget_EntityManager.getEdges(), function (e) {
        e.setZIndex();
      });
    };

    /**
     * Get JSON representation of the edge
     * @returns {object}
     */
    this.toJSON = function () {
      var json = AbstractEdge.prototype.toJSON.call(this);
      json.type = type;
      return json;
    };

    /**
     * restyles the edge
     * @param arrowType
     * @param color
     * @param shapeType
     * @param dashstyle
     * @param overlay
     * @param overlayPosition
     * @param overlayRotate
     * @param attributes
     */
    this.restyle = function (
      arrowType,
      color,
      shapeType,
      dashstyle,
      overlay,
      overlayPosition,
      overlayRotate,
      attributes
    ) {
      overlays = [];

      color = color
        ? $colorTestElement
            .css("color", "#aaaaaa")
            .css("color", color)
            .css("color")
        : "#aaaaaa";

      if (Arrows().hasOwnProperty(arrowType)) {
        overlays.push(Arrows(color)[arrowType]);
      }

      if (overlay) {
        switch (overlayPosition) {
          case "top":
            overlays.push([
              "Custom",
              {
                create: makeOverlayFunction(overlay),
                location: 0.9,
                id: "label",
              },
            ]);
            break;
          case "bottom":
            overlays.push([
              "Custom",
              {
                create: makeOverlayFunction(overlay),
                location: 0.1,
                id: "label",
              },
            ]);
            break;
          default:
          case "center":
            overlays.push([
              "Custom",
              {
                create: makeOverlayFunction(overlay),
                location: 0.5,
                id: "label",
              },
            ]);
            break;
        }
      }

      overlays.push([
        "Custom",
        {
          create: function () {
            that.get$overlay().hide().find(".type").addClass(shapeType);
            return that.get$overlay();
          },
          location: 0.5,
          id: "label",
        },
      ]);

      if (overlay) {
        that
          .get$overlay()
          .find("input[name='Label']")
          .css("visibility", "hidden");
      }

      for (var attributeId in attributes) {
        if (attributes.hasOwnProperty(attributeId)) {
          var attribute = attributes[attributeId];
          switch (attribute.position) {
            case "top":
              overlays.push([
                "Custom",
                {
                  create: makeAttributeOverlayFunction(
                    that.getAttribute(attributeId)
                  ),
                  location: 1,
                  id: "label " + attributeId,
                },
              ]);
              break;
            case "center":
              overlays.push([
                "Custom",
                {
                  create: makeAttributeOverlayFunction(
                    that.getAttribute(attributeId)
                  ),
                  location: 0.5,
                  id: "label " + attributeId,
                },
              ]);
              break;
            case "bottom":
              overlays.push([
                "Custom",
                {
                  create: makeAttributeOverlayFunction(
                    that.getAttribute(attributeId)
                  ),
                  location: 0,
                  id: "label " + attributeId,
                },
              ]);
              break;
          }
        }
      }

      var paintStyle = {
        strokeStyle: color,
        lineWidth: 2,
        dashstyle: dashstyle,
      };

      that.setDefaultPaintStyle(paintStyle);
      that.setRotateOverlay(overlayRotate);

      if (that.getJsPlumbConnection()) {
        //if the edge is drawn on the canvas
        that.getJsPlumbConnection().removeAllOverlays();
        for (var i = 0; i < overlays.length; i++) {
          that.getJsPlumbConnection().addOverlay(overlays[i]);
        }
        that.getJsPlumbConnection().setPaintStyle(paintStyle);
        that.repaintOverlays();
      }
    };

    this.registerYMap = function () {
      AbstractEdge.prototype.registerYMap.call(this);

      var attr = that.getAttributes();
      for (var key in attr) {
        if (attr.hasOwnProperty(key)) {
          var val = attr[key].getValue();
          if (val.hasOwnProperty("registerYType")) {
            val.registerYType();
          }
        }
      }
    };

    init();
  }

  /**
   * Get the arrow type of the edge type
   * @static
   * @returns {*}
   */
  Edge.getArrowType = function () {
    return arrowType;
  };

  /**
   * Get the shape type of the edge type
   * @static
   * @returns {*}
   */
  Edge.getShapeType = function () {
    return shapeType;
  };

  /**
   * Get the color of the edge type
   * @static
   * @returns {*}
   */

  Edge.getShape = function () {
    return shape;
  };

  Edge.getColor = function () {
    return color;
  };

  /**
   * Get the overlay of the edge type
   * @static
   * @returns {*}
   */
  Edge.getOverlay = function () {
    return overlay;
  };

  /**
   * Get the overlay position of the edge type
   * @static
   * @returns {*}
   */
  Edge.getOverlayPosition = function () {
    return overlayPosition;
  };

  /**
   * Get the overlay rotate of the edge type
   * @static
   * @returns {*}
   */
  Edge.getOverlayRotate = function () {
    return overlayRotate;
  };

  /**
   * Get the attribute definition of the edge type
   * @static
   * @returns {*}
   */
  Edge.getAttributes = function () {
    return attributes;
  };

  Edge.getType = function () {
    return type;
  };

  Edge.getArrowOverlays = function () {
    var overlays = [];
    if (Arrows().hasOwnProperty(arrowType)) {
      overlays.push(Arrows(color)[arrowType]);
    }
    return overlays;
  };

  return Edge;
}

export default makeEdge;
