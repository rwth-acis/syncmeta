import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
import AbstractEntity from "./AbstractEntity";

import loadHTML from "../html.template.loader";
const abstractAttributeHtml = await loadHTML(
  "../../templates/attribute_widget/abstract_attribute.html",
  import.meta.url
);

/**
 * Abstract Attribute
 * @class attribute_widget.AbstractAttribute
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractEntity
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
class AbstractAttribute extends AbstractEntity {
  constructor(id, name, subjectEntity) {
    super(id);

    /**
     * Name of Attribute
     * @type {string}
     * @private
     */
    var _name = name;

    /**
     * jQuery object of DOM node representing the attribute
     * @type {jQuery}
     * @private
     */
    var _$node = $(_.template(abstractAttributeHtml)());

    /**
     * Entity the attribute is assigned to
     * @type {attribute_widget.AbstractEntity}
     * @private
     */
    var _subjectEntity = subjectEntity;

    /**
     * Set name of the attribute
     * @param {string} name
     */
    this.setName = function (name) {
      _name = name;
    };

    /**
     * Get name of the attribute
     * @returns {String}
     */
    this.getName = function () {
      return _name;
    };

    /**
     * Get entity the attribute is assigned to
     * @returns {attribute_widget.AbstractEntity}
     */
    this.getSubjectEntity = function () {
      return _subjectEntity;
    };

    /**
     * Get topmost entity in the chain of entities the attribute is assigned to
     * @returns {attribute_widget.AbstractEdge|attribute_widget.AbstractNode}
     */
    this.getRootSubjectEntity = function () {
      var rootSubjectEntity = this.getSubjectEntity();
      while (rootSubjectEntity instanceof AbstractAttribute) {
        rootSubjectEntity = rootSubjectEntity.getSubjectEntity();
      }
      return rootSubjectEntity;
    };

    /**
     * Get id of the entity the attribute is assigned to
     * @returns {String}
     */
    this.getSubjectEntityId = function () {
      return _subjectEntity.getEntityId();
    };

    /**
     * Get jQuery object of the DOM node representing the attribute
     * @returns {jQuery}
     * @private
     */
    this._get$node = function () {
      return _$node;
    };
  }
  get$node() {
    this._get$node();
  }
}

export default AbstractAttribute;
