/**
 * swapImage - $ plugin for swapping image(s)
 *
 * Copyright (c) 2010 tszming (tszming@gmail.com)
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Enable image swapping, requires metadata plugin.
 *
 * @example $.swapImage(".swapImage");
 * @desc Enable image swapping for all images with CSS class name equal to "swapImage", e.g.
 *	<img class="swapImage {src: 'images/new.gif'}" src="images/old.gif" />
 *
 * @param i Images to be selected.
 * @param preload Preload the image, default = true.
 * @param repeat Repeat the effect, default = true.
 * @param swapInEvent Event for swap In.
 * @param swapOutEvent Event for swap Out.
 *
 * @name $.swapImage
 * @cat Plugins/SwapImage
 * @author tszming (tszming@gmail.com)
 * @version 1.0.5
 */

(function($) {

  $.swapImage = function(i, preload, repeat, swapInEvent, swapOutEvent) {

    $.swapImage.files = {};
    $.swapImage.data = {};
    $.swapImage.uuid = 0;

    $.swapImage.init = function() {
      var id = ++$.swapImage.uuid;
      $(this).attr("swapImageId", id);
      var data = $(this).metadata();
      $.swapImage.data[id] = $.swapImage.data[id] || {};

      if (typeof data.src != "undefined") {
        $.swapImage.data[id]["src"] = data.src;
        $.swapImage.files[data.src] = false;
      }

      $.each(
        $.grep([[data.sin, "sin"], [data.sout, "sout"]],
          function(n) {
            return (typeof n[0] != "undefined" && n[0].length > 0);
          }),
        function() {
          var arr = this[0];
          var vname = this[1];
          for (var i = 0; i < arr.length; i++) {
            var idx = data[vname][i].indexOf(":");
            var selection = data[vname][i].substring(0, idx);
            var file = data[vname][i].substring(idx + 1);
            $.swapImage.data[id][vname] = $.swapImage.data[id][vname] || [];
            if (idx > 1) {
              $.swapImage.data[id][vname].push([selection, file]);
              $.swapImage.files[file] = false;
            } else {
              $.swapImage.data[id][vname].push([file]);
            }
          }
        });
    };

    $.swapImage.preload = function() {
      $.each($.swapImage.files,
          function(k, v) {
            if (v == false) {
              $.swapImage.files[k] = true;
              var img = new Image();
              img.src = k;
            }
          });
    };

    $.swapImage.swapIn = function() {
      $.swapImage.swap(this, "sin");
    };

    $.swapImage.swapOut = function() {
      $.swapImage.swap(this, "sout");
    };

    $.swapImage.swap = function(obj, a) {
      var id = $(obj).attr("swapImageId");
      if (typeof $.swapImage.data[id][a] != "undefined") {
        for (var i = 0; i < $.swapImage.data[id][a].length; i++) {
          if ($.swapImage.data[id][a][i].length > 1) {
            $($.swapImage.data[id][a][i][0]).attr("src", $.swapImage.data[id][a][i][1]);
          } else {
            $($.swapImage.data[id][a][i][0]).each($.swapImage._swap);
          }
        }
      } else {
        $.swapImage._swap.call(obj);
      }
    };

    $.swapImage._swap = function(obj) {
      var id = $(this).attr("swapImageId");
      var data = $.swapImage.data[id];
      if (typeof data.src != "undefined") {
        var tmp = data.src;
        data.src = this.src;
        this.src = tmp;
      }
    };

    $(document).ready(function() {

      if (typeof repeat == "undefined") {
        repeat = true;
      }

      if (typeof preload == "undefined") {
        preload = true;
      }

      $(i).each($.swapImage.init);

      if (typeof swapInEvent == "undefined" && typeof swapInEvent == "undefined") {
        swapInEvent = "mouseenter";
        swapOutEvent = "mouseleave";
      }

      if (repeat) {
        if (typeof swapOutEvent != "undefined") {
          $(i).bind(swapInEvent, $.swapImage.swapIn).bind(swapOutEvent, $.swapImage.swapOut);
        } else {
          $(i).bind(swapInEvent, $.swapImage.swapIn);
        }
      } else {
        $(i).one(swapInEvent, $.swapImage.swapIn);
      }

      if (preload) {
        $(i).each($.swapImage.preload);
      }
    });
  };

})(jQuery);
