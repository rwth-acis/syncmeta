define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'Util',
    'canvas_widget/AbstractAttribute',
    'canvas_widget/Value',    
    'text!templates/canvas_widget/single_quiz_attribute.html'
],/** @lends SingleValueAttribute */function($,jsPlumb,_,Util,AbstractAttribute,Value,singleQuizAttributeHtml) {

    QuizAttribute.prototype = new AbstractAttribute();
	QuizAttribute.prototype.constructor = QuizAttribute;
    /**
     * SingleValueAttribute
     * @class attribute_widget.SingleValueAttribute
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractAttribute
     * @constructor
     * @param {string} id Entity id
     * @param {string} name Name of attribute
     * @param {attribute_widget.AbstractEntity} subjectEntity Entity the attribute is assigned to
     */
    function QuizAttribute(id,name,subjectEntity){
        var that = this;
        AbstractAttribute.call(this,id,name,subjectEntity);

        /***
         * Value object of value
         * @type {attribute_widget.Value}
         * @private
         */
        var _value  = new Value(id,name,this,this.getRootSubjectEntity());

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = $(_.template(singleQuizAttributeHtml,{id:id}));

        /**
         * Set Value object of value
         * @param {attribute_widget.Value} value
         */
        this.setValue = function(value){
            _value = value;
        };

        /**
         * Get Value object of value
         * @returns {attribute_widget.Value}
         */
        this.getValue = function(){
            return _value;
        };

        /**
         * jQuery object of DOM node representing the attribute
         * @type {jQuery}
         * @public
         */
        this.get$node = function(){
            return _$node;
        };
              
        /**
         * Get JSON representation of the attribute
         * @returns {Object}
         */
        this.toJSON = function(){
            var json = AbstractAttribute.prototype.toJSON.call(this);
            json.value = _value.toJSON();
            return json;
        };
        
        /**
         * Set attribute value by its JSON representation
         * @param json
         */
        this.setValueFromJSON = function(json){
            _value.setValueFromJSON(json.value);
        };

        this.registerYType = function(){
            _value.registerYType();
        };
        
        _$node.find(".name").text(this.getName());
        _$node.find(".value").append(_value.get$node());
        
        function addRow(){
            var table = _$node.find("#table")[0];
            var rows = table.rows.length;
            var row = table.insertRow(table.rows.length);        
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            var input0 = document.createElement("input");
            var input1 = document.createElement("input");
            var input2 = document.createElement("input");
            var input3 = document.createElement("input");
            input0.id = rows+"0";
            input1.id = rows+"1";
            input2.id = rows+"2";
            input3.id = rows+"3";
            input1.type = "text";            
            input2.type = "text";
            input3.type = "text";
            cell0.appendChild(input0) ;
            cell1.appendChild(input1) ;
            cell2.appendChild(input2) ;
            cell3.appendChild(input3) ;    
        };
        
        
        _$node.find("#b").click(function() {        
            addRow();
        }); 
        
        // remove rows from table
        _$node.find("#c").click(function() {        
            var table = _$node.find("#table")[0];
            var rows = table.rows.length;
            table.deleteRow(rows-1);            
        });        
        
        // write table input into attribute field
        _$node.find("#submit").click(function() {        
            var table = _$node.find("#table")[0];
            var text = _$node.find("#topic")[0].value + ";"; 
            var row = table.rows.length;
            var currID = "";
            for(var i = 2; i < row ; i++){
                if(_$node.find("#"+ i.toString() + "1")[0].value== "" || _$node.find("#"+ i.toString() + "2")[0].value== ""){
                    continue;                                       
                    }                
                for(var j = 0; j < 4 ; j++){
                    currID = i.toString() + j.toString();
                    if(j==3 &&  _$node.find("#"+ currID)[0].value == ""){
                       _$node.find("#"+ currID)[0].value  = "No Hint Available for this Question";
                    }
                    if(i== row-1 && j==3){
                        text = text + _$node.find("#"+ currID)[0].value;
                        
                    } else {
                        text = text + _$node.find("#"+ currID)[0].value + ";";
                    }
                }
            }
            _$node.find(".val")[0].value = text;
            var field = _$node.find(".val")[0];
            field.dispatchEvent(new Event('input'));
        }); 
        
        // take content from attribute field and display as table
        _$node.find("#display").click(function() {        
            var table = _$node.find("#table")[0];
            var text = _$node.find(".val")[0].value;   
            var list = text.split(";");
            _$node.find("#topic")[0].value = list[0];
            var rowNumb = (list.length-1)/4;
            var currRows = table.rows.length-2;
            if(currRows < rowNumb){
                for(currRows; currRows<rowNumb; currRows++){
                    addRow();
                }
            }
            var curr=1;
            var currID = "";            
            for(var i = 2; i < rowNumb+2 ; i++){
                for(var j = 0; j < 4 ; j++){
                    currID = i.toString() + j.toString();
                    _$node.find("#"+ currID)[0].value = list[curr];
                    curr++;
                }
            }
        });         
           
    }

    return QuizAttribute;

});