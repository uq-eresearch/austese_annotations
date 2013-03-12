/*
** Annotator 1.2.6-dev-d9a3713
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-03-12 02:02:05Z
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Annotator.Plugin.Image = (function(_super) {

    __extends(Image, _super);

    function Image() {
      this.updateImageHighlights = __bind(this.updateImageHighlights, this);
      this._onSelectStart = __bind(this._onSelectStart, this);
      this._onSelectEnd = __bind(this._onSelectEnd, this);
      this.deselect = __bind(this.deselect, this);
      this._onWindowResized = __bind(this._onWindowResized, this);
      Image.__super__.constructor.apply(this, arguments);
    }

    Image.prototype.currentImage = null;

    Image.prototype.selection = null;

    Image.prototype.pluginInit = function() {
      this.element.find('img').imgAreaSelect({
        handles: true,
        onSelectEnd: this._onSelectEnd,
        onSelectStart: this._onSelectStart
      });
      jQuery(document).bind({
        "mousedown": this.deselect
      });
      jQuery(window).resize(this._onWindowResized);
      this.annotator.addAnnotationPlugin(this);
      return this._setupListeners();
    };

    Image.prototype._onWindowResized = function() {
      var annoPlugin;
      annoPlugin = this;
      return jQuery(document).find('span.annotator-hl').map(function() {
        var annotation;
        annotation = jQuery(this).data('annotation');
        if (annotation) return annoPlugin.updateMarkerPosition(annotation);
      });
    };

    Image.prototype.deselect = function() {
      if (this.currentImage) {
        return jQuery(this.currentImage).imgAreaSelect({
          instance: true
        }).cancelSelection();
      }
    };

    Image.prototype._onSelectEnd = function(image, selection) {
      var adderPosition, imgPosition, relativeSelection;
      if (selection.width === 0 || selection.height === 0) {
        this.annotator.adder.hide();
        return;
      }
      this.currentImage = image;
      this.selection = selection;
      this.selection.image = image;
      imgPosition = jQuery(image).position();
      adderPosition = {
        top: imgPosition.top + selection.y1 - 5,
        left: imgPosition.left + selection.x2 + 5
      };
      relativeSelection = {
        x1: selection.x1 / image.width,
        x2: selection.x2 / image.width,
        y1: selection.y1 / image.height,
        y2: selection.y2 / image.height,
        width: selection.width / image.width,
        height: selection.height / image.height
      };
      this.annotator.adder.data('selection', selection);
      this.annotator.adder.data('relativeSelection', relativeSelection);
      return this.annotator.adder.css(adderPosition).show();
    };

    Image.prototype._onSelectStart = function(image, selection) {
      var _ref;
      if ((_ref = this.adder) != null) _ref.removeData('selection');
      return this.annotator.adder.hide();
    };

    Image.prototype._setupListeners = function() {
      var event, events, _i, _len;
      events = ['annotationsLoaded', 'annotationCreated', 'annotationUpdated', 'annotationDeleted'];
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        event = events[_i];
        this.annotator.subscribe(event, this.updateImageHighlights);
      }
      return this;
    };

    Image.prototype.handlesAnnotation = function(annotation) {
      if (annotation.selection != null) {
        return true;
      } else {
        return false;
      }
    };

    Image.prototype.setupAnnotation = function(annotation) {
      this.deselect();
      this.createMarker(annotation);
      annotation.removeMarkers = function() {
        return this.marker.remove();
      };
      return annotation;
    };

    Image.prototype.borderWidth = 2;

    Image.prototype.borderColour = 'red';

    Image.prototype.createMarker = function(annotation) {
      var marker;
      marker = jQuery('<span>').appendTo(this.element);
      annotation.marker = marker;
      marker.data("annotation", annotation);
      return this.updateMarkerPosition(annotation);
    };

    Image.prototype.updateMarkerPosition = function(annotation) {
      var image, imgPosition, marker, selection;
      if (!annotation.selection) return;
      image = annotation.selection.image;
      selection = annotation.selection;
      marker = annotation.marker;
      imgPosition = jQuery(image).offset();
      marker.css({
        position: 'absolute',
        left: imgPosition.left + selection.x1 + this.borderWidth,
        top: imgPosition.top + selection.y1 + this.borderWidth,
        border: this.borderWidth + 'px solid ' + this.borderColour,
        zIndex: 1000
      });
      marker.width(selection.width - this.borderWidth * 2);
      marker.height(selection.height - this.borderWidth * 2);
      selection = annotation.relativeSelection;
      marker.css({
        position: 'absolute',
        left: imgPosition.left + (selection.x1 * image.width) + this.borderWidth,
        top: imgPosition.top + (selection.y1 * image.height) + this.borderWidth,
        border: this.borderWidth + 'px solid ' + this.borderColour
      });
      marker.width((selection.width * image.width) - this.borderWidth * 2);
      marker.height((selection.height * image.height) - this.borderWidth * 2);
      return marker.addClass('annotator-hl annotator-image');
    };

    Image.prototype.updateImageHighlights = function() {
      return this;
    };

    return Image;

  })(Annotator.Plugin);

  Annotator.Annotation = (function() {

    function Annotation() {}

    Annotation.prototype.createMarker = function() {};

    return Annotation;

  })();

  Annotator.ImageAnnotation = (function(_super) {

    __extends(ImageAnnotation, _super);

    function ImageAnnotation() {
      ImageAnnotation.__super__.constructor.apply(this, arguments);
    }

    ImageAnnotation.prototype.hideMarker = function() {
      var _ref;
      return (_ref = this.marker) != null ? _ref.hide() : void 0;
    };

    return ImageAnnotation;

  })(Annotator.Annotation);

}).call(this);
