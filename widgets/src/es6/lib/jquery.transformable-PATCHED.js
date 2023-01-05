/**************Important note by Andre:*********************************
I commented out the 'recheck if containment has been turned off after drag started'
as it produced an error. Just search for the string to find the line.
***********************************************************************/


/******************************************************************************
	jquery.transformable.js v0.3.4 copyright 2013 Aaron Flin (aaron at flin dot org).
		- fixed test for mozillaOverflowHiddenBug, which would improperly always return true
		- todo:  fix the parseFloat(computedStyle.[top|left]) in jQuery.fn.transformable.offsetNoGetBounds 
		         so that it can handle %, or better yet, figure out a better way.  Without a fix, I think
		         older Mozilla browsers will choke on a div with offsetParents that are not positioned in 'px'

	jquery.transformable.js v0.3.3 copyright 2013 Aaron Flin (aaron at flin dot org).
		- added initial support for dragging sortables in transformed divs.

	jquery.transformable.js v0.3.2 copyright 2012 Aaron Flin (aaron at flin dot org).
		- added a selector option to totalmatrix.  el.transformable('totalmatrix',true|false,'.myclass') will
		  stop drilling down when/before it reaches an element with class=".myclass" or other selector.
		- transformable rotates/skews/scales with an origin of 50% 50%.  But if a parent element has
		  a different origin, t.tOffset() as well as the many things that depends on it will now work.
		- renamed el.tOffset().unrotated to el.tOffset.untransformed
		- added snapto support for draggable when dragging transformed items.  Needs testing but appears ok.
		- minor fix made to untransformedOffset() in order to work properly with newer jQuerys.
		- corrected for firefox bug causing inaccurate untransformedOffsets to be returned on child/decendant
		  elements of divs with overflow!=visible.
		- compensated for erroneous origin in chrome when scrollbars are present.
		- moved scale icon to upper left corner and removed the doubleclick to toggle with resizable feature.
		- no testing in MSIE this round, but a quick look shows msie 10 preview appears to handle 
		  everything well.
		- todo: change .parent() to offsetParent() in functions that use it and test.

	jquery.transformable.js v0.3.1 copyright 2012 Aaron Flin (aaron at flin dot org).
		- updated jQuery.fn.transformable.offsetNoGetBounds so it works with jquery 1.7 and above
		- fixed typo which added a single quote to the page (thanks Dan Maynes Aminzade).
		- quick fix for the missing event.pageX in 1.7.  I don't understand why its missing, so
		  hopefully I'm not creating more problems than solving.

	jquery.transformable.js v0.3
	
		-preliminary support for msie<9.  Problems were different than expected.
			- tested on v 8.06
			- containment isn't correct
			- overflow: visible is not respected (not sure what I can do about that);
			- you'd still be better off using google chrome frame.
		
		- ui.position in draggable callback is available again, but will be the untransformed value
		
		- added option 'sizeIcons', which will attempt to keep icons a fixed size within transformed element.
			default is true unless browser is msie<9, then false.
			to disable: el.transformable('option','sizeIcons',false); 
			or on init el.transformable({sizeIcons: false});
			
		- el.transformable('destroy',true); will, in addition to destroying, reset the transformation.
	
	jquery.transformable.js v0.2.2
		-fixed error when called with no options

	jquery.transformable.js v0.2.2
		- fixed 'containment' option when set from initialization.

		- el.transformable('totalmatrix',true) will return false 
		  if matrix is [1,0,0,1,0,0] (no transform)

		  - relativeOffset() now works as advertised.

		  - el.transformable('totalmatrix',[true|false],'inverse') will return 
		  inverse matrix of total transform, or [1,0,0,1,0,0] or false if no transform	

	jquery.transformable.js v0.2.1
	
		- fixed the rotateDisabled, skewDisabled and scaleDisabled functions
		  broken in last rev.

	jquery.transformable.js v0.2
	
		- fixed problem with containment after transforms are reset.

		- added el.relativeOffset(rel,{left: distancex, top: distancey})
		  This will place el's left,top at the specified distance from rel's 
		  left,top in rel's coordinate system regardless of el's transformations.

		- recoded and renamed el.transformable('transformation') to el.transformable('totalmatrix');
		  this gives the same as tOffset().totalmatrix without the offset overhead.

		- fixed problem with options and callbacks getting mixed up.  May still need some work
	
		- first stab at parent containment
	          use el.transformable({containment: true}) or el.transformable('option','containment',true);
	          or individually, ie el.transformable({rotatecontain: true}) or el.transformable('option','rotatecontain',true);

---------------------------------------------------------------------------------
	jquery.transformable.js v0.1
	copyright 2011 Aaron Flin (aaron at flin dot org)
	Dual licensed under the MIT or GPL Version 2 licenses.
	Portions are from jquery.transform.js - Copyright 2011 @louis_remi (With all of my gratitude)
	Also some code copied from jquery-ui and jquery itself, see copyrights therein.
	Requires jquery.transform.js (https://github.com/louisremi/jquery.transform.js)

	Designed to work with jquery-ui resizable and draggable.  jquery-ui required (at least for icons and css)

	Preliminary testing done with:
		jQuery 		v1.5.1
		jQuery-ui	v1.8.11
		firefox 	4, 3.6
		msie		9
		safari(mac)	5.02
		google chrome	10, 8

	Demo:  http://jsfiddle.net/aflin/vbSMy/
	
	Sample Usage:
		$('body').append('<div id="mydiv" style="position: absolute; width:300px; height: 300px; border: 1px black solid;"></div>');
		var el=$('#mydiv');
		el.draggable();
		el.resizable();
		el.transformable();

	Options and Callbacks:
		el.transformable( {
			rotateStart: function(e,ui){},
			rotate:      function(e,ui){},
			rotateStop:  function(e,ui){},
			skewStart:   function(e,ui){},
			skew:        function(e,ui){},
			skewStop:    function(e,ui){},
			skewXStart:   function(e,ui){},
			skewX:        function(e,ui){},
			skewXStop:    function(e,ui){},
			skewYStart:   function(e,ui){},
			skewY:        function(e,ui){},
			skewYStop:    function(e,ui){},
			scaleStart:  function(e,ui){},
			scale:       function(e,ui){},
			scaleStop:   function(e,ui){},
			rotatable:   [true|false],
			skewable:    [true|false],
			scalable:    [true|false]
		});

		- returning false on Start functions will disable the mousemove 
		  bindings and cancel the event
		- returning false on rotate, skew, skewX, skewY or scale will disable the next update
		
		el.transformable('rotateDisabled') returns the current state
		el.transformable('rotateDisabled',[true|false]) dis/enables rotate
		same for skewDisabled and scaleDisabled

		el.transformable('destroy') should disable, remove icons and 
		binding. - not well tested
		
		OFFSET:
		
		If you want to know the offset of the transformed element, use:
			var o=el.tOffset();
		This will return {
					left:	number,  //the furthest left point of element on page 
					right:	number,  // ditto for right
					top:	number,
					bottom: number,
						// position of corners with topleft being the 
						// untransformed topleft corner
					corners:[  {x: topleftx,     y: toplefty}, 
						   {x: toprightx,    y: toprighty},
						   {x: bottomrightx, y: bottomrighty},
						   {x: bottomleftx,  y: bottomlefty}
						],
					center: {x: centerx, y: centery},
						//affine transform matrix of this element
					matrix: [number,number,number,number,number,number],
						//sum off this and parents' matricies
					totalmatrix: [number,number,number,number,number,number],
						//whether this or any parents have transformations
					transformed: bool
				}

		If you want to set your position absolutely on the page, use:
			el.tOffset({left: number, top: number});

		If you do el.tOffset(el.tOffset()), 
		hopefully your div will not move ;-)

		el.untransformedOffset() will get and set the offset left and top as if 
		no transformations are present.
		
		el.offset() will vary depending on browser.
		
		RETRIEVING THE CURRENT TRANSFORMS:
		
		var tr=el.getTransform();
		This will return tr.rotate, tr.skew[0,1], tr.skewx, tr.skewy, 
		tr.scale[0,1], tr.scalex and tr.scaley.
			- the values you put in will unlikely be the values 
			  you get out.  In particular if you skewx and skewy,
			  this will be interpreted as rotating, scaling and 
			  skewx, and skewy will be 0.  This is not my choice, but
			  the choice of the algorithms I pilfered.

		var m=this.matrixToArray() will return the current matrix (same as o.matrix above);

		SETTING A TRANSFORM:
		use el.setTransform(option,val);
		option[,val]:
			[number,number,number,number,number,number]	- set to this matrix
			"matrix(num,num,num,num,num,num)"		- set to this matrix
			'rotate',number					- apply rotation to current matrix
			'skewx',number					- apply skew on x-axis to current
			'skewy',number					- apply skew on y-axis to current
			'scalex',number					- apply scale on x-axis to current
			'scaley',number					- apply scale on y-axis to current
		* again, not everything is fully tested

	Features and Caveats:
		- Draggable containment mostly works

		- Shift key will constrain rotation and skew to 15 deg increments
		  and scale to be proportional.
		  
		- Resize containment does not work properly yet, 
		  you should not enable it if container or element is 
		  transformed.

		- If the element is .resizable() and the handle is in the s-e 
		  position (default), the scale icon will toggle when the
		  resizable icon is double-clicked.
		  
		- This has been developed using google chrome browser.  Transforms are
		  reasonably fast using it but other browsers may be a bit slow.  

		- skewing both x and y to large angles can cause jumpy results.
		- skewing either x or y to large angles results in misalignment 
		  with handle and a jump to a larger angle.
		  Not sure why yet.

		- no real attempt has been made to test on msie less than 9, but a quick look
		  shows there are several problems.  It appears children of transformed div do not
		  inherit parents' transformations.  To do so manually would be computationally expensive.
		  I'd suggest using google chrome frame if msie <9 is necessary.

		- designed to work like a jquery-ui, but doesn't use their model.
		
		- May work without jquery-ui, but you would have to make your own css
		  and icons for handles.

		- this is a preliminary release, not everything has been fully tested.

******************************************************************************/



