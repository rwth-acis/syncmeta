

    /**
     * AbstractEntity
     * @class attribute_widget.AbstractEntity
     * @memberof attribute_widget
     * @constructor
     * @param {string} id Identifier of this entity
     */
    class AbstractEntity {
      constructor(id) {
        /**
         * Entity identifier
         * @type {string}
         * @private
         */
        var _id = id;

        /**
         * Get the entity identifier
         * @returns {string} entity id
         */
        this.getEntityId = function () {
          return _id;
        };
      }
    }

    export default AbstractEntity;


