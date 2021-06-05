<script type="module">
    import * as Y from 'https://unpkg.com/yjs?module';
    import { WebsocketProvider } from 'https://unpkg.com/y-websocket?module';
    window.Y = Y;
    window.WebsocketProvider = WebsocketProvider;
</script>
<!--<script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/yjs/yjs.cjs"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/y-websocket/y-websocket.cjs"></script>-->
    <script src="<%= grunt.config('baseUrl') %>/js/config.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/require.js"></script>    
    <%= partial(bodyPartial,null) %>
    <script src="<%= grunt.config('baseUrl') %>/js/shared.js"></script>    
