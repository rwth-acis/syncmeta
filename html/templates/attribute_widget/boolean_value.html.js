define('text!templates/attribute_widget/boolean_value.html',[],function () { return '<input class="val" type="checkbox" name="<%= name %>" <% if (value) { %> checked="checked"<% } %> />';});
