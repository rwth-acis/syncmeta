<?xml version="1.0" encoding="UTF-8" ?>
<!-- generated on <%= grunt.template.today() %> -->
<Module>
  <ModulePrefs
    title="<%= meta.title %>"
    description="<%= meta.description %>"
    author="<%= grunt.config('pkg.author.name') %>"
    author_email="<%= grunt.config('pkg.author.email') %>"
    width="<%= meta.width %>"
    height="<%= meta.height %>">
	
  </ModulePrefs>
  <Content type="html">
    <![CDATA[
    <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/yjs/y.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/y-array/y-array.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/y-map/y-map.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/y-text/y-text.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/y-memory/y-memory.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/y-websockets-client/y-websockets-client.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/config.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/require.js"></script>    
    <%= partial(bodyPartial,null) %>
    <script src="<%= grunt.config('baseUrl') %>/js/shared.js"></script>    
    ]]>
  </Content>
</Module>
