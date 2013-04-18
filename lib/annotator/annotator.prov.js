/*
** Annotator 1.2.6-dev-71461f2
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-04-18 04:04:16Z
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Annotator.Plugin.Prov = (function(_super) {

    __extends(Prov, _super);

    function Prov() {
      Prov.__super__.constructor.apply(this, arguments);
    }

    Prov.prototype.pluginInit = function() {
      if (!Annotator.supported()) return;
      return this.annotator.viewer.addField({
        load: this.updateViewer
      });
    };

    Prov.prototype.updateViewer = function(field, annotation) {
      field = Annotator.$(field);
      console.log("update prov viewer", annotation);
      if (annotation.creator || annotation.created) {
        console.log(annotation.creator, annotation.created);
        console.log(new Date(annotation.created));
        return field.addClass('annotator-prov').html((annotation.creator ? 'by ' + Annotator.$.escape(annotation.creator) + ", " : "") + (annotation.created ? jQuery.timeago(new Date(Annotator.$.escape(annotation.created))) : ""));
      } else {
        return field.remove();
      }
    };

    return Prov;

  })(Annotator.Plugin);

}).call(this);
