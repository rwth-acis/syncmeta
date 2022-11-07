

    
    /**
     * AbstractEntity
     * @class canvas_widget.AbstractEntity
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Identifier of this entity
     */
    class AbstractEntity {
      static MAX_Z_INDEX = 32000;
      static MIN_Z_INDEX = 1;
      static CONTEXT_MENU_Z_INDEX = AbstractEntity.MAX_Z_INDEX + 1;

      static maxZIndex = 16000;
      static minZIndex = 16000;
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


