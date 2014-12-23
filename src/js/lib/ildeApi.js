
define(function() {
  function getSpaceInfo(f){
    (new openapp.oo.Resource(openapp.param.space())).getInfo(function(space){
      f(space["http://purl.org/dc/terms/title"],space["http://purl.org/dc/terms/description"]);
    });
  }
  /*
   * Helpful links for ILDE:
   * https://github.com/METIS-Project/ILDE/blob/feature_OpenGLM/Ilde_RestAPI.java
   * https://docs.google.com/document/d/1pKa6Qqy4WnywUs8xtkxVSVXwSTPiKBW155D4W3f7tMs/edit
   * https://docs.google.com/document/d/192qGUk150hgBE5CCKo1byEnUtLbiQVanzwDiDaF_UTg/edit 
   */
  function ILDE(username, password, resource){
    var that = this;
    if(resource == "" || resource == null){
      this.resource = "http://ilde.upf.edu/";
    } else {
      this.resource = "http://ilde.upf.edu/"+resource+"/";
    }
    $.ajax({ 
      type: "POST", 
      url: this.resource+"services/rest/login", 
      data: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><login><username>"+username+"</username><password>"+password+"</password></login>",
      success: function(response){
        that.authtoken = $(response).find("token")[0].textContent;
        for(var i in that.login_success_callbacks){
          that.login_success_callbacks[i]();
        }
      },
      error: function(){
        for(var i in that.login_fail_callbacks){
          that.login_fail_callbacks[i]();
        }
      }
    });     
    this.login_fail_callbacks = [];
    this.login_success_callbacks = [];

  };

  /*
   * @overload onLoginFail(f)
   *     Add Login event callback.
   *     
   */
  ILDE.prototype.onLoginFail = function(f){
    this.login_fail_callbacks.push(f);
  };
  /*
   * onLoginSuccess(f);
   *     Add Login event callback.
   * 
   */
  ILDE.prototype.onLoginSuccess = function(f){
    this.login_success_callbacks.push(f);
  };

  /*
   * Download a list with all the designs the user is able view or edit.
   * 
   */
  ILDE.prototype.getLdsviewlist = function(callback){
    $.ajax({ 
      type: "GET", 
      headers: {
        "Authorization": "ldshake_default_user "+this.authtoken
      },
        url: this.resource + "services/rest/ldsviewlist",   
      success: function(){
        callback(arguments);
      },
        error: function(){
          window.sayError(arguments[2])
          throw new Error(arguments[2]);
        }
    });     
  };
  /*
   * Download  designs by id
   * 
   */
  ILDE.prototype.getLdsDataById = function(id, callback){
    $.ajax({ 
      type: "GET",
      headers: {
        "Authorization": "ldshake_default_user "+this.authtoken
      },
      url: this.resource + "services/rest/lds/"+id+"/data",   
      success: function(){
        try{
          arguments[0] = JSON.parse(arguments[0])
          callback.apply(null, arguments);
        } catch (e){
          window.sayError("Sorry, this ILDE installation did not return a proper design.")
          throw new Error("The returned json object is not valid! (ILDE getLdsDataById)")
        }
      },
      error: function(){
        window.sayError(arguments[2])
        throw new Error(arguments[2]);
      }
    });     
  };

  /*
   * Delete  design   by id
   * 
   */
  ILDE.prototype.deleteLdsById = function(id, callback){
    $.ajax({ 
      type: "DELETE",
      headers: {
        "Authorization": "ldshake_default_user "+this.authtoken
      },
      url: this.resource + "services/rest/lds/"+id,   
      success: function(){
        callback(arguments);
      },
      error: function(){
        window.sayError(arguments[2])
        throw new Error(arguments[2]);
      }
    });     
  }; 

  /*
   * Download  design  property by id
   * 
   */
  ILDE.prototype.getLdsPropertiesById = function(id, callback){
    $.ajax({ 
      type: "GET",
      headers: {
        "Authorization": "ldshake_default_user "+this.authtoken
      },
      url: this.resource + "services/rest/lds/"+id+"/properties",   
      success: function(){
        callback(arguments);
      },
      error: function(){
        throw new Error(arguments[2]);
      }
    });     
  };   

  /*
   * Upload a new design and create the LdS.
   * 
   */
  ILDE.prototype.newLds = function(design, zip, parentid, callback){
    var that = this;
    getSpaceInfo(function(space_title,space_description){
      var form = new FormData();
      design = JSON.stringify(design);
      var properties = '<?xml version="1.0" encoding="UTF-8"?>'
          + '<lds>'
            + '<id>0</id>'
            + '<type>syncmeta</type>'
            + '<title>'+space_title+'</title>'
            + '<tags>'
            //+ '<tag>'
            //    + '<category>discipline</category>'
            //    + '<value>tough</value>'
            //+ '</tag>'
            + '</tags>'
            + '<search/>'
            + '<revision>0</revision>'
            + '<description>'+space_description+'</description>'
            + '<license>1</license>';
      if (parentid != null){
        properties = properties
          + "<parent>"+parentid+"</parent>"
      }
      properties = properties 
          + '</lds>';
      form.append("properties",new Blob([properties],{type: 'application/xml'}, "myproperties.xml"));
      form.append("design", new Blob([design], {type: 'application/octet-stream'}, "mydesign.glm"));
      if (zip != null && false){ // because of a bug in imsld we must not send the zip.
        form.append("design_imsld",zip);
      }
      $.ajax({ 
        type: "POST", 
        headers: {
          "Authorization": "ldshake_default_user "+that.authtoken
        },
        url: that.resource + "services/rest/newlds",// /lds/1235",
        data:  form,
        contentType: false,
        processData:false,
        success: function(){
          callback(arguments);
        },
        error: function(){
          console.dir(arguments)
          throw new Error(arguments[2]);
        }
      });     
    });
  };

  /*
   * Replace a design
   * 
   */
  ILDE.prototype.replaceLds = function(id, design, zip, callback){
    var that = this;
    getSpaceInfo(function(space_title,space_description){
      var form = new FormData();
      design = JSON.stringify(design);
      var properties = '<?xml version="1.0" encoding="UTF-8"?>'
          + '<lds>'
            + '<id>'+id+'</id>'
            + '<type>syncmeta</type>'
            + '<title>'+space_title+'</title>'
            + '<tags>'
            // + '<tag>'
            //     + '<category>discipline</category>'
            //     + '<value>tough</value>'
            // + '</tag>'
            + '</tags>'
            + '<search/>'
            + '<revision>0</revision>'
            + '<description>'+space_description+'</description>'
            + '<license>1</license>'
          + '</lds>';
      form.append("properties",new Blob([properties],{type: 'application/xml'}, "myproperties.xml"));
      form.append("design", new Blob([design], {type: 'application/octet-stream'}, "mydesign.glm"));
      if (zip != null){
        form.append("design_imsld",zip);
      }
      $.ajax({ 
        type: "POST", 
        headers: {
          "Authorization": "ldshake_default_user "+that.authtoken
        },
        url: that.resource + "services/rest/lds/"+id,
        data:  form,
        contentType: false,
        processData:false,
        success: function(){
          callback(arguments);
        },
        error: function(){
          console.dir(arguments)
          window.sayError(arguments[2])
          throw new Error(arguments[2]);
        }
      });
    });
  };

  return ILDE;
});