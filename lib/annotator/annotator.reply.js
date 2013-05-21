/*
** Annotator 1.2.6-dev-8985f8d
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-05-21 12:19:42Z
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Annotator.Plugin.Reply = (function(_super) {

    __extends(Reply, _super);

    function Reply() {
      Reply.__super__.constructor.apply(this, arguments);
    }

    Reply.prototype.events = {
      "annotationViewerShown": "annotationViewerShown"
    };

    Reply.prototype.pluginInit = function() {
      if (!Annotator.supported()) return;
      this.annotator.viewer.addField({
        load: this.updateViewerReplies,
        annoPlugin: this
      });
      this.annotator.editor.addField({
        load: this.updateEditorInReplyTo,
        annoPlugin: this
      });
      this.addLocalEvent(this.annotator.viewer.element, '.annotator-reply', 'click', 'onReplyClick');
      this.addLocalEvent(this.annotator.viewer.element, '.annotator-replies-count', 'click', 'showReplies');
      return this.addLocalEvent(this.annotator.viewer.element, '.annotator-link', 'click', 'viewAnnotation');
    };

    Reply.prototype.addLocalEvent = function(el, bindTo, event, functionName) {
      var closure,
        _this = this;
      closure = function() {
        return _this[functionName].apply(_this, arguments);
      };
      return el.on(event, bindTo, closure);
    };

    Reply.prototype.updateEditorInReplyTo = function(field, annotation) {
      var text;
      if (annotation.inReplyTo) {
        text = Annotator.$.trim(annotation.inReplyTo.text).substring(0, 68).trim(this) + (annotation.inReplyTo.text.length > 68 ? "..." : "");
        return Annotator.$(field).attr('readonly', true).addClass('muted').css('padding', '2px').html("In reply to '<i>" + text + "</i>'" + (annotation.inReplyTo.creator ? " by " + annotation.inReplyTo.creator : ""));
      } else {
        return Annotator.$(field).remove();
      }
    };

    Reply.prototype.updateViewerReplies = function(field, annotation) {
      var handleReplies, prov, store,
        _this = this;
      handleReplies = function(result) {
        var replies, repliescontent, repliescount;
        if (!annotation.replies) annotation.replies = store.mapAnnotations(result);
        replies = annotation.replies;
        replies.sort(function(a, b) {
          return a.created > b.created;
        });
        if (replies.length > 0) {
          repliescount = Annotator.$("<span class='annotator-replies-count'>" + replies.length + " Repl" + (replies.length === 1 ? "y" : "ies") + "</span>");
          repliescontent = Annotator.$("<div class='annotator-replies-content' style='display:none;padding-top:0.5em'></div>");
          field.html(repliescount);
          field.append(repliescontent);
          return replies.forEach(function(r) {
            return repliescontent.append("<p style='border:1px solid #dedede; padding:3px'><span style='color:#3c3c3c'>" + r.text + "</span><br/>" + (prov ? "<span style='font-size:smaller;'>" + prov.formatProvInfo(r.creator, r.created) + "</span>" : "") + "</p>");
          });
        } else {
          return field.remove();
        }
      };
      store = this.annoPlugin.annotator.plugins.LoreStore;
      prov = this.annoPlugin.annotator.plugins.Prov;
      if (!store) {
        field.remove();
        return;
      }
      field = Annotator.$(field);
      if (annotation.replies) {
        return handleReplies(annotation.replies);
      } else if (annotation.id) {
        return store._apiRequest('search', {
          'annotates': annotation.id
        }, handleReplies);
      }
    };

    Reply.prototype.annotationViewerShown = function(viewer, annotations) {
      return Annotator.$(viewer.element).find('.annotator-controls').append('<button class="annotator-link" title="View">View</button>').append('<button style="background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAKCAYAAABv7tTEAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAOBGFVd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4bBsrEwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAN1JREFUKBV9kTEOAUEUhmfYQtQu4BAKhWjoNOIQLiBxCNFIJDqNUusItDQ6Z1DoROz4/tk3m80WJvny3rz//W9nZ1wIwQlWQ1jeJ59a3kw9KarRee8l5IJ8RukCPWmsjFoDfLFlMrkMX0VYIxxNjAPR3jYwoBdGCurpwhm0yS0+iVfYw0h91huNE4ovkOEDyaR9lV0yxiMg1pea62vO6bax+Od4dxpOoEt5QPrqkNzFK1WEDSRxYQNb1Dowhhsc0s+Vb0FRVy7jykxVrU19GU0mVh93gFg+Lrm0zPqyH71Zj00AB94xAAAAAElFTkSuQmCC);" title="Reply" class="annotator-reply">Reply</button>');
    };

    Reply.prototype.onReplyClick = function(event) {
      var anno, cancel, cleanup, item, replyPosition, replyanno, save,
        _this = this;
      item = Annotator.$(event.target).parents('.annotator-annotation');
      anno = item.data('annotation');
      replyPosition = Annotator.$(this.annotator.viewer.element).position();
      replyanno = this.setupReply(anno);
      save = function() {
        delete anno.replies;
        cleanup();
        return _this.publish('annotationCreated', [replyanno]);
      };
      cancel = function() {
        return cleanup();
      };
      cleanup = function() {
        _this.unsubscribe('annotationEditorHidden', cancel);
        return _this.unsubscribe('annotationEditorSubmit', save);
      };
      this.subscribe('annotationEditorHidden', cancel);
      this.subscribe('annotationEditorSubmit', save);
      return this.annotator.showEditor(replyanno, replyPosition);
    };

    Reply.prototype.showReplies = function(event) {
      var anno, item;
      item = Annotator.$(event.target).parents('.annotator-annotation');
      anno = item.data('annotation');
      return item.find('.annotator-replies-content').toggle();
    };

    Reply.prototype.viewAnnotation = function(event) {
      var anno, item;
      item = Annotator.$(event.target).parents('.annotator-annotation');
      anno = item.data('annotation');
      return window.open("/annotations/search/id?uri=" + encodeURIComponent(anno.id));
    };

    Reply.prototype.setupReply = function(anno) {
      var annotation;
      annotation = {
        uri: anno.id,
        text: "",
        inReplyTo: anno,
        highlights: [],
        motivation: "oa:replying"
      };
      return annotation;
    };

    return Reply;

  })(Annotator.Plugin);

}).call(this);
