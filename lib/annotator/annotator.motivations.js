/*
** Annotator 1.2.6-dev-b00ca62
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-04-03 01:15:15Z
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Annotator.Plugin.Motivations = (function(_super) {

    __extends(Motivations, _super);

    function Motivations() {
      this.setAnnotationMotivations = __bind(this.setAnnotationMotivations, this);
      this.updateField = __bind(this.updateField, this);
      Motivations.__super__.constructor.apply(this, arguments);
    }

    Motivations.prototype.options = {
      motivations: [
        {
          value: "http://austese.net/ns/oa/TextualNote",
          label: "Textual Note"
        }, {
          value: "http://austese.net/ns/oa/ExplanatoryNote",
          label: "Explanatory Note"
        }, {
          value: "http://austese.net/ns/oa/HistoricalNote",
          label: "Historical Note"
        }, {
          value: "http://austese.net/ns/oa/BiographicalNote",
          label: "Biographical Note"
        }, {
          value: "http://austese.net/ns/oa/Glossary",
          label: "Glossary"
        }, {
          value: "http://austese.net/ns/oa/ClassicalAllusion",
          label: "Classical Allusion"
        }, {
          value: "http://austese.net/ns/oa/BiblicalAllusion",
          label: "Biblical Allusion"
        }
      ]
    };

    Motivations.prototype.field = null;

    Motivations.prototype.input = null;

    Motivations.prototype.pluginInit = function() {
      var id, m, newfield, select, _i, _len, _ref;
      if (!Annotator.supported()) return;
      this.field = this.annotator.editor.addField({
        label: Annotator._t('ExplanatoryNote'),
        load: this.updateField,
        submit: this.setAnnotationMotivations
      });
      id = jQuery(this.field).find('input').attr('id');
      select = '<li class="annotator-item"><select style="width:100%"><option value="">(Uncategorised)</option>';
      _ref = this.options.motivations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        select += '<option value="' + m.value + '">' + m.label + '</option>';
      }
      select += '</select></li>';
      newfield = jQuery(select);
      jQuery(this.field).replaceWith(newfield);
      this.field = newfield[0];
      this.annotator.viewer.addField({
        load: this.updateViewer,
        annoPlugin: this
      });
      return this.input = jQuery(this.field).find('select');
    };

    Motivations.prototype.updateField = function(field, annotation) {
      var value;
      value = '';
      if (annotation.motivation) value = annotation.motivation;
      return this.input.val(value);
    };

    Motivations.prototype.setAnnotationMotivations = function(field, annotation) {
      return annotation.motivation = this.input.val();
    };

    Motivations.prototype.updateViewer = function(field, annotation) {
      var displayValue, m, _i, _len, _ref;
      field = jQuery(field);
      if (annotation.motivation) {
        displayValue = annotation.motivation;
        _ref = this.annoPlugin.options.motivations;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          m = _ref[_i];
          if (m.value === annotation.motivation) displayValue = m.label;
        }
        return field.addClass('annotator-motivation').html('<span class="annotator-motivation">' + Annotator.$.escape(displayValue) + '</span>');
      } else {
        return field.remove();
      }
    };

    return Motivations;

  })(Annotator.Plugin);

}).call(this);
