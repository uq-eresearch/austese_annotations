/*
** Annotator 1.2.6-dev-30b6543
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-05-21 00:13:15Z
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
        load: this.updateViewer,
        annoPlugin: this
      });
    };

    Prov.prototype.updateViewer = function(field, annotation) {
      field = Annotator.$(field);
      if (annotation.creator || annotation.created) {
        return field.addClass('annotator-prov').html('<span class="annotator-motivation"></span>' + this.annoPlugin.formatProvInfo(annotation.creator, annotation.created));
      } else {
        return field.remove();
      }
    };

    Prov.prototype.formatProvInfo = function(creator, created) {
      return (creator ? 'by ' + Annotator.$.escape(creator) + ", " : "") + (created ? jQuery.timeago(new Date(Annotator.$.escape(created))) : "");
    };

    return Prov;

  })(Annotator.Plugin);

}).call(this);
