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

    <Require feature="opensocial-0.8" ></Require>
    <Require feature="openapp" ></Require>
    <Require feature="dynamic-height"></Require>
	
	<OAuth>
      <Service name="openapp" xmlns:openapp="http://www.role-project.eu/xml/openapp/opensocialext/"
               openapp:service="http://purl.org/role/terms/spaceService"
               openapp:permitReadAppend="http://purl.org/role/terms/data">
        <Request method="" url=""></Request>
        <Authorization url=""></Authorization>
        <Access method="" url=""></Access>
      </Service>
    </OAuth>
	
  </ModulePrefs>
  <Content type="html">
    <![CDATA[
    <script type="application/javascript">
        (function(){
          var cnt = 30; // 5 attempts per second => 6 seconds
          var timeout = function(){
              var btn = document.getElementById("oauthPersonalizeButton");
              var wrapper = document.getElementById("oauthPersonalize");
              if(wrapper && wrapper.offsetParent !== null && btn && btn.onclick){
                  var win = null;
                  var openWindow = window.open;
                  window.open = function(){return win = openWindow.apply(window,arguments);};
                  btn.onclick.call(btn);
                  if(win){
                      win.onload = function(){
                          win.document.getElementsByTagName("form")[0].submit();
                          setTimeout(function(){
                              window.location.reload();
                              if(win){
                                  win.close();
                              }
                          },1500);
                      };
                  }
              } else {
                  if(cnt > 0){
                      cnt -= 1;
                      setTimeout(timeout,700);
                  }
              }
          };
          timeout();
        })();
    </script>
    <script src="<%= grunt.config('baseUrl') %>/js/config.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/require.js"></script>    
    <%= partial(bodyPartial,null) %>
    <script src="<%= grunt.config('baseUrl') %>/js/shared.js"></script>    
    ]]>
  </Content>
</Module>
