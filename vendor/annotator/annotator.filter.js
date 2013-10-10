/*
** Annotator 1.2.6-dev-096f1b0
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-04-16 05:24:57Z
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Annotator.Plugin.Filter = (function(_super) {

    __extends(Filter, _super);

    Filter.prototype.events = {
      ".annotator-filter-property input focus": "_onFilterFocus",
      ".annotator-filter-property input blur": "_onFilterBlur",
      ".annotator-filter-property input keyup": "_onFilterKeyup",
      ".annotator-filter-previous click": "_onPreviousClick",
      ".annotator-filter-next click": "_onNextClick",
      ".annotator-filter-clear click": "_onClearClick"
    };

    Filter.prototype.classes = {
      active: 'annotator-filter-active',
      hl: {
        hide: 'annotator-hl-filtered',
        active: 'annotator-hl-active'
      }
    };

    Filter.prototype.html = {
      element: "<div class=\"annotator-filter\">\n  <strong>" + Annotator._t('Navigate:') + "</strong>\n<span class=\"annotator-filter-navigation\">\n  <button class=\"annotator-filter-previous\">" + Annotator._t('Previous') + "</button>\n<button class=\"annotator-filter-next\">" + Annotator._t('Next') + "</button>\n</span>\n<strong>" + Annotator._t('Filter by:') + "</strong>\n</div>",
      filter: "<span class=\"annotator-filter-property\">\n  <label></label>\n  <input/>\n  <button class=\"annotator-filter-clear\">" + Annotator._t('Clear') + "</button>\n</span>"
    };

    Filter.prototype.options = {
      appendTo: 'body',
      filters: [],
      addAnnotationFilter: true,
      isFiltered: function(input, property) {
        var keyword, _i, _len, _ref;
        if (!(input && property)) return false;
        _ref = input.split(/\s*/);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          keyword = _ref[_i];
          if (property.indexOf(keyword) === -1) return false;
        }
        return true;
      }
    };

    function Filter(element, options) {
      this._onPreviousClick = __bind(this._onPreviousClick, this);
      this._onNextClick = __bind(this._onNextClick, this);
      this._onFilterKeyup = __bind(this._onFilterKeyup, this);
      this._onFilterBlur = __bind(this._onFilterBlur, this);
      this._onFilterFocus = __bind(this._onFilterFocus, this);
      this.updateHighlights = __bind(this.updateHighlights, this);
      var _base;
      element = Annotator.$(this.html.element).appendTo((options != null ? options.appendTo : void 0) || this.options.appendTo);
      Filter.__super__.constructor.call(this, element, options);
      (_base = this.options).filters || (_base.filters = []);
      this.filter = Annotator.$(this.html.filter);
      this.filters = [];
      this.current = 0;
    }

    Filter.prototype.pluginInit = function() {
      var filter, _i, _len, _ref;
      _ref = this.options.filters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        filter = _ref[_i];
        this.addFilter(filter);
      }
      this.updateHighlights();
      this._setupListeners()._insertSpacer();
      if (this.options.addAnnotationFilter === true) {
        return this.addFilter({
          label: Annotator._t('Annotation'),
          property: 'text'
        });
      }
    };

    Filter.prototype._insertSpacer = function() {
      var currentMargin, html;
      html = Annotator.$('html');
      currentMargin = parseInt(html.css('padding-top'), 10) || 0;
      html.css('padding-top', currentMargin + this.element.outerHeight());
      return this;
    };

    Filter.prototype._setupListeners = function() {
      var event, events, _i, _len;
      events = ['annotationsLoaded', 'annotationCreated', 'annotationUpdated', 'annotationDeleted'];
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        event = events[_i];
        this.annotator.subscribe(event, this.updateHighlights);
      }
      return this;
    };

    Filter.prototype.addFilter = function(options) {
      var f, filter;
      filter = Annotator.$.extend({
        label: '',
        property: '',
        isFiltered: this.options.isFiltered
      }, options);
      if (!((function() {
        var _i, _len, _ref, _results;
        _ref = this.filters;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          f = _ref[_i];
          if (f.property === filter.property) _results.push(f);
        }
        return _results;
      }).call(this)).length) {
        filter.id = 'annotator-filter-' + filter.property;
        filter.annotations = [];
        filter.element = this.filter.clone().appendTo(this.element);
        filter.element.find('label').html(filter.label).attr('for', filter.id);
        filter.element.find('input').attr({
          id: filter.id,
          placeholder: Annotator._t('Filter by ') + filter.label + '\u2026'
        });
        filter.element.find('button').hide();
        filter.element.data('filter', filter);
        this.filters.push(filter);
      }
      return this;
    };

    Filter.prototype.updateFilter = function(filter) {
      var annotation, annotations, input, property, _i, _len, _ref;
      filter.annotations = [];
      this.updateHighlights();
      this.resetHighlights();
      input = Annotator.$.trim(filter.element.find('input').val());
      if (input) {
        annotations = this.highlights.map(function() {
          return Annotator.$(this).data('annotation');
        });
        _ref = Annotator.$.makeArray(annotations);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          annotation = _ref[_i];
          property = annotation[filter.property];
          if (filter.isFiltered(input, property)) {
            filter.annotations.push(annotation);
          }
        }
        return this.filterHighlights();
      }
    };

    Filter.prototype.updateHighlights = function() {
      this.highlights = this.annotator.element.find('.annotator-hl:visible');
      return this.filtered = this.highlights.not(this.classes.hl.hide);
    };

    Filter.prototype.filterHighlights = function() {
      var activeFilters, annotation, annotations, filtered, highlights, index, uniques, _len, _ref;
      activeFilters = Annotator.$.grep(this.filters, function(filter) {
        return !!filter.annotations.length;
      });
      filtered = ((_ref = activeFilters[0]) != null ? _ref.annotations : void 0) || [];
      if (activeFilters.length > 1) {
        annotations = [];
        Annotator.$.each(activeFilters, function() {
          return Annotator.$.merge(annotations, this.annotations);
        });
        uniques = [];
        filtered = [];
        Annotator.$.each(annotations, function() {
          if (Annotator.$.inArray(this, uniques) === -1) {
            return uniques.push(this);
          } else {
            return filtered.push(this);
          }
        });
      }
      highlights = this.highlights;
      for (index = 0, _len = filtered.length; index < _len; index++) {
        annotation = filtered[index];
        highlights = highlights.not(annotation.highlights);
      }
      highlights.addClass(this.classes.hl.hide);
      this.filtered = this.highlights.not(this.classes.hl.hide);
      return this;
    };

    Filter.prototype.resetHighlights = function() {
      this.highlights.removeClass(this.classes.hl.hide);
      this.filtered = this.highlights;
      return this;
    };

    Filter.prototype._onFilterFocus = function(event) {
      var input;
      input = Annotator.$(event.target);
      input.parent().addClass(this.classes.active);
      return input.next('button').show();
    };

    Filter.prototype._onFilterBlur = function(event) {
      var input;
      if (!event.target.value) {
        input = Annotator.$(event.target);
        input.parent().removeClass(this.classes.active);
        return input.next('button').hide();
      }
    };

    Filter.prototype._onFilterKeyup = function(event) {
      var filter;
      filter = Annotator.$(event.target).parent().data('filter');
      if (filter) return this.updateFilter(filter);
    };

    Filter.prototype._findNextHighlight = function(previous) {
      var active, annotation, current, index, next, offset, operator, resetOffset;
      if (!this.highlights.length) return this;
      offset = previous ? 0 : -1;
      resetOffset = previous ? -1 : 0;
      operator = previous ? 'lt' : 'gt';
      active = this.highlights.not('.' + this.classes.hl.hide);
      current = active.filter('.' + this.classes.hl.active);
      if (!current.length) current = active.eq(offset);
      annotation = current.data('annotation');
      index = active.index(current[0]);
      next = active.filter(":" + operator + "(" + index + ")").not(annotation.highlights).eq(resetOffset);
      if (!next.length) next = active.eq(resetOffset);
      return this._scrollToHighlight(next.data('annotation').highlights);
    };

    Filter.prototype._onNextClick = function(event) {
      return this._findNextHighlight();
    };

    Filter.prototype._onPreviousClick = function(event) {
      return this._findNextHighlight(true);
    };

    Filter.prototype._scrollToHighlight = function(highlight) {
      highlight = Annotator.$(highlight);
      this.highlights.removeClass(this.classes.hl.active);
      highlight.addClass(this.classes.hl.active);
      return Annotator.$('html, body').animate({
        scrollTop: highlight.offset().top - (this.element.height() + 20)
      }, 150);
    };

    Filter.prototype._onClearClick = function(event) {
      return Annotator.$(event.target).prev('input').val('').keyup().blur();
    };

    return Filter;

  })(Annotator.Plugin);

}).call(this);
