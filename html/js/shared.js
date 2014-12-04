requirejs([],function(){
  var tryCounter = 0;
  var createReloadHandler = function (){
    var iwcClient = window._iwc_instance_;
    if (iwcClient && iwcClient.onIntent != null){
        var previous_iwc_onIntent = iwcClient.onIntent;
        iwcClient.onIntent = function(message){
          if(message.action === "RELOAD"){
            console.log(" K!!!!!!!!!!!!!!!!!!!!!!!!!!!! RELOAD!!!!!!!!!!!!!!!!!!!!!")
            window.location.reload();
          }
          previous_iwc_onIntent.apply(this, arguments)
        };   
        window._reloadThisFuckingInstance = function(){
          console.log("Reloading Everything")
          var message = {
              action: "RELOAD",
              component: "",
              data: "",
              dataType: "",
              flags: ["PUBLISH_GLOBAL"],
              extras: {
                reload: true
              }
          };  
          iwcClient.publish(message);
        };
    } else {
      setTimeout(createReloadHandler, 5000);
    }
  };
  setTimeout(createReloadHandler, 10000);
  
});
