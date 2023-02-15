

    /**
     * AbstractValue
     * @class canvas_widget.AbstractValue
     * @member of canvas_widget
     * @constructor
     * @param {string} id Entity identifier
     * @param {string} name Name of attribute
     * @param {canvas_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {canvas_widget.AbstractNode|canvas_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
     */
    class AbstractValue {
      constructor(id, name, subjectEntity, rootSubjectEntity) {
        var that = this;

        /**
         * The entity identifier
         * @returns {string} entity id
         */
        var _id = id;

        /**
         * Name of Attribute
         * @type {string}
         * @private
         */
        var _name = name;

        /**
         * Entity the attribute is assigned to
         * @type {canvas_widget.AbstractEntity}
         * @private
         */
        var _subjectEntity = subjectEntity;

        /**
         * Topmost entity in the chain of entity the attribute is assigned to
         * @type {canvas_widget.AbstractEdge|canvas_widget.AbstractNode}
         * @private
         */
        var _rootSubjectEntity = rootSubjectEntity;

        /**
         * Get the entity identifier
         * @returns {string} entity id
         */
        this.getEntityId = function () {
          return _id;
        };

        /**
         * Get name of value
         * @returns {string}
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
         * Get topmost entity in the chain of entity the attribute is assigned to
         * @returns {canvas_widget.AbstractEdge|canvas_widget.AbstractNode}
         */
        this.getRootSubjectEntity = function () {
          return _rootSubjectEntity;
        };

        /**
         * Get JSON representation of the edge
         * @returns {Object}
         */
        this._toJSON = function () {
          return {
            id: that.getEntityId(),
            name: _name,
          };
        };
      }
      //noinspection JSAccessibilityCheck
      toJSON() {
        return this._toJSON();
      }
    }


    export default AbstractValue;

