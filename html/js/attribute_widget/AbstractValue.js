define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'iwcw',
    'operations/ot/ValueChangeOperation',
    'text!templates/attribute_widget/abstract_value.html'
],/** @lends AbstractValue */function($,jsPlumb,_,IWCW,ValueChangeOperation,abstractValueHtml) {

    /**
     * AbstractValue
     * @class attribute_widget.AbstractValue
     * @memberof attribute_widget
     * @param {string} id Entity identifier
     * @param {string} name Name of attribute
     * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     * @param {attribute_widget.AbstractNode|attribute_widget.AbstractEdge} rootSubjectEntity Topmost entity in the chain of entity the attribute is assigned to
     * @constructor
     */
    function AbstractValue(id,name,subjectEntity,rootSubjectEntity){
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
         * @type {attribute_widget.AbstractEntity}
         * @private
         */
        var _subjectEntity = subjectEntity;

        /**
         * Topmost entity in the chain of entity the attribute is assigned to
         * @type {attribute_widget.AbstractEdge|attribute_widget.AbstractNode}
         * @private
         */
        var _rootSubjectEntity = rootSubjectEntity;

        /**
         * Get the entity identifier
         * @returns {string} entity id
         */
        this.getEntityId = function(){
            return _id;
        };

        /**
         * Get name of value
         * @returns {string}
         */
        this.getName = function(){
            return _name;
        };

        /**
         * Get entity the attribute is assigned to
         * @returns {attribute_widget.AbstractEntity}
         */
        this.getSubjectEntity = function(){
            return _subjectEntity;
        };

        /**
         * Get topmost entity in the chain of entity the attribute is assigned to
         * @returns {attribute_widget.AbstractEdge|attribute_widget.AbstractNode}
         */
        this.getRootSubjectEntity = function(){
            return _rootSubjectEntity;
        };
    }

    return AbstractValue;

});