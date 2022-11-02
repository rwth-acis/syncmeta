

    AbstractEntity.MAX_Z_INDEX = 32000;
    AbstractEntity.MIN_Z_INDEX = 1;
    AbstractEntity.CONTEXT_MENU_Z_INDEX = AbstractEntity.MAX_Z_INDEX + 1;

    AbstractEntity.maxZIndex = 16000;
    AbstractEntity.minZIndex = 16000;
    /**
     * AbstractEntity
     * @class canvas_widget.AbstractEntity
     * @memberof canvas_widget
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


