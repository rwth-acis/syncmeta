<script src="<%= grunt.config('baseUrl') %>/js/generate_instance.js"></script>
<style>
    #list {
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-y: scroll;
        height: 100%;
    }
    a, a:visited, a:hover, a:focus {
        color: #333333;
        white-space: nowrap;
    }
    p {
        margin: 8px 0;
    }

    /*noinspection CssUnusedSymbol*/
    .loading_button {
        /*noinspection CssUnknownTarget*/
        background-image: url('<%= grunt.config('baseUrl') %>/img/loading_small.gif');
        background-repeat: no-repeat;
        background-position: right center;
        padding-right: 20px;
    }
</style>
<p><strong>Editor space url:</strong>
    <br/>
    <span id="space_link_input"><%= grunt.config('roleSandboxUrl') %>/<input size="16" type="text" id="space_label" /></span>
    <span id="space_link_text" style="display: none"><a id="space_link" target="_blank" href="#"></a></span>
    <br/>
    <span id="space_link_comment" style="color: #FF3333; display: none">Space already exists, will be overwritten!</span>
    <span id="space_link_comment_no_access" style="color: #FF3333; display: none">Space already exists, cannot be overwritten!</span>
</p>
<p><strong>Editor space title:</strong>
<br/>
<input size="32" type="text" id="space_title" /></p>
<button id="submit">Generate</button>
<button id="reset">Reset</button>
<p><strong>Generated instances:</strong>
<ul id="list"></ul>