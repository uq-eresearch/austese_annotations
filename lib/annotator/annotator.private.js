/*
** Annotator 1.2.6-dev-169c845
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-04-30 05:26:21Z
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Annotator.Plugin.Private = (function(_super) {

    __extends(Private, _super);

    function Private() {
      this.updateViewer = __bind(this.updateViewer, this);
      this.updatePrivateField = __bind(this.updatePrivateField, this);
      Private.__super__.constructor.apply(this, arguments);
    }

    Private.prototype.events = {
      'beforeAnnotationCreated': 'addFieldsToAnnotation'
    };

    Private.prototype.pluginInit = function() {
      if (!Annotator.supported()) return;
      this.annotator.editor.addField({
        type: 'checkbox',
        label: Annotator._t('Is Private'),
        load: createCallback('updatePrivateField'),
        submit: createCallback('updateAnnotationPrivate')
      });
      return this.annotator.viewer.addField({
        load: this.updateViewer
      });
    };

    Private.prototype.updatePrivateField = function(action, field, annotation) {
      var input;
      field = Annotator.$(field).show();
      input = field.find('input').removeAttr('disabled');
      if (!this.authorize('admin', annotation)) field.hide();
      if (this.authorize(action, annotation || {}, null)) {
        return input.attr('checked', 'checked');
      } else {
        return input.removeAttr('checked');
      }
    };

    Private.prototype.updateViewer = function(field, annotation, controls) {
      field = Annotator.$(field);
      if (controls) {
        if (!this.authorize('update', annotation)) controls.hideEdit();
        if (!this.authorize('delete', annotation)) return controls.hideDelete();
      }
    };

    Private.prototype.authorize = function(action, annotation, user) {
      if (user === void 0) user = this.user;
      if (this.options.userAuthorize) {
        return this.options.userAuthorize.call(this.options, action, annotation, user);
      } else {
        return true;
      }
    };

    return Private;

  })(Annotator.Plugin);

}).call(this);
