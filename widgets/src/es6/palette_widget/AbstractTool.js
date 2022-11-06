import "jquery-ui";
import _ from "lodash-es";
import loadHTML from "../html.template.loader";
const abstractToolHtml = await loadHTML(
  "../../../html/templates/palette_widget/abstract_tool.html",
  import.meta.url
);

/**
 * AbstractTool
 * @class palette_widget.AbstractTool
 * @memberof palette_widget
 * @constructor
 * @param {string} toolName Name of tool
 * @param {string} toolLabel Label of tool
 * @param {string} toolDescription Description of tool
 * @param {$|string} toolIcon Path to icon of tool
 * @param {string} [toolColor] Background color of tool icon
 */
class AbstractTool {
  _name;
  _label;
  _description;
  _icon;
  _color;
  _$node;

  get$node;
  setName;
  getName;
  setLabel;
  getLabel;
  setDescription;
  getDescription;
  setIcon;
  getIcon;
  setColor;
  getColor;
  select;
  unselect;

  constructor(
    toolName,
    toolLabel,
    toolDescription,
    toolIcon,
    toolColor = null
  ) {
    /**
     * Name of tool
     * @type {string}
     * @private
     */
    var _name = toolName;

    /**
     * Label of tool
     * @type {string}
     * @private
     */
    var _label = toolLabel;

    /**
     * Description of tool
     * @type {string}
     * @private
     */
    var _description = toolDescription;

    /**
     * Path to icon of tool
     * @type {$|string}
     * @private
     */
    var _icon = toolIcon;

    /**
     * Background color of tool icon
     * @type {string}
     * @private
     */
    var _color = toolColor || "#000000";

    /**
     * jQuery object of DOM node representing the tool
     * @type {jQuery}
     * @private
     */
    var _$node = $(
      _.template(abstractToolHtml)({
        icon:
          toolIcon instanceof $ || !toolIcon
            ? ""
            : "<%= grunt.config('baseUrl') %>/img/" + _icon,
        label: _label,
        color: _color,
      })
    );

    /**
     * Get jQuery object of DOM node representing the tool
     * @returns {jQuery}
     */
    this.get$node = function () {
      return _$node;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set name of tool
     * @param {string} name
     */
    this.setName = function (name) {
      _name = name;
    };

    /**
     * Get name of tool
     * @returns {string}
     */
    this.getName = function () {
      return _name;
    };

    /**
     * Set label of tool
     * @param {string} label
     */
    this.setLabel = function (label) {
      _label = label;
    };

    /**
     * Get label of tool
     * @returns {string}
     */
    this.getLabel = function () {
      return _label;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set description of tool
     * @param {string} description
     */
    this.setDescription = function (description) {
      _description = description;
    };

    /**
     * Get description of tool
     * @returns {string}
     */
    this.getDescription = function () {
      return _description;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set path to icon of tool
     * @param {$|string} icon
     */
    this.setIcon = function (icon) {
      _icon = icon;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get path to icon of tool
     * @returns {$|string}
     */
    this.getIcon = function () {
      return _icon;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set background color of tool icon
     * @param {string} color
     */
    this.setColor = function (color) {
      _color = color;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get background color of tool icon
     * @returns {string}
     */
    this.getColor = function () {
      return _color;
    };

    /**
     * Select tool
     */
    this.select = function () {
      _$node.addClass("selected");
    };

    /**
     * Unselect tool
     */
    this.unselect = function () {
      _$node.removeClass("selected");
    };

    if (_icon instanceof $) {
      _$node.find(".icon").empty().append(_icon);
    }
  }
}

export default AbstractTool;
