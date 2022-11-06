import "jquery-ui";
import _ from "lodash-es";
import AbstractEntity from "./AbstractEntity";
import loadHTML from "../html.template.loader";
const abstractAttributeHtml = await loadHTML(
  "../../../html/templates/canvas_widget/abstract_attribute.html",
  import.meta.url
);

AbstractAttribute.prototype = new AbstractEntity();
AbstractAttribute.prototype.constructor = AbstractAttribute;

/**
 * AbstractAttribute
 * @class canvas_widget.AbstractAttribute
 * @extends canvas_widget.AbstractEntity
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity id
 * @param {string} name Name of attribute
 * @param {AbstractEntity} subjectEntity Entity the attribute is assigned to
 */
function AbstractAttribute(id, name, subjectEntity) {
  AbstractEntity.call(this, id);

  /**
   * Entity id
   * @type {string}
   * @private
   */
  var _id = id;

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
   * @type {canvas_widget.AbstractEntity}
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
   * @returns {canvas_widget.AbstractEntity}
   */
  this.getSubjectEntity = function () {
    return _subjectEntity;
  };

  /**
   * Get topmost entity in the chain of entities the attribute is assigned to
   * @returns {canvas_widget.AbstractEdge|canvas_widget.AbstractNode}
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

  /**
   * Get JSON representation of the attribute
   * @returns {Object}
   * @private
   */
  this._toJSON = function () {
    return {
      id: _id,
      name: _name,
    };
  };
}

/**
 * Get jQuery object of the DOM node representing the attribute
 * @returns {jQuery}
 */
AbstractAttribute.prototype.get$node = function () {
  return this._get$node();
};

/**
 * Get JSON representation of the attribute
 * @returns {Object}
 */
AbstractAttribute.prototype.toJSON = function () {
  return this._toJSON();
};

AbstractAttribute.prototype.registerYTypeForValue = function (map, value) {
  var deferred = $.Deferred();
  map.get(value.getEntityId()).then(function (type) {
    value.registerYType(type);
    deferred.resolve();
  });
  return deferred.promise();
};

export default AbstractAttribute;