(function($) {
$(document).ready(function() {
  var opts = {};
  var twopi = 2.0 * Math.PI;
  var fortyfive = Math.PI / 4;
  var ninety = Math.PI / 2;
  var fifteen = Math.PI / 12;
  var sevenpointfive = Math.PI / 24;
  var radtodeg = 180 / Math.PI;
  var tobj = {};

  //get our vendor prefix, if any
  var vpref = "";
  var originusesborder = true;
  var usespx = false;
  var mozillaOverflowHiddenBug = false;
  var originMovesWithScrollBar = false;
  var originMovesWithPadding = true;
  {
    var div = document.createElement("div");
    var vendorprefs = ["-khtml-", "-ms-", "-o-", "-moz-", "-webkit-"];
    var vendorSprefs = ["Khtml", "ms", "O", "Moz", "Webkit"];
    if (!("transform-origin" in div.style)) {
      var l = vendorprefs.length;
      while (l--) {
        if (vendorSprefs[l] + "TransformOrigin" in div.style) {
          vpref = vendorprefs[l];
          break;
        }
      }
    }
    $("body").append(
      '<div id="transformableeraseme" style="overflow: hidden; position: absolute; border-style: solid; border-width: 1px; border-color: rgb(0, 0, 0); left: -1000px; top: -1000px; width: 250px; height: 250px;">\
			<div id="transformableeraseme2" style="position: absolute; border-width: 1px; border-color: black; border-style: solid; left: 10px; top: 10px; width: 20px; height: 20px;"></div>\
		</div>'
    );
    var tmp = $("#transformableeraseme");
    var tmp2 = $("#transformableeraseme2");
    tmp.css(vpref + "transform-origin", "50% 50%");
    //I think this will always be true, but better safe than sorry.
    var torigin = tmp.css(vpref + "transform-origin");
    if (("" + torigin).match(/px/)) {
      tmp.css("border-width", "30px");
      usespx = true;
      var px = parseInt(torigin);
      tmp.css(vpref + "transform", "rotate(45deg)");
      torigin = tmp.css(vpref + "transform-origin");
      if (parseInt(torigin) == px) originusesborder = false;
    }
    tmp.css("padding-bottom", "30px");
    if (tmp.css(vpref + "transform-origin") == torigin)
      originMovesWithPadding = false;
    tmp.css("padding-left", "0px");
    tmp.css("overflow", "scroll");
    originMovesWithScrollBar =
      parseInt(torigin) - parseInt(tmp.css(vpref + "transform-origin"));
    var csleft;
    if (window.getComputedStyle) {
      var cs = window.getComputedStyle(tmp2[0]);
      csleft = cs.left;
    } else csleft = tmp2[0].currentStyle["left"];
    //see https://bugzilla.mozilla.org/show_bug.cgi?id=353363
    // I'd guess nobody cares since jQuery uses getBoundingClientRect for the most part
    if (parseInt(csleft) != tmp2[0].offsetLeft) {
      mozillaOverflowHiddenBug = true;
    }
    tmp.remove();
  }
  //console.log("originusesborder="+originusesborder);
  var methods = {
    option: function (args, args2) {
      opts = this.eq(0).data("transformable-opts");
      if (opts == undefined) return undefined;
      switch (args) {
        case "sizeIcons":
          {
            if (args2 === undefined) {
              return opts.sizeIcons;
            } else {
              return this.each(function () {
                var t = $(this);
                opts = t.data("transformable-opts");
                opts.sizeIcons = args2;
                t.data("transformable-opts", opts);
              });
            }
          }
          break;
        case "rotateDisabled":
          {
            if (args2 === undefined) {
              return opts.rotatable;
            } else if (args2 === false) {
              return this.each(function () {
                var t = $(this);
                opts = t.data("transformable-opts");
                disablerotate(t);
                enablerotate(t);
                opts.rotatable = true;
                t.data("transformable-opts", opts);
              });
            } else if (args2 === true) {
              return this.each(function () {
                var t = $(this);
                opts = t.data("transformable-opts");
                disablerotate(t);
                opts.rotatable = false;
                t.data("transformable-opts", opts);
              });
            }
          }
          break;
        case "skewDisabled":
          {
            if (args2 === undefined) {
              return opts.skew;
            } else if (args2 === false) {
              return this.each(function () {
                var t = $(this);
                opts = t.data("transformable-opts");
                disableskew(t);
                enableskew(t);
                opts.skew = true;
                t.data("transformable-opts", opts);
              });
            } else if (args2 === true) {
              return this.each(function () {
                var t = $(this);
                opts = t.data("transformable-opts");
                disableskew(t);
                opts.skew = false;
                t.data("transformable-opts", opts);
              });
            }
          }
          break;
        case "scaleDisabled":
          {
            if (args2 === undefined) {
              return opts.scale;
            } else if (args2 === false) {
              return this.each(function () {
                var t = $(this);
                opts = t.data("transformable-opts");
                disablescale(t);
                enablescale(t);
                opts.scale = true;
                t.data("transformable-opts", opts);
              });
            } else if (args2 === true) {
              return this.each(function () {
                var t = $(this);
                opts = t.data("transformable-opts");
                disablescale(t);
                opts.scale = false;
                t.data("transformable-opts", opts);
              });
            }
          }
          break;
        case "containrotate":
        case "containscale":
        case "containskew":
          {
            if (args2 === undefined) {
              return opts[args];
            } else if (args2 === false) {
              return this.each(function () {
                var t = $(this);
                opts = t.data("transformable-opts");
                opts[args] = false;
                t.data("transformable-opts", opts);
              });
            } else if (args2 === true) {
              return this.each(function () {
                var t = $(this);
                opts = t.data("transformable-opts");
                opts[args] = true;
                t.data("transformable-opts", opts);
              });
            }
          }
          break;
        case "containment":
          {
            if (args2 === undefined) {
              return {
                rotate: opts.containrotate,
                scale: opts.containscale,
                skew: opts.containskew,
              };
            } else if (args2 === false) {
              return this.each(function () {
                var t = $(this);
                opts = t.data("transformable-opts");
                opts.containscale = false;
                opts.containskew = false;
                opts.containrotate = false;
                opts.containment = false;
                t.data("transformable-opts", opts);
              });
            } else if (args2 === true || args2 == "parent") {
              return this.each(function () {
                var t = $(this);
                opts = t.data("transformable-opts");
                opts.containrotate = true;
                opts.containskew = true;
                opts.containscale = true;
                opts.containment = true;
                t.data("transformable-opts", opts);
              });
            }
          }
          break;
      }
    },
    destroy: function (args) {
      return this.each(function () {
        var t = $(this);
        t.find(".transformable-handle").remove();
        t.removeData("transformable-opts");
        t.removeAttr("data-transform-scalex");
        t.removeAttr("data-transform-scaley");
        t.removeAttr("data-transform-skewx");
        t.removeAttr("data-transform-skewy");
        t.removeAttr("data-transform-rotate");
        t.removeAttr("data-transform");
        t.removeData("transformable-opts");
        t.unbind(".transformable");
        if (args === true) t.css("transform", "matrix(1,0,0,1,0,0)");
      });
    },
    reset: function () {
      return this.each(function () {
        var t = $(this);
        t.attr("data-transform-scalex", 1);
        t.attr("data-transform-scaley", 1);
        t.attr("data-transform-skewx", 0);
        t.attr("data-transform-skewy", 0);
        t.attr("data-transform-rotate", 0);
        t.attr("data-transform", "matrix(1,0,0,1,0,0)");
        t.css("transform", "matrix(1,0,0,1,0,0)");
        fixiconsize(t);
      });
    },
    totalmatrix: function (args, args2) {
      var par = this.eq(0);
      var tm = [1, 0, 0, 1, 0, 0];
      var transform = false;
      var stopat = "body";
      if (args2 && args2 != "" && args2 != "inverse") {
        stopat = args2;
      }
      while (par && !par.is(stopat) && !par.is("body")) {
        var m = par.matrixToArray(true);
        if (m) {
          tm = mm(tm, m);
          transform = true;
        }
        par = par.parent();
      }
      if (args2 == "inverse") tm = imm(tm);
      if (!args || transform) return tm;
      else return false;
    },
    offset: function (args) {
      return jQuery.fn.tOffset.call(this, args);
    },
  };

  jQuery.fn.transformable = function (options, args, args2) {
    if (options && typeof options != "object") {
      var f = methods[options];
      if (f) return f.call(this, args, args2);
    }
    if (!options) options = {};
    if (options.containment === true || options.containment == "parent") {
      options.containscale = options.containskew = options.containrotate = true;
    }

    var tobj = {};
    return this.each(function () {
      var id = $(this).attr("id");
      var tf = $(this);
      // sizing icons is not ready for primetime on msie<9, use at own risk.
      if ($.support.matrixFilter) $.fn.transformable.defaults.sizeIcons = false;
      var o = $.extend({}, $.fn.transformable.defaults, options);

      tf.data("transformable-opts", o);
      tf.children(".transformable-handle").remove();
      if (o.rotatable) enablerotate(tf);
      if (o.skewable) enableskew(tf);
      if (o.scalable) enablescale(tf);
      var transform = $(this).css("transform");
      if (
        transform != undefined &&
        transform != "none" &&
        transform != "matrix(1,0,0,1,0,0)" &&
        transform != ""
      ) {
        $(this).attr("data-transform", transform);
        $(this).getTransform(true);
      }
      tf.bind("drag.transformable", function (e, ui) {
        jQuery.fn.transformable.drag.call(tf, e, ui);
      });
      tf.bind("dragstart.transformable", function (e, ui) {
        jQuery.fn.transformable.dragstart.call(tf, e, ui);
      });
      tf.bind("sort.transformable", function (e, ui) {
        jQuery.fn.transformable.sort.call(tf, e, ui);
      });
      tf.bind("sortstart.transformable", function (e, ui) {
        jQuery.fn.transformable.sortstart.call(tf, e, ui);
      });
      tf.bind("resize.transformable", function (e, ui) {
        jQuery.fn.transformable.resize.call(tf, e, ui);
      });
      //tf.bind('resizestart.transformable',function (e,ui) {jQuery.fn.transformable.resizestart.call(tf,e,ui);});
      tf.bind("resizecreate.transformable", function (e, ui) {
        var t = $(this);
        if (t.data("transformable-opts").scalable) {
          disablescale(t);
          enablescale(t);
        }
      });
    });
  };

  function fixevent(e) {
    if (e.pageX === undefined && e.originalEvent.pageX) {
      e.pageX = e.originalEvent.pageX;
      e.pageY = e.originalEvent.pageY;
    }
  }

  function enablescale(tf) {
    var ri; //=tf.children('.ui-resizable-se');
    //ri.unbind('.transformable');
    //if (ri.length) {
    //	ri.bind('dblclick.transformable',scdblclick);
    //} else {
    //moved to upper left, - forget double click thing
    tf.append(
      '<div class="transformable-handle-scale transformable-handle ui-icon ui-icon-search" title="Scale" style="left: 1px; top: 1px; position: absolute; z-index: 2000;"></div>'
    );
    ri = tf.children(".transformable-handle-scale");
    ri.bind("mousedown.scalable", scmousedown);
    //}
  }

  function disablescale(tf) {
    var h = tf.children(".transformable-handle-scale");
    h.remove();
    h = tf.children(".ui-resizable-se");
    h.unbind(".transformable");
  }
  /*
	function scdblclick(e) {
		e.stopImmediatePropagation();
		var ri=$(this);
		var tf=ri.parent();
		if (ri.hasClass('ui-resizable-se')) {
			//disabling resize hides icons of any children resizables as they inherit .ui-resizable-disabled
			//tf.resizable('option','disabled',true);
			//tf.children('.transformable-handle-scale').remove();
			if (tf.children('.transformable-handle-scale').length) 
				tf.children('.transformable-handle-scale').removeClass('transformable-disabled').show();
			else {
				tf.append('<div class="transformable-handle-scale transformable-handle ui-icon ui-icon-search" style="right: 1px; bottom: 1px; position: absolute; z-index: 2000;"></div>');
				tf.children('.transformable-handle-scale')
				  .bind('dblclick.transformable',scdblclick)
				  .bind('mousedown.scalable',scmousedown);
			}
			ri.addClass('transformable-disabled').hide();
		} else {
			tf.children('.transformable-handle-scale').addClass('transformable-disabled').hide();
			//tf.resizable('option','disabled',false);
			tf.children('.ui-resizable-se').removeClass('transformable-disabled').show()
			  .bind('dblclick.transformable',scdblclick);
		}
		return false;
	}
*/

  function enableskew(tf) {
    if (tf.attr("data-transform-skewx"))
      tf.setTransform("skewx", tf.attr("data-transform-skewx"));
    if (tf.attr("data-transform-skewy"))
      tf.setTransform("skewy", tf.attr("data-transform-skewy"));
    tf.append(
      '<div title="Skew x-axis" class="transformable-handle-skew-h transformable-handle-skew transformable-handle ui-icon ui-icon-arrow-2-e-w" style="left: 50%; top: 1px; position: absolute; z-index: 2000;"></div>'
    );
    tf.append(
      '<div title="Skew y-axis"class="transformable-handle-skew-v transformable-handle-skew transformable-handle ui-icon ui-icon-arrow-2-n-s" style="right: 1px; top: 50%; position: absolute; z-index: 2000;"></div>'
    );
    var h = tf.children(".transformable-handle-skew");
    h.mousedown(smousedown);
  }

  function disableskew(tf) {
    tf.children(".transformable-handle-skew").remove();
  }

  function enablerotate(tf) {
    tf.append(
      '<div title="Rotate" class="transformable-handle-rotate transformable-handle ui-icon ui-icon-arrowrefresh-1-s" style="right: 1px; top: 1px; position: absolute; z-index: 2000;"></div>'
    );
    if (tf.attr("data-transform-rotate"))
      tf.setTransform("rotate", tf.attr("data-transform-rotate"));
    var h = tf.children(".transformable-handle-rotate");
    h.mousedown(rmousedown);
  }

  function disablerotate(tf) {
    tf.children(".transformable-handle-rotate").remove();
  }

  jQuery.fn.setTransform = function (options, args) {
    return this.each(function () {
      var t = $(this),
        tt = t.getTransform(),
        xfirst = false,
        postop,
        posleft,
        posright,
        posbottom;
      if ($.support.matrixFilter) {
        postop = t.css("top");
        posleft = t.css("left");
        posright = t.css("right");
        posbottom = t.css("bottom");
      }
      if (options == "skewx") {
        tt.skew[0] = args;
        t.attr("data-transform-skewx", tt.skew[0]);
        xfirst = true;
      } else if (options == "skewy") {
        tt.skew[1] = args;
        t.attr("data-transform-skewy", tt.skew[1]);
      } else if (options == "rotate") {
        tt.rotate = args;
        t.attr("data-transform-rotate", tt.rotate);
      } else if (options == "scalex") {
        tt.scalex = args;
        t.attr("data-transform-scalex", tt.scalex);
      } else if (options == "scaley") {
        tt.scaley = args;
        t.attr("data-transform-scaley", tt.scaley);
      } else if (typeof options == "object") {
        var transform =
          "matrix(" +
          options[0].toFixed(16) +
          "," +
          options[1].toFixed(16) +
          "," +
          options[2].toFixed(16) +
          "," +
          options[3].toFixed(16) +
          "," +
          options[4].toFixed(16) +
          "," +
          options[5].toFixed(16) +
          ")";
        t.css("transform", transform);
        t.attr("data-transform", transform);
        if (
          options[0] != 1 ||
          options[1] != 0 ||
          options[2] != 0 ||
          options[3] != 1 ||
          options[4] != 0 ||
          options[5] != 0
        ) {
          t.addClass("istransformed");
        } else {
          t.removeClass("istransformed");
        }
        if ($.support.matrixFilter) {
          if (
            posbottom != "" &&
            posbottom != "auto" &&
            (postop == "" || postop == "0px")
          )
            t.css("bottom", posbottom);
          else t.css("top", postop);
          if (
            posright != "" &&
            posright != "auto" &&
            (posleft == "" || posleft == "0px")
          )
            t.css("right", posright);
          else t.css("left", posleft);
        }
        return;
      } else {
        var trans = options.split(")");
        if (!trans.length) return;
        for (var i = 0; i < trans.length; i++) {
          var split = trans[i].split("(");
          var prop = $.trim(split[0]).toLowerCase();
          var val = split[1];
          t.attr("data-transform-" + prop, val);
        }
        options = jQuery.fn.transformable.matrix(options);
        var transform =
          "matrix(" +
          options[0].toFixed(16) +
          "," +
          options[1].toFixed(16) +
          "," +
          options[2].toFixed(16) +
          "," +
          options[3].toFixed(16) +
          "," +
          options[4].toFixed(16) +
          "," +
          options[5].toFixed(16) +
          ")";
        t.css("transform", transform);
        t.attr("data-transform", transform);
        if (
          options[0] != 1 ||
          options[1] != 0 ||
          options[2] != 0 ||
          options[3] != 1 ||
          options[4] != 0 ||
          options[5] != 0
        ) {
          t.addClass("istransformed");
        } else {
          t.removeClass("istransformed");
        }
        if ($.support.matrixFilter) {
          if (
            posbottom != "" &&
            posbottom != "auto" &&
            (postop == "" || postop == "0px")
          )
            t.css("bottom", posbottom);
          else t.css("top", postop);
          if (
            posright != "" &&
            posright != "auto" &&
            (posleft == "" || posleft == "0px")
          )
            t.css("right", posright);
          else t.css("left", posleft);
        }
        return;
      }
      if (
        tt.rotate == 0 &&
        tt.skewy == 0 &&
        tt.skewx == 0 &&
        tt.scaley == 1 &&
        tt.scalex == 1
      )
        t.removeClass("istransformed");
      else t.addClass("istransformed");
      //options are applied in reverse order for some reason (matrix() is borrowed from jquery.transform)
      if (xfirst)
        options = jQuery.fn.transformable.matrix(
          "rotate(" +
            tt.rotate +
            ") skewY(" +
            tt.skew[1] +
            ") skewX(" +
            tt.skew[0] +
            ") scaleY(" +
            tt.scaley +
            ") scaleX(" +
            tt.scalex +
            ")"
        );
      else
        options = jQuery.fn.transformable.matrix(
          "rotate(" +
            tt.rotate +
            ") skewX(" +
            tt.skew[0] +
            ") skewY(" +
            tt.skew[1] +
            ") scaleY(" +
            tt.scaley +
            ") scaleX(" +
            tt.scalex +
            ")"
        );
      var transform =
        "matrix(" +
        options[0].toFixed(16) +
        "," +
        options[1].toFixed(16) +
        "," +
        options[2].toFixed(16) +
        "," +
        options[3].toFixed(16) +
        "," +
        options[4].toFixed(16) +
        "," +
        options[5].toFixed(16) +
        ")";
      t.css("transform", transform);
      t.attr("data-transform", transform);
      if ($.support.matrixFilter) {
        if (
          posbottom != "" &&
          posbottom != "auto" &&
          (postop == "" || postop == "0px")
        )
          t.css("bottom", posbottom);
        else t.css("top", postop);
        if (
          posright != "" &&
          posright != "auto" &&
          (posleft == "" || posleft == "0px")
        )
          t.css("right", posright);
        else t.css("left", posleft);
      }
    });
  };

  jQuery.fn.getTransform = function (reset) {
    var t = this.eq(0),
      r;
    if (reset) {
      r = $.unmatrix(t.matrixToArray());
      r.skewy = r.skew[1];
      r.skewx = r.skew[0];
      r.scalex = r.scale[0];
      r.scaley = r.scale[1];
      t.attr("data-transform-scalex", r.scalex);
      t.attr("data-transform-scaley", r.scaley);
      t.attr("data-transform-skewx", r.skewx);
      t.attr("data-transform-skewy", r.skewy);
      t.attr("data-transform-rotate", r.rotate);
    } else {
      r = {};
      r.skewx = parseFloat(t.attr("data-transform-skewx")) || 0;
      r.skewy = parseFloat(t.attr("data-transform-skewy")) || 0;
      r.rotate = parseFloat(t.attr("data-transform-rotate")) || 0;
      r.scalex = parseFloat(t.attr("data-transform-scalex")) || 1;
      r.scaley = parseFloat(t.attr("data-transform-scaley")) || 1;
      r.skew = [r.skewx, r.skewy];
      r.scale = [r.scalex, r.scaley];
    }
    return r;
  };

  function scmousedown(e) {
    e.stopImmediatePropagation();
    fixevent(e);
    tobj = {};
    var h = $(this);
    var t = (tobj.self = h.parent());
    opts = t.data("transformable-opts");
    var transform = tobj.self.getTransform(true);
    tobj.startScaleX = transform.scale[0];
    tobj.startScaleY = transform.scale[1];
    tobj.startX = e.pageX;
    tobj.startY = e.pageY;
    var o = (tobj.offset = t.tOffset());
    tobj.parent = t.parent();
    tobj.parentOffset = tobj.parent.tOffset();
    var a = o.corners[0].y - o.corners[1].y;
    var b = o.corners[0].x - o.corners[1].x;
    tobj.startWidth = Math.sqrt(a * a + b * b);
    if (transform.scale[0] < 0) tobj.startWidth = -tobj.startWidth;
    tobj.halfStartWidth = tobj.startWidth / 2;
    a = o.corners[0].y - o.corners[3].y;
    b = o.corners[0].x - o.corners[3].x;
    tobj.startHeight = Math.sqrt(a * a + b * b);
    if (transform.scale[1] < 0) tobj.startHeight = -tobj.startHeight;
    tobj.halfStartHeight = tobj.startHeight / 2;
    //prevent double neg flipping
    //tobj.startScaleXAbs=Math.abs(tobj.startScaleX);
    //tobj.startScaleYAbs=Math.abs(tobj.startScaleY);
    var ret = true;
    if (typeof opts.scaleStart == "function") {
      ret = opts.scaleStart.call(tobj.self, e, tobj);
    }
    if (!(ret === false)) {
      $(document).bind("mousemove.transformable", scmousemove);
      $(document).bind("mouseup.transformable", scmouseup);
      tobj.self.addClass("transformable-scaling");
    }
    return false;
  }
  function scmousemove(e) {
    e.stopImmediatePropagation();
    fixevent(e);
    var x = e.pageX,
      y = e.pageY;
    if (tobj.offset.transformed) {
      var points = $.singleLevelTP(
        [{ x: x, y: y }],
        { x: tobj.startX, y: tobj.startY },
        imm(tobj.offset.totalmatrix)
      );
      x = points[0].x;
      y = points[0].y;
    }
    //FIXME:  not working when you press shift in the middle, only if before
    if (e.shiftKey) x = y;
    if (!tobj.sx) {
      tobj.sx = x;
      tobj.sy = y;
    } //set start point and scale on second round
    tobj.scalex =
      tobj.startScaleX *
      (1 + (tobj.startScaleX * -(x - tobj.sx)) / tobj.halfStartWidth);
    tobj.scaley =
      tobj.startScaleY *
      (1 + (tobj.startScaleY * -(y - tobj.sy)) / tobj.halfStartHeight);
    var ret = true;
    var oldsy = tobj.self.attr("data-transform-scaley");
    var oldsx = tobj.self.attr("data-transform-scalex");
    if (typeof opts.scale == "function") {
      ret = opts.scale.call(tobj.self, e, tobj);
    }
    if (!(ret === false)) {
      tobj.self.setTransform("scalex", tobj.scalex);
      tobj.self.setTransform("scaley", tobj.scaley);
    }
    if (
      opts.containscale &&
      !iscontained(tobj.self, tobj.parent, tobj.parentOffset)
    ) {
      tobj.self.setTransform("scalex", oldsx);
      tobj.self.setTransform("scaley", oldsy);
    }

    return false;
  }

  function scmouseup(e) {
    e.stopImmediatePropagation();
    $(document).unbind("mousemove.transformable");
    $(document).unbind("mouseup.transformable");
    var opts = tobj.self.data("transformable-opts");
    var off = tobj.self.offset();
    tobj.self.removeClass("transformable-scaling");
    if (opts.sizeIcons) fixiconsize(tobj.self);
    if (typeof opts.scaleStop == "function") {
      opts.scaleStop.call(tobj.self, e, tobj);
    }
    return false;
  }

  function fixiconsize(el) {
    //keep our icons the same size.
    el.find(".ui-icon").each(function () {
      var t = $(this),
        tr;
      t.transformable("reset");
      tr = $.unmatrix(t.transformable("totalmatrix", false, "inverse"));
      t.setTransform("scalex", tr.scale[0]);
      t.setTransform("scaley", tr.scale[1]);
      if ($.support.matrixFilter) {
        if (t.hasClass("transformable-handle-skew-h"))
          t.css({ left: "50%", top: "1px" });
        if (t.hasClass("transformable-handle-skew-v"))
          t.css({ top: "50%", right: "1px", left: "auto" });
        if (t.hasClass("transformable-handle-rotate"))
          t.css({ top: "1px", right: "1px", left: "auto" });
        if (t.hasClass("transformable-handle-scale"))
          t.css({ bottom: "1px", right: "1px", left: "auto", top: "auto" });
        if (t.hasClass("ui-resizable-se"))
          t.css({ bottom: "1px", right: "1px", left: "auto", top: "auto" });
      }
    });
  }

  function smousedown(e) {
    e.stopImmediatePropagation();
    fixevent(e);
    tobj = {};
    var h = $(this);
    if (h.hasClass("transformable-handle-skew-v")) tobj.vert = 1;
    else tobj.vert = 0;
    var t = (tobj.self = h.parent());
    opts = t.data("transformable-opts");
    var angle = tobj.vert
      ? t.getTransform(true).skew[tobj.vert]
      : -t.getTransform(true).skew[tobj.vert];
    var toff = t.tOffset();
    tobj.parent = t.parent();
    tobj.parentOffset = tobj.parent.tOffset();
    var ptr = $.unmatrix(tobj.parentOffset.totalmatrix);
    if (ptr.scale[0] * ptr.scale[1] < 0) tobj.direction = -1;
    else tobj.direction = 1;
    if (!angle) angle = 0.0;
    tobj.startX = e.pageX;
    tobj.startY = e.pageY;
    tobj.offset = toff;
    tobj.center = toff.center;
    tobj.initialAngle = { rad: angle, deg: angle * radtodeg };
    tobj.angle = { rad: angle, deg: angle * radtodeg };
    tobj.zeroAngle =
      tobj.direction *
        Math.atan2(tobj.startY - tobj.center.y, tobj.startX - tobj.center.x) -
      tobj.initialAngle.rad;
    var retx = true,
      rety = true,
      ret = true;
    if (typeof opts.skewStart == "function") {
      ret = opts.skewStart.call(tobj.self, e, tobj);
    }
    if (typeof opts.skewYStart == "function" && tobj.vert) {
      rety = opts.skewYStart.call(tobj.self, e, tobj);
    }
    if (typeof opts.skewXStart == "function" && !tobj.vert) {
      retx = opts.skewXtart.call(tobj.self, e, tobj);
    }
    if (
      !(ret === false) &&
      ((tobj.vert && !(rety === false)) || (!tobj.vert && !(retx === false)))
    ) {
      $(document).bind("mousemove.transformable", smousemove);
      $(document).bind("mouseup.transformable", smouseup);
      tobj.self.addClass("transformable-skewing");
    }
    return false;
  }

  function smousemove(e) {
    e.stopImmediatePropagation();
    fixevent(e);
    var angle = Math.atan2(e.pageY - tobj.center.y, e.pageX - tobj.center.x);
    tobj.angle.rad = tobj.direction * angle - tobj.zeroAngle;
    while (tobj.angle.rad < -Math.PI) tobj.angle.rad += twopi;
    while (tobj.angle.rad >= Math.PI) tobj.angle.rad -= twopi;
    if (e.shiftKey) {
      var fifteenmod;
      fifteenmod = tobj.angle.rad % fifteen;
      tobj.angle.rad -= fifteenmod;
      if (fifteenmod > sevenpointfive) {
        tobj.angle.rad += fifteen;
      }
    }
    tobj.angle.deg = Math.round((tobj.angle.rad * 1800000) / Math.PI) / 10000;
    while (tobj.angle.deg > 180) tobj.angle.deg -= 360.0;
    while (tobj.angle.deg < -180) tobj.angle.deg += 360.0;
    var retx = true,
      rety = true;
    ret = true;
    if (typeof opts.skew == "function") {
      ret = opts.skew.call(tobj.self, e, tobj);
    }
    if (typeof opts.skewY == "function" && tobj.vert) {
      rety = opts.skewY.call(tobj.self, e, tobj);
    }
    if (typeof opts.skewX == "function" && !tobj.vert) {
      retx = opts.skewX.call(tobj.self, e, tobj);
    }
    var oldskew = tobj.vert
      ? tobj.self.attr("data-transform-skewy")
      : tobj.self.attr("data-transform-skewx");
    if (!(ret === false)) {
      if (tobj.vert && !(rety === false))
        tobj.self.setTransform("skewy", tobj.angle.rad);
      else if (!(retx === false))
        tobj.self.setTransform("skewx", -1.0 * tobj.angle.rad);
      else return false;
    }
    if (
      opts.containskew &&
      !iscontained(tobj.self, tobj.parent, tobj.parentOffset)
    ) {
      if (tobj.vert) {
        tobj.self.setTransform("skewy", oldskew);
      } else {
        tobj.self.setTransform("skewx", oldskew);
      }
    }
    return false;
  }

  function smouseup(e) {
    e.stopImmediatePropagation();
    $(document).unbind("mousemove.transformable");
    $(document).unbind("mouseup.transformable");
    var opts = tobj.self.data("transformable-opts");
    var off = tobj.self.offset();
    tobj.self.removeClass("transformable-skewing");
    if (opts.sizeIcons) fixiconsize(tobj.self);
    if (typeof opts.skewStop == "function") {
      opts.skewStop.call(tobj.self, e, tobj);
    }
    if (typeof opts.skewYStop == "function" && tobj.vert) {
      opts.skewYStop.call(tobj.self, e, tobj);
    }
    if (typeof opts.skewXStop == "function" && !tobj.vert) {
      opts.skewXStop.call(tobj.self, e, tobj);
    }
    tobj.self.removeClass("transformable-skewing");
    return false;
  }

  function rmousedown(e) {
    e.stopImmediatePropagation();
    fixevent(e);
    tobj = {};
    var h = $(this);
    var t = (tobj.self = h.parent());
    opts = t.data("transformable-opts");
    var toff = t.tOffset();
    tobj.parent = t.parent();
    tobj.parentOffset = tobj.parent.tOffset();
    var ptr = $.unmatrix(tobj.parentOffset.totalmatrix);
    if (ptr.scale[0] * ptr.scale[1] < 0) tobj.direction = -1;
    else tobj.direction = 1;
    tobj.startX = e.pageX;
    tobj.startY = e.pageY;
    tobj.center = toff.center;
    var angle = t.getTransform().rotate;
    if (!angle) angle = 0.0;
    tobj.initialAngle = { rad: angle, deg: angle * radtodeg };
    tobj.angle = { rad: angle, deg: angle * radtodeg };
    tobj.zeroAngle =
      tobj.direction *
        Math.atan2(tobj.startY - tobj.center.y, tobj.startX - tobj.center.x) -
      tobj.initialAngle.rad;
    var ret = true;
    if (typeof opts.rotateStart == "function") {
      ret = opts.rotateStart.call(tobj.self, e, tobj);
    }
    if (!(ret === false)) {
      $(document).bind("mousemove.transformable", rmousemove);
      $(document).bind("mouseup.transformable", rmouseup);
      tobj.self.addClass("transformable-rotating");
    }
    return false;
  }

  function rmousemove(e) {
    e.stopImmediatePropagation();
    fixevent(e);
    var angle = Math.atan2(e.pageY - tobj.center.y, e.pageX - tobj.center.x);
    tobj.angle.rad = tobj.direction * angle - tobj.zeroAngle;
    while (tobj.angle.rad < -Math.PI) tobj.angle.rad += twopi;
    while (tobj.angle.rad >= Math.PI) tobj.angle.rad -= twopi;
    if (e.shiftKey) {
      var fifteenmod;
      fifteenmod = tobj.angle.rad % fifteen;
      tobj.angle.rad -= fifteenmod;
      if (fifteenmod > sevenpointfive) {
        tobj.angle.rad += fifteen;
      }
    }
    tobj.angle.deg = Math.round((tobj.angle.rad * 1800000) / Math.PI) / 10000;
    while (tobj.angle.deg > 180) tobj.angle.deg -= 360.0;
    while (tobj.angle.deg < -180) tobj.angle.deg += 360.0;
    var ret = true;
    if (typeof opts.rotate == "function") {
      ret = opts.rotate.call(tobj.self, e, tobj);
    }
    var oldangle = tobj.self.attr("data-transform-rotate");
    if (!(ret === false)) tobj.self.setTransform("rotate", tobj.angle.rad);
    else return false;
    if (
      opts.containrotate &&
      !iscontained(tobj.self, tobj.parent, tobj.parentOffset)
    ) {
      tobj.self.setTransform("rotate", oldangle);
    }
    return false;
  }

  function rmouseup(e) {
    e.stopImmediatePropagation();
    $(document).unbind("mousemove.transformable");
    $(document).unbind("mouseup.transformable");
    var opts = tobj.self.data("transformable-opts");
    if (opts.sizeIcons) fixiconsize(tobj.self);
    if (typeof opts.rotateStop == "function") {
      opts.rotateStop.call(tobj.self, e, tobj);
    }
    var off = tobj.self.offset();
    tobj.self.removeClass("transformable-rotating");
    return false;
  }
  var orig_resize_mousestart = jQuery.ui.resizable.prototype._mouseStart;

  //need to get our offset before callback since mouseStart alters it
  jQuery.ui.resizable.prototype._mouseStart = function (event) {
    var so = this.element.tOffset();
    var c = this.options.containment;
    if (c == "parent") c = this.element.parent();
    else c = $(c);
    if (c[0] == this.element.parent()[0] && so.transformed) {
      this.element.data("parentcontained", true);
      this.element.data("parentoffset", this.element.parent().tOffset());
    } else if (this.element.data("parentcontained")) {
      this.element.removeData("parentcontained");
      this.element.removeData("parentoffset");
    }
    this.element.data("startoff", this.element.tOffset());
    this.element.data("startwidth", this.element.width());
    this.element.data("startheight", this.element.height());
    this.element.data("starttop", parseInt(this.element.css("top")));
    this.element.data("startleft", parseInt(this.element.css("left")));
    //very bad hack to stop resize_mousestart from setting position
    //even a quick change to an erroneous position can cause irratic behavior
    //when you are trying to find out where this.element is.
    //browsers won't set position if it is not recognizable
    var oldpos = $.fn.position;
    var self = this.element;
    $.fn.position = function () {
      if (this[0] != self[0]) return oldpos.call(this);
      $.fn.position = oldpos;
      return {
        left: "junk-from-transformable",
        top: "junk-from-transformable",
      };
    };
    var ret = orig_resize_mousestart.call(this, event);
    $.fn.position = oldpos;
    return ret;
  };

  //fix the direction of our drag:
  var orig_resize_drag = jQuery.ui.resizable.prototype._mouseDrag;
  jQuery.ui.resizable.prototype._mouseDrag = function (event) {
    fixevent(event);
    var w,
      h,
      c,
      smp = this.originalMousePosition,
      contained = this.element.data("parentcontained");
    //move where we thought we were (given no rotation) to where we actually were (with rotation)
    //with minimal disruption to resize_drag
    var c = this.element.data("startoff");
    var points = [{ x: smp.left, y: smp.top }];
    //move our original mouse position in line at an appropriate angle
    //centered around our current mouse position
    //this is backwards thinking but it works
    if (c && c.transformed)
      points = $.singleLevelTP(
        points,
        { x: event.pageX, y: event.pageY },
        imm(c.totalmatrix)
      );
    this.originalMousePosition = { left: points[0].x, top: points[0].y };
    if (contained) {
      c = this.options.containment;
      this.options.containment = false;
      w = this.element.width();
      h = this.element.height();
    }

    orig_resize_drag.call(this, event);
    if (contained) {
      this.options.containment = c;
      if (this.element.data("resizeoutofbounds")) {
        this.element.width(w);
        this.element.height(h);
        var startoff = this.element.data("startoff");
        var off = this.element.tOffset();
        var newoff = {
          left: startoff.corners[0].x + (off.left - off.corners[0].x),
          top: startoff.corners[0].y + (off.top - off.corners[0].y),
        };
        this.element.tOffset(newoff);
      }
    }
    this.originalMousePosition = smp;
    //console.log(event);
  };

  jQuery.fn.transformable.resize = function (e, ui) {
    e.stopPropagation();
    var t = $(this);
    var axis = t.data("ui-resizable").axis;
    var startoff = t.data("startoff");
    var off = t.tOffset();
    if (!startoff) return;
    var newoff = {
      left: startoff.corners[0].x + (off.left - off.corners[0].x),
      top: startoff.corners[0].y + (off.top - off.corners[0].y),
    };
    t.tOffset(newoff);
    //other handles besides se
    if (axis == "w" || axis == "nw" || axis == "sw") {
      var dx = t.width() - t.data("startwidth");
      t.css("left", t.data("startleft") - dx + "px");
    }
    if (axis == "n" || axis == "nw" || axis == "ne") {
      var dy = t.height() - t.data("startheight");
      t.css("top", t.data("starttop") - dy + "px");
    }

    if (!iscontained(t, t.parent(), t.data("parentoffset"))) {
      t.data("resizeoutofbounds", true);
    } else t.removeData("resizeoutofbounds");
  };

  jQuery.fn.transformable.dragstart = function (e, ui) {
    if (!ui) return false; //somehow this function is getting triggered on a resizable with transformable set and no draggable
    e.stopPropagation();
    fixevent(e);
    var t = $(this);
    t.tDragStart(e.pageX, e.pageY, true);
  };

  jQuery.fn.transformable.sortstart = function (e, ui) {
    if (!ui) return false; //somehow this function is getting triggered on a resizable with transformable set and no draggable
    e.stopPropagation();
    fixevent(e);
    var t = ui.item; // this is the container of all the items.  ui.item is the one being dragged
    t.tDragStart(e.pageX, e.pageY, true, true);
  };

  $.fn.tDragStart = function (x, y, skipuntransformed, hasoffset) {
    let c;
    var self = this;
    self.each(function (i) {
      var t = self.eq(i);
      var tr;
      if (!hasoffset) {
        tr = t.tOffset();
        t.data("startoff", tr);
      } else {
        tr = t.data("startoff");
      }
      if (!tr.transformed && skipuntransformed) {
        t.removeData("startoff");
        return;
      }
      t.data("mousepos", { x: x, y: y });
      t.removeData("transformable-dragrange");
      var container = t.draggable("option", "containment");
      //why are we getting self as container?  When did that start?
      if (container[0] && container[0] == t[0]) container = t.parent();
      if (container == "parent") container = t.parent();
      // this only works if container is the parent
      if (
        typeof c != "array" &&
        (container == t.parent()[0] || container[0] == t.parent()[0])
      ) {
        container = $(container);
        c = container.tOffset();
        t.data("parentoff", c);
        var pcn = c.corners;
        //the dim of the box being constrained
        var boxdim = t.tOffset();
        var boxcn = boxdim.corners;
        //rotate all our points back to parent rotation=0
        pcn = pcn.concat(boxcn);
        pcn.push({ x: x, y: y });
        pcn = untransformPoints(pcn, container);
        t.data("umousepos", pcn.pop());
        boxcn = pcn.splice(4, 4);
        //top,bottom,left,right of a box containing our rotated/skewed box (bounding box)
        var tc, lc, bc, rc;
        // calculate a bounding box for our box;
        for (var i = 0; i < 4; i++) {
          var tcn = boxcn[i];
          if (i) {
            if (tcn.x < lc) lc = tcn.x;
            if (tcn.y < tc) tc = tcn.y;
            if (tcn.x > rc) rc = tcn.x;
            if (tcn.y > bc) bc = tcn.y;
          } else {
            lc = rc = tcn.x;
            tc = bc = tcn.y;
          }
        }
        var range = {};
        range.tl = { x: lc, y: tc };
        range.parenttl = pcn[0];
        range.r = pcn[1].x - borderWidth(container, "right") - rc;
        range.l = lc - (pcn[0].x + borderWidth(container, "left"));
        range.t = tc - (pcn[0].y + borderWidth(container, "top"));
        range.b = pcn[3].y - borderWidth(container, "bottom") - bc;
        t.data("transformable-dragrange", range);
      }
      t.data("dragstarted", 1);
    });
  };

  //msie <v9 wont let us set position to blank, and this is proper anyway:
  //var orig_draggable_drag=jQuery.ui.resizable.prototype._mouseDrag;
  function tMouseDrag(event, noPropagation) {
    this.position = this._generatePosition(event);
    this.positionAbs = this._convertPositionTo("absolute");
    //Call plugins and callbacks and use the resulting position if something is returned
    if (!noPropagation) {
      var ui = this._uiHash();
      //if it gets cancelled in a weird way, scrollParent will be undefined and cause error in jquery-uiiiiiiii
      if (
        ($(ui.helper).data("draggable") &&
          !$(ui.helper).data("draggable").scrollParent) ||
        this._trigger("drag", event, ui) === false
      ) {
        this._mouseUp({});
        return false;
      }
      this.position = ui.position;
    }
    // if transformed, don't update, already done in callback below
    if (!this.element.data("startoff")) {
      if (!this.options.axis || this.options.axis != "y")
        this.helper[0].style.left = this.position.left + "px";
      if (!this.options.axis || this.options.axis != "x")
        this.helper[0].style.top = this.position.top + "px";
    }
    if ($.ui.ddmanager) $.ui.ddmanager.drag(this, event);
    return false;
  }

  jQuery.ui.draggable.prototype._mouseDrag = tMouseDrag;

  //get offset before sortstart, in sortstart it has been moved to wrong position already
  var orig_sortable_mouseStart = jQuery.ui.sortable.prototype._mouseStart;
  jQuery.ui.sortable.prototype._mouseStart = function (
    event,
    OverrideHandle,
    noActivation
  ) {
    this.currentItem.data("startoff", this.currentItem.tOffset());
    orig_sortable_mouseStart.call(this, event, OverrideHandle, noActivation);
  };

  // tsnapstart and tsnapdrag copied from jquery-uiiiiiiii 1.8.16 and altered using tOffset()
  function tsnapstart(event, ui) {
    var el = $(this);
    var i = el.data("draggable"),
      o = i.options;
    i.snapElements = [];
    var inst = el.data("draggable");
    var toff = el.tOffset();
    el.data("tWidth", toff.right - toff.left);
    el.data("tHeight", toff.bottom - toff.top);
    $(
      o.snap.constructor != String ? o.snap.items || ":data(draggable)" : o.snap
    ).each(function () {
      var $t = $(this);
      var $o = $t.tOffset();
      if (this != i.element[0])
        i.snapElements.push({
          item: this,
          width: $o.right - $o.left,
          height: $o.bottom - $o.top,
          top: $o.top,
          left: $o.left,
        });
    });
  }

  function tsnapdrag(event, ui) {
    var el = $(this);

    var inst = el.data("draggable"),
      o = inst.options;
    var d = o.snapTolerance;
    var x1 = ui.offset.left,
      x2 = x1 + el.data("tWidth"),
      y1 = ui.offset.top,
      y2 = y1 + el.data("tHeight");

    el.removeData("snapleft");
    el.removeData("snaptop");
    for (var i = inst.snapElements.length - 1; i >= 0; i--) {
      var l = inst.snapElements[i].left,
        r = l + inst.snapElements[i].width,
        t = inst.snapElements[i].top,
        b = t + inst.snapElements[i].height;
      //Yes, I know, this is insane ;)
      // but FUN!
      if (
        !(
          (l - d < x1 && x1 < r + d && t - d < y1 && y1 < b + d) ||
          (l - d < x1 && x1 < r + d && t - d < y2 && y2 < b + d) ||
          (l - d < x2 && x2 < r + d && t - d < y1 && y1 < b + d) ||
          (l - d < x2 && x2 < r + d && t - d < y2 && y2 < b + d)
        )
      ) {
        if (inst.snapElements[i].snapping)
          inst.options.snap.release &&
            inst.options.snap.release.call(
              inst.element,
              event,
              $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })
            );
        inst.snapElements[i].snapping = false;
        continue;
      }
      if (o.snapMode != "inner") {
        var ts = Math.abs(t - y2) <= d;
        var bs = Math.abs(b - y1) <= d;
        var ls = Math.abs(l - x2) <= d;
        var rs = Math.abs(r - x1) <= d;
        if (ts) el.data("snaptop", t - el.data("tHeight"));
        if (bs) el.data("snaptop", b);
        if (ls) el.data("snapleft", l - el.data("tWidth"));
        if (rs) el.data("snapleft", r);
      }

      var first = ts || bs || ls || rs;

      if (o.snapMode != "outer") {
        var ts = Math.abs(t - y1) <= d;
        var bs = Math.abs(b - y2) <= d;
        var ls = Math.abs(l - x1) <= d;
        var rs = Math.abs(r - x2) <= d;
        if (ts) el.data("snaptop", t);
        if (bs) el.data("snaptop", b - el.data("tHeight"));
        if (ls) el.data("snapleft", l);
        if (rs) el.data("snapleft", r - el.data("tWidth"));
      }

      if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
        inst.options.snap.snap &&
          inst.options.snap.snap.call(
            inst.element,
            event,
            $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })
          );
      inst.snapElements[i].snapping = ts || bs || ls || rs || first;
    }
  }

  var snapstart;
  var snapdrag;
  //replace snapstart
  for (var i = 0; i < jQuery.ui.draggable.prototype.plugins.start.length; i++) {
    if (jQuery.ui.draggable.prototype.plugins.start[i][0] == "snap") {
      snapstart = jQuery.ui.draggable.prototype.plugins.start[i][1];
      jQuery.ui.draggable.prototype.plugins.start[i][1] = function (event, ui) {
        if (this.tOffset().transformed) {
          tsnapstart.call(this, event, ui);
        } else snapstart.call(this, event, ui);
      };
      break;
    }
  }

  //replace snapdrag
  for (var i = 0; i < jQuery.ui.draggable.prototype.plugins.drag.length; i++) {
    if (jQuery.ui.draggable.prototype.plugins.drag[i][0] == "snap") {
      snapdrag = jQuery.ui.draggable.prototype.plugins.drag[i][1];
      jQuery.ui.draggable.prototype.plugins.drag[i][1] = function (event, ui) {
        if (this.data("startoff")) {
          tsnapdrag.call(this, event, ui);
        } else snapdrag.call(this, event, ui);
      };
      break;
    }
  }

  // fix for msie <v9 draggable div in draggable div problem ( http://dev.jquery-uiiiiiiii.com/ticket/4333 )
  // credit to someone I cannot remember or find.  Nice, but requires inverted thinking.
  if ($.browser.msie && $.browser.version < 9)
    $.extend(
      $.ui.draggable.prototype,
      (function (orig) {
        return {
          _mouseCapture: function (event) {
            var result = orig.call(this, event);
            if (result) event.stopPropagation();
            return result;
          },
        };
      })($.ui.draggable.prototype["_mouseCapture"])
    );

  jQuery.fn.transformable.drag = function (e, ui) {
    e.stopPropagation();
    fixevent(e);
    var t = $(this);
    t.tDrag(e.pageX, e.pageY, ui);
  };

  jQuery.fn.transformable.sort = function (e, ui) {
    e.stopPropagation();
    fixevent(e);
    var t = ui.item;
    t.tDrag(e.pageX, e.pageY, ui);
  };

  $.fn.tDrag = function (x1, y1, ui) {
    var self = this;
    self.each(function (i) {
      var t = self.eq(i);
      var x = x1,
        y = y1;
      var startoff = t.data("startoff");
      if (!startoff) return;
      var startm = t.data("mousepos");
      //offset is being changed between dragstart and drag
      if (t.data("dragstarted")) {
        t.tOffset(startoff);
        t.removeData("dragstarted");
      }
      var range = t.data("transformable-dragrange");
      //recheck if containment has been turned off after drag started.
      //if(t.hasClass('ui-draggable-dragging') && !t.data("draggable").containment) range=false;
      var delta;
      if (range) {
        //untransform delta so we can deal with vertical and horizontal limits
        var poff = t.data("parentoff");
        var ustartm = t.data("umousepos");
        var points = untransformPoints([{ x: x, y: y }], t.parent());
        delta = { x: points[0].x - ustartm.x, y: points[0].y - ustartm.y };
        x = points[0].x;
        y = points[0].y;
        if (delta.x > range.r) {
          x = range.r + ustartm.x;
        }
        if (delta.x < -range.l) {
          x = ustartm.x - range.l;
        }
        if (delta.y > range.b) {
          y = ustartm.y + range.b;
        }
        if (delta.y < -range.t) {
          y = ustartm.y - range.t;
        }
        // now put them back into transformed coord
        points = transformPoints([{ x: x, y: y }], t.parent());
        delta = { x: points[0].x - startm.x, y: points[0].y - startm.y };
      } else {
        delta = { x: x - startm.x, y: y - startm.y };
      }

      var tp, lf;

      if (ui) {
        ui.delta = delta;
        ui.mousepos = {
          left: startm.left + delta.x,
          top: startm.top + delta.y,
        };
        var sl = t.data("snapleft");
        lf = sl ? sl : startoff.left + delta.x;
        var st = t.data("snaptop");
        tp = st ? st : startoff.top + delta.y;
        ui.offset = { left: lf, top: tp };
      } else {
        lf = startoff.left + delta.x;
        tp = startoff.top + delta.y;
      }
      t.tOffset({
        left: lf,
        top: tp,
      });
    });
  };

  jQuery.fn.tIsContained = function (p, poff, toff, where) {
    return iscontained(this.eq(0), p, poff, toff, where);
  };
  // a generic function to see if t is within the bounds of its parent
  // requres t, but can be sped up if you have toff,p,and/or poff
  function iscontained(t, p, poff, toff, where) {
    var pcn, boxcn;
    if (!p) p = t.parent();
    if (poff && poff.innercorners) {
      pcn = $.extend(true, [], poff.innercorners);
    } else {
      poff = p.tOffset(true);
      pcn = poff.innercorners;
    }
    if (!poff || !poff.innercorners) return true;
    if (toff && toff.corners) {
      boxcn = $.extend(true, [], toff.corners);
    } else {
      toff = t.tOffset();
      boxcn = toff.corners;
    }
    pcn = pcn.concat(boxcn);
    pcn = untransformPoints(pcn, p);
    boxcn = pcn.splice(4, 4);
    var tc, lc, bc, rc;
    for (var i = 0; i < 4; i++) {
      var tcn = boxcn[i];
      if (i) {
        if (tcn.x < lc) lc = tcn.x;
        if (tcn.y < tc) tc = tcn.y;
        if (tcn.x > rc) rc = tcn.x;
        if (tcn.y > bc) bc = tcn.y;
      } else {
        lc = rc = tcn.x;
        tc = bc = tcn.y;
      }
    }
    if (!where) {
      if (lc > pcn[0].x && rc < pcn[1].x && tc > pcn[0].y && bc < pcn[3].y)
        return true;
      return false;
    } else {
      if (lc <= pcn[0].x) return "left";
      if (rc >= pcn[1].x) return "right";
      if (tc <= pcn[0].y) return "top";
      if (bc >= pcn[3].y) return "bottom";
      return true;
    }
  }

  function xytostr(n) {
    return parseInt(n.x - 81) + "," + parseInt(n.y - 151);
  } //for logging
  function lttostr(n) {
    return n.left - 81 + "," + (n.top - 151);
  }

  // place element relative distance from the top left of rel;
  jQuery.fn.relativeOffset = function (rel, options) {
    if (!rel.length || !options) return this;
    var o = rel.untransformedOffset();
    /* unused and untested
		if(!options.left||!options.top){
			var relpoint;
			return this.each (function (){
				var t=$(this);
				var tuoff=t.untransformedOffset();
				if(options.left) {
					var relpoint=[{x: o.left+options.left, y: tuoff.top}];
					relpoint=transformPoints(relpoint,rel);
				} else {
					var relpoint=[{x: tuoff.left, y: o.top+options.top}];
					relpoint=transformPoints(relpoint,rel);
				}	
				t.tOffset({left:relpoint[0].x, top: relpoint[0].y},true);
			});
		}
*/
    //console.log("started with "+(o.left)+','+(o.top));
    var relpoint = [{ x: o.left + options.left, y: o.top + options.top }];
    relpoint = transformPoints(relpoint, rel);
    return this.each(function () {
      var t = $(this);
      //console.log("setting rel position="+relpoint[0].x+','+relpoint[0].y);
      t.tOffset({ left: relpoint[0].x, top: relpoint[0].y }, true);
    });
  };

  jQuery.fn.tOffset = function (options, o2) {
    if (
      options &&
      typeof options == "object" &&
      (options.left || options.top)
    ) {
      //if o2 is true - use left top corner for placement
      return this.each(function () {
        var t = $(this);
        if (!options.left && !options.top) return;
        var toff = t.tOffset();
        if (options.left === undefined) options.left = toff.left;
        if (options.top === undefined) options.top = toff.top;
        var o = t.untransformedOffset();
        var topleft = [{ x: o.left, y: o.top }];
        var par = t.parent();
        topleft = transformPoints(topleft, par);
        var xoff = topleft[0].x - (o2 ? toff.corners[0].x : toff.left);
        var yoff = topleft[0].y - (o2 ? toff.corners[0].y : toff.top);
        //with untransformed offset we will be setting the point of the top left corner
        //so we need to compensate for its distance from the top left of the bounding box
        //think of a diamond inside of an unrotated rectangle.  Diamond is our box, rectangle is bounding box
        var points = [{ x: options.left + xoff, y: options.top + yoff }];
        points = untransformPoints(points, t.parent());
        t.untransformedOffset({ left: points[0].x, top: points[0].y });
      });
    } else {
      var t = this.eq(0);
      if (!t.length) return;
      var par;
      var selector = false;
      //look for el.tOffset(true,'.class');
      if (typeof options == "boolean") selector = o2;
      //look for el.tOffset('.class',true) as well
      else if (typeof o2 == "boolean" || o2 === undefined) {
        selector = options;
        options = o2;
      }
      var off = t.untransformedOffset();
      //console.log("offset");
      //console.log(t.offset());
      //console.log("untransformedOffset()");
      //console.log(off);
      if (t.is("body")) {
        off.totalmatrix = [1, 0, 0, 1, 0, 0];
        off.matrix = [1, 0, 0, 1, 0, 0];
        off.bottom = off.top + t.height();
        off.right = off.left + t.width();
        off.center = {
          x: (off.left + off.right) / 2,
          y: (off.top + off.bottom) / 2,
        };
        off.corners = [
          { x: off.left, y: off.top },
          { x: off.right, y: off.top },
          { x: off.right, y: off.bottom },
          { x: off.left, y: off.bottom },
        ];
        off.transformed = false;
        if (options === true) off.innercorners = off.corners;
        return off;
      }
      //we want a copy, not a reference
      var unrotated = { left: off.left, top: off.top };
      var center = {},
        h = t.outerHeight(),
        w = t.outerWidth();

      //center.x=off.left+(w/2.0);
      //center.y=off.top+(h/2.0);

      center = getOrigin(t);
      //arrange corners clockwise starting with top,left
      //find position of each corner and get t,l,b,r after rotation
      var corners = [
        { x: off.left, y: off.top }, //top,left
        { x: off.left + w, y: off.top }, //top,right
        { x: off.left + w, y: off.top + h }, //bottom,right
        { x: off.left, y: off.top + h },
      ]; //bottom,left
      var innercorners;
      if (options === true) {
        var bw = borderWidth(t, "all");
        var iw = t.innerWidth(),
          ih = t.innerHeight();
        innercorners = [
          { x: off.left + bw.left, y: off.top + bw.top }, //top,left
          { x: off.left + bw.left + iw, y: off.top + bw.top }, //top,right
          { x: off.left + bw.left + iw, y: off.top + bw.top + ih }, //bottom,right
          { x: off.left + bw.left, y: off.top + bw.top + ih },
        ]; //bottom,left
      }
      var tm = t.matrixToArray(true);
      if ($.browser.msie && $.browser.version < 9) {
        tm[4] = 0;
        tm[5] = 0;
      }
      if (tm) {
        corners = $.singleLevelTP(corners, center, tm);
        if (options === true)
          innercorners = $.singleLevelTP(innercorners, center, tm);
      } else tm = [1, 0, 0, 1, 0, 0];
      var sm = tm;
      //for convenience, push center into array
      //corners.push(center);
      par = t.parent();
      //adjust our points by the transform of all our parents
      // need to get tm, so use this instead of transformPoints
      //stop at selector, if provided
      while (
        par.length &&
        !par.is("body") &&
        (!selector || !par.is(selector))
      ) {
        var m = par.matrixToArray(true);
        if (m) {
          var cn = getOrigin(par);
          corners = $.singleLevelTP(corners, cn, m);
          if (options === true)
            innercorners = $.singleLevelTP(innercorners, cn, m);
          tm = mm(tm, m);
        }
        par = par.parent();
      }
      //find topmost and leftmost points
      for (var i = 0; i < corners.length; i++) {
        var c = corners[i];
        if (i == 0) {
          off.top = off.bottom = c.y;
          off.left = off.right = c.x;
        } else {
          if (c.y > off.bottom) off.bottom = c.y;
          if (c.y < off.top) off.top = c.y;
          if (c.x > off.right) off.right = c.x;
          if (c.x < off.left) off.left = c.x;
        }
      }

      off.center = {
        x: (off.left + off.right) / 2,
        y: (off.top + off.bottom) / 2,
      };
      off.corners = corners;
      if (options === true) off.innercorners = innercorners;
      off.untransformed = unrotated;
      off.matrix = sm;
      off.totalmatrix = tm;
      //jquery.transform.js emulates tx and ty for msie, but that messes with our calcs
      if ($.browser.msie && $.browser.version < 9) {
        tm[4] = 0;
        tm[5] = 0;
        sm[4] = 0;
        sm[5] = 0;
      }
      //offset.trasformed will be true if element or any of its parents are transformed
      if (
        tm[0] == 1 &&
        tm[1] == 0 &&
        tm[2] == 0 &&
        tm[3] == 1 &&
        tm[4] == 0 &&
        tm[5] == 0
      )
        off.transformed = false;
      else off.transformed = true;
      //element will get this class if it is transformed, without regart to parents
      if (
        sm[0] == 1 &&
        sm[1] == 0 &&
        sm[2] == 0 &&
        sm[3] == 1 &&
        sm[4] == 0 &&
        sm[5] == 0
      )
        t.removeClass("istransformed");
      else t.addClass("istransformed");
      return off;
    }
  };

  //looks counter intuitive, but if we can scroll left, then a scroll bar appears at the bottom
  // so its x that needs to be compensated.

  function testscroll(el) {
    ret = { y: false, x: false };
    if (el[0].scrollTop || el.css("overflow-y") == "scroll") {
      ret.x = true;
    } else if (el.css("overflow-x") == "auto") {
      el[0].scrollTop += 1;
      if (el[0].scrollTop) ret.x = true;
      el[0].scrollTop -= 1;
    }
    if (el[0].scrollLeft || el.css("overflow-x") == "scroll") {
      ret.y = true;
    } else if (el.css("overflow-y") == "auto") {
      el[0].scrollLeft += 1;
      if (el[0].scrollLeft) ret.y = true;
      el[0].scrollLeft -= 1;
    }
    return ret;
  }

  function getOrigin(el) {
    var ur = el.untransformedOffset(),
      cx,
      cy;
    var origin = el.css(vpref + "transform-origin");
    //short ver, probably used every time.
    if (usespx) {
      var o = origin.match(/([\-\d\.]+)px\s+([\-\d\.]+)px/);
      if (o && o.length == 3) {
        //webkit measures from inside, firefox from outside.
        var dw = 0,
          dh = 0;
        if (!originusesborder) {
          var bw = borderWidth(el, "all");
          dw = (bw.left + bw.right) / 2;
          dh = (bw.top + bw.bottom) / 2;
        }
        if (originMovesWithScrollBar) {
          var scr = testscroll(el);
          if (scr.y) dh += originMovesWithScrollBar;
          if (scr.x) dw += originMovesWithScrollBar;
        }
        //our origin should move with padding, as the element will grow by that amount
        //chrome fails to do so, so we must compensate
        if (!originMovesWithPadding) {
          dh +=
            parseInt(el.css("padding-top")) / 2 +
            parseInt(el.css("padding-bottom")) / 2;
          dw +=
            parseInt(el.css("padding-left")) / 2 +
            parseInt(el.css("padding-right")) / 2;
        }
        return {
          x: ur.left + parseFloat(o[1]) + dw,
          y: ur.top + parseFloat(o[2]) + dh,
        };
      }
    }

    //long ver
    if (origin && origin != "" && origin != "50% 50%") {
      //webkit and firefox seem to return px consistantly regardless of how set.
      //that's expected, but just in case, look for % too.
      var o = origin.match(/([\-\d\.]+)px\s+/);
      var dw = 0,
        dh = 0;
      if (!originusesborder) {
        var bw = borderWidth(el, "all");
        dw = (bw.left + bw.right) / 2;
        dh = (bw.top + bw.bottom) / 2;
      }
      if (o && o.length == 2) {
        cx = parseFloat(o[1]) + dw;
      } else {
        o = origin.match(/([\-\d\.]+)\%\s+/);
        var ow = el.outerWidth();
        if (o && o.length == 2) cx = (parseFloat(o[1]) / 100) * ow;
        else cx = ow / 2;
      }
      o = origin.match(/[\-\d\.]+\S+\s+([\-\d\.]+)px/);
      if (o && o.length == 2) {
        cy = parseFloat(o[1]) + dh;
      } else {
        o = origin.match(/[\-\d\.]+\S+\s+([\-\d\.]+)\%/);
        var oh = el.outerHeight();
        if (o && o.length == 2) cy = (parseFloat(o[1]) / 100) * oh;
        else cy = oh / 2;
      }
    } else {
      cx = el.outerWidth() / 2;
      cy = el.outerHeight() / 2;
    }

    return { x: ur.left + cx, y: ur.top + cy };
  }

  jQuery.fn.transformPoints = function (points) {
    return transformPoints(points, $(this));
  };

  function transformPoints(points, t) {
    var par = t;
    while (par && !par.is("body")) {
      var m = par.matrixToArray(true);
      if (m) {
        var ur = par.untransformedOffset();
        var cn = {
          x: ur.left + par.outerWidth() / 2.0,
          y: ur.top + par.outerHeight() / 2.0,
        };
        cn = getOrigin(par);
        points = $.singleLevelTP(points, cn, m);
      }
      par = par.parent();
    }
    return points;
  }

  jQuery.fn.untransformPoints = function (points) {
    return untransformPoints(points, $(this));
  };

  function untransformPoints(points, t) {
    var pars = [],
      ms = [];
    var par = t;
    while (par && !par.is("body")) {
      var part = par.matrixToArray(true);
      if (part) {
        pars.unshift(par);
        ms.unshift(part);
      }
      var par = par.parent();
    }
    if (!pars.length) return points;
    for (i = 0; i < pars.length; i++) {
      /*
			var center={},poff=pars[i].untransformedOffset();
			center.x=parseFloat(poff.left)+(parseFloat(pars[i].outerWidth())/2.0);
			center.y=parseFloat(poff.top)+(parseFloat(pars[i].outerHeight())/2.0);
			tpoints=$.singleLevelTP(tpoints, getOrigin(pars[i]), imm(ms[i]));
*/
      points = $.singleLevelTP(points, getOrigin(pars[i]), imm(ms[i]));
    }
    return points;
  }

  jQuery.singleLevelTP = function (points, center, transform) {
    if (transform === false) return points;
    var m;
    if (typeof transform != "object")
      m = jQuery.fn.transformable.matrix(transform); //a,b,c,d,x,y
    else m = transform;
    for (var i = 0; i < points.length; i++) {
      var c = points[i];
      var xpos = c.x - center.x;
      var ypos = c.y - center.y;
      c.x = center.x + m[0] * xpos + m[2] * ypos + m[4];
      c.y = center.y + m[1] * xpos + m[3] * ypos + m[5];
    }
    return points;
  };

  //borrowed from jquery.transform.js
  jQuery.fn.transformable.matrix = function (transform, m) {
    transform = transform.split(")");
    var trim = $.trim,
      // last element of the array is an empty string, get rid of it
      i = transform.length - 1,
      split,
      prop,
      val,
      A = m ? m[0] : 1,
      B = m ? m[1] : 0,
      C = m ? m[2] : 0,
      D = m ? m[3] : 1,
      A_,
      B_,
      C_,
      D_,
      tmp1,
      tmp2,
      X = m ? m[4] : 0,
      Y = m ? m[5] : 0;
    // Loop through the transform properties, parse and multiply them

    while (i--) {
      split = transform[i].split("(");
      prop = trim(split[0]);
      val = split[1];
      A_ = B_ = C_ = D_ = 0;
      switch (prop) {
        case "translateX":
          X += parseInt(val, 10);
          continue;

        case "translateY":
          Y += parseInt(val, 10);
          continue;

        case "translate":
          val = val.split(",");
          X += parseInt(val[0], 10);
          Y += parseInt(val[1] || 0, 10);
          continue;

        case "rotate":
          val = toRadian(val);
          A_ = Math.cos(val);
          B_ = Math.sin(val);
          C_ = -Math.sin(val);
          D_ = Math.cos(val);
          break;

        case "scaleX":
          A_ = val;
          D_ = 1;
          break;

        case "scaleY":
          A_ = 1;
          D_ = val;
          break;

        case "scale":
          val = val.split(",");
          A_ = val[0];
          D_ = val.length > 1 ? val[1] : val[0];
          break;

        case "skewX":
          A_ = D_ = 1;
          C_ = Math.tan(toRadian(val));
          break;

        case "skewY":
          A_ = D_ = 1;
          val = toRadian(val);
          B_ = Math.tan(val);
          break;

        case "skew":
          A_ = D_ = 1;
          val = val.split(",");
          C_ = Math.tan(toRadian(val[0]));
          B_ = Math.tan(toRadian(val[1] || 0));
          break;

        case "matrix":
          val = val.split(",");
          A_ = +val[0];
          B_ = +val[1];
          C_ = +val[2];
          D_ = +val[3];
          X += parseInt(val[4], 10);
          Y += parseInt(val[5], 10);
      }
      // Matrix product
      tmp1 = A * A_ + B * C_;
      B = A * B_ + B * D_;
      tmp2 = C * A_ + D * C_;
      D = C * B_ + D * D_;
      A = tmp1;
      C = tmp2;
    }
    return [A, B, C, D, X, Y];
  };

  function toRadian(value) {
    return ~value.indexOf("deg")
      ? parseInt(value, 10) * ((Math.PI * 2) / 360)
      : ~value.indexOf("grad")
      ? parseInt(value, 10) * (Math.PI / 200)
      : parseFloat(value);
  }

  //this code is called once and then sets itself to the proper function given the browser's behavior
  jQuery.fn.untransformedOffset = function (options) {
    var t = this.eq(0);
    //position uses offset, so we'll know comparing to css if pos is uncorrected for rotation
    //we have to use a rotated div not in any other rotated div, so we make our own to test
    $("body").append(
      "<div id='eraseme' style='position: absolute; opacity: 0.0; filter: alpha(opacity = 0); top:100px; left:100px; width: 100px;'></div>"
    );
    $("#eraseme").setTransform("rotate(1.0)");
    var pos = $("#eraseme").position();
    var csstop = parseInt($("#eraseme").css("top"));
    $("#eraseme").remove();
    if (isNaN(csstop)) csstop = 0;
    if (pos.top != csstop) {
      //-webkit & newer firefox: position and offset are corrected for rotation; -very nice, thank you
      //but we need to get the untransformed values to calculate our corners
      //console.log("webkit & newer firefox (or newer jquery??) - using mod jq offset");
      jQuery.fn.untransformedOffset = jQuery.fn.transformable.offsetNoGetBounds;
      return jQuery.fn.transformable.offsetNoGetBounds.call(t);
    } else {
      //browser returns untransformed offset using offset()
      //console.log("firefox et al - unrotated offset with normal offset()");
      jQuery.fn.untransformedOffset = jQuery.fn.offset;
      return t.offset();
    }
  };
  // copied from jquery.js 1.5.1, but not available by call if "getBoundingClientRect" in document.documentElement
  // which will be the case on the very browser we need it for.
  jQuery.fn.transformable.offsetNoGetBounds = function (options) {
    var elem = this[0];
    if (options) {
      return this.each(function (i) {
        //jQuery.offset.setOffset( this, options, i );
        setOffset.call($(this), options, i);
      });
    }

    if (!elem || !elem.ownerDocument) {
      return null;
    }

    if (elem === elem.ownerDocument.body) {
      return jQuery.offset.bodyOffset(elem);
    }
    if (parseFloat($.fn.jquery.match(/^\d+\.\d+/)) < 1.7)
      jQuery.offset.initialize();

    var computedStyle,
      offsetParent = elem.offsetParent,
      prevOffsetParent = elem,
      doc = elem.ownerDocument,
      docElem = doc.documentElement,
      body = doc.body,
      defaultView = doc.defaultView,
      prevComputedStyle = defaultView
        ? defaultView.getComputedStyle(elem, null)
        : elem.currentStyle,
      top = elem.offsetTop,
      left = elem.offsetLeft;
    if (mozillaOverflowHiddenBug) {
      top =
        parseFloat(prevComputedStyle.top) +
        parseFloat(prevComputedStyle.marginTop);
      left =
        parseFloat(prevComputedStyle.left) +
        parseFloat(prevComputedStyle.marginLeft);
    }
    while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
      if (
        jQuery.offset.supportsFixedPosition &&
        prevComputedStyle.position === "fixed"
      ) {
        break;
      }

      computedStyle = defaultView
        ? defaultView.getComputedStyle(elem, null)
        : elem.currentStyle;

      top -= elem.scrollTop;
      left -= elem.scrollLeft;
      if (elem === offsetParent) {
        if (mozillaOverflowHiddenBug) {
          //we are off by one in elem.offsetTop/Left in firefox.  Dont know why.
          top +=
            (parseFloat(computedStyle.top) || 0) +
            (parseFloat(computedStyle.marginTop) || 0);
          left +=
            (parseFloat(computedStyle.left) || 0) +
            (parseFloat(computedStyle.marginLeft) || 0);
        } else {
          top += elem.offsetTop || 0;
          left += elem.offsetLeft || 0;
        }
        //newer jquery uses jQuery.support.xx instead of jQuery.offset.xx
        if (
          (jQuery.support.doesNotAddBorder || jQuery.offset.doesNotAddBorder) &&
          !(
            (jQuery.support.doesAddBorderForTableAndCells ||
              jQuery.offset.doesAddBorderForTableAndCells) &&
            rtable.test(elem.nodeName)
          )
        ) {
          top += parseFloat(computedStyle.borderTopWidth) || 0;
          left += parseFloat(computedStyle.borderLeftWidth) || 0;
        }
        prevOffsetParent = offsetParent;
        offsetParent = elem.offsetParent;
      }

      if (
        jQuery.offset.subtractsBorderForOverflowNotVisible &&
        computedStyle.overflow !== "visible"
      ) {
        top += parseFloat(computedStyle.borderTopWidth) || 0;
        left += parseFloat(computedStyle.borderLeftWidth) || 0;
      }

      prevComputedStyle = computedStyle;
    }

    if (
      prevComputedStyle.position === "relative" ||
      prevComputedStyle.position === "static"
    ) {
      top += body.offsetTop;
      left += body.offsetLeft;
    }

    if (
      jQuery.offset.supportsFixedPosition &&
      prevComputedStyle.position === "fixed"
    ) {
      top += Math.max(docElem.scrollTop, body.scrollTop);
      left += Math.max(docElem.scrollLeft, body.scrollLeft);
    }
    return { top: top, left: left };
  };

  function setOffset(options) {
    let curCSSTop, curCSSLeft, calculatePosition, props, curPosition;
    var elem = this[0];
    var position = jQuery.css(elem, "position");

    // set position first, in-case top/left are set even on static elem
    if (position === "static") {
      elem.style.position = "relative";
    }

    var curElem = jQuery(elem),
      //curOffset = curElem.offset(),
      curOffset = curElem.untransformedOffset();
    (curCSSTop = jQuery.css(elem, "top")),
      (curCSSLeft = jQuery.css(elem, "left")),
      (calculatePosition =
        position === "absolute" &&
        jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1),
      (props = {}),
      (curPosition = {});
    var curTop, curLeft;

    // need to be able to calculate position if either top or left is auto and position is absolute
    if (calculatePosition) {
      curPosition = curElem.position();
    }

    curTop = calculatePosition ? curPosition.top : parseInt(curCSSTop, 10) || 0;
    curLeft = calculatePosition
      ? curPosition.left
      : parseInt(curCSSLeft, 10) || 0;

    if (options.top != null) {
      props.top = options.top - curOffset.top + curTop;
    }
    if (options.left != null) {
      props.left = options.left - curOffset.left + curLeft;
    }
    curElem.css(props);
  }

  function borderWidth(t, arg) {
    if (arg == undefined) arg == "top";
    var width = 0;
    var bor = {};
    if (arg == "all") {
      bor.top = parseInt(
        t.css("borderTopWidth") ||
          (t.css("BORDER-TOP") || t.css("border") || "0px").match(/\d+px/)
      );
      bor.bottom = parseInt(
        t.css("borderBottomWidth") ||
          (t.css("BORDER-BOTTOM") || t.css("border") || "0px").match(/\d+px/)
      );
      bor.left = parseInt(
        t.css("borderLeftWidth") ||
          (t.css("BORDER-LEFT") || t.css("border") || "0px").match(/\d+px/)
      );
      bor.right = parseInt(
        t.css("borderRightWidth") ||
          (t.css("BORDER-RIGHT") || t.css("border") || "0px").match(/\d+px/)
      );
      return bor;
    }
    switch (arg) {
      default:
      case "top":
        width =
          t.css("borderTopWidth") ||
          (t.css("BORDER-TOP") || t.css("border") || "0px").match(/\d+px/);
        break;
      case "bottom":
        width =
          t.css("borderBottomWidth") ||
          (t.css("BORDER-BOTTOM") || t.css("border") || "0px").match(/\d+px/);
        break;
      case "left":
        width =
          t.css("borderLeftWidth") ||
          (t.css("BORDER-LEFT") || t.css("border") || "0px").match(/\d+px/);
        break;
      case "right":
        width =
          t.css("borderRightWidth") ||
          (t.css("BORDER-RIGHT") || t.css("border") || "0px").match(/\d+px/);
        break;
    }
    return parseInt(width);
  }

  //again borrowed from jquery.transform.js
  // step 6 has been altered to fix a problem when scale is negative -af
  jQuery.unmatrix = function (matrix) {
    var scaleX,
      scaleY,
      skew,
      A = matrix[0],
      B = matrix[1],
      C = matrix[2],
      D = matrix[3];
    // Make sure matrix is not singular
    if (A * D - B * C) {
      // step (3)
      scaleX = Math.sqrt(A * A + B * B);
      A /= scaleX;
      B /= scaleX;
      // step (4)
      skew = A * C + B * D;
      C -= A * skew;
      D -= B * skew;
      // step (5)
      scaleY = Math.sqrt(C * C + D * D);
      C /= scaleY;
      D /= scaleY;
      skew /= scaleY;
      // step (6)
      //this was trial and error, no guarantees - af
      var A1 = A;
      var B1 = B;
      if (A < 0 && D > 0) {
        scaleX = -scaleX;
        A = -A;
        skew = -skew;
      }
      if (D < 0 && A1 > 0) {
        scaleY = -scaleY;
        B = -B;
        skew = -skew;
      }
      if (A1 * D < B1 * C) B = -B;
      /* old version
		if ( A * D < B * C ) {
			//scaleY = -scaleY;
			//skew = -skew;
			A = -A;
			B = -B;
			skew = -skew;
			scaleX = -scaleX;
		}
		*/

      // matrix is singular and cannot be interpolated
    } else {
      rotate = scaleX = scaleY = skew = 0;
    }

    return {
      translate: [+matrix[4], +matrix[5]],
      rotate: Math.atan2(B, A),
      scale: [scaleX, scaleY],
      skew: [skew, 0],
    };
  };

  jQuery.fn.matrixToArray = function (returnFalse) {
    let m;
    if (this.eq(0).is("body")) return [1, 0, 0, 1, 0, 0];
    var im = [1, 0, 0, 1, 0, 0],
      transform = this.eq(0).css("transform");
    if (
      transform != undefined &&
      transform != "none" &&
      transform.replace(/\s+/g, "") != "matrix(1,0,0,1,0,0)" &&
      transform != ""
    ) {
      m = transform.match(/[\-\d\.]+/g);
      if (m && m != null)
        for (var i = 0; i < m.length; i++) m[i] = parseFloat(m[i]);
      else return im;
      if ($.browser.msie && $.browser.version < 9) {
        m[4] = 0;
        m[5] = 0;
      }
    } else if (returnFalse) return false;
    else return im;
    return m;
  };

  function resetDataFromTransform(t) {
    var transform = t.css("transform"),
      m = t.matrixToArray();
    var tt = $.unmatrix(m);
    t.attr("data-transform-skewx", tt.skew[0]);
    t.attr("data-transform-skewy", 0);
    t.attr("data-transform-scalex", tt.scale[0]);
    t.attr("data-transform-scaley", tt.scale[1]);
    t.attr("data-transform-rotate", tt.rotate);
    transform =
      "matrix(" +
      m[0].toFixed(16) +
      "," +
      m[1].toFixed(16) +
      "," +
      m[2].toFixed(16) +
      "," +
      m[3].toFixed(16) +
      "," +
      m[4].toFixed(16) +
      "," +
      m[5].toFixed(16) +
      ")";
    t.attr("data-transform", transform);
  }

  function mm(m1, m2) {
    return [
      m1[0] * m2[0] + m1[1] * m2[2],
      m1[0] * m2[1] + m1[1] * m2[3],
      m1[2] * m2[0] + m1[3] * m2[2],
      m1[2] * m2[1] + m1[3] * m2[3],
      m1[4] * m2[0] + m1[5] * m2[2] + m2[4],
      m1[4] * m2[1] + m1[5] * m2[3] + m2[5],
    ];
  }

  function imm(m) {
    if (!m) return [1, 0, 0, 1, 0, 0];
    var A = m[0],
      B = m[1],
      C = m[2],
      D = m[3];
    var d = A * D - B * C;
    if (m.length == 6) {
      var A1 = D / d,
        B1 = -B / d,
        C1 = -C / d,
        D1 = A / d;
      var E1 = -m[4] * A1 - m[5] * C1,
        F1 = -m[4] * B1 - m[5] * D1;
      return [A1, B1, C1, D1, E1, F1];
    }
    return [D / d, -B / d, -C / d, A / d];
  }

  $.fn.transformable.defaults = {
    rotatable: true,
    skewable: true,
    scalable: true,
    containrotate: false,
    containskew: false,
    containscale: false,
    containment: false,
    sizeIcons: true,
  };
});
})(jQuery);
