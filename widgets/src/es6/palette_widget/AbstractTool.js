import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import loadHTML from "../html.template.loader";
const abstractToolHtml = await loadHTML(
  "../../templates/palette_widget/abstract_tool.html",
  import.meta.url
);


const DEFAULT_NODE_TOOL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-box" viewBox="0 0 16 16"><path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/></svg>`;

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
    toolColor = null,
    type = "svg"
  ) {
    if (!toolIcon) {
      toolIcon = DEFAULT_NODE_TOOL_ICON;
    }
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
    var _$node;

    if (typeof toolIcon.find === "function") {
      // toolIcon is a jquery element
      const svgRef = toolIcon.find("svg");
      if (svgRef) {
        // we found an svg icon, we will use that one to display in the palette
        svgRef.height(30);
        svgRef.width(30);
        type = "svg";
        toolIcon = svgRef.get(0).outerHTML;
      }
    }

    if (type == "svg") {
      _$node = $(
        _.template(abstractToolHtml)({
          icon: toolIcon,
          label: _label,
          color: _color,
          type,
        })
      );
    } else {
      // default image will be blank
      _$node = $(
        _.template(abstractToolHtml)({
          icon: "",
          label: _label,
          color: _color,
          type,
        })
      );
    }

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
