/*
** Annotator 1.2.6-dev-30b6543
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-05-21 00:13:11Z
*/

(function() {
  var $, CharRange, calcCharOffset, calcNodeOffset, cleanText, removeChars, removeCharsGlobal, walkDom,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Annotator.Plugin.CharRangeSelection = (function(_super) {

    __extends(CharRangeSelection, _super);

    function CharRangeSelection() {
      CharRangeSelection.__super__.constructor.apply(this, arguments);
    }

    CharRangeSelection.prototype.events = {
      'annotationCreated': 'annotationCreated',
      'annotationUpdated': 'annotationUpdated',
      'annotationsLoaded': 'annotationsLoaded'
    };

    CharRangeSelection.prototype.pluginInit = function() {
      if (!Annotator.supported()) {}
    };

    CharRangeSelection.prototype.annotationCreated = function(annotation) {
      var charRange, content, extraChars, offset, prefixStart, range, selectedText, suffixEnd;
      extraChars = 50;
      if (!(annotation.ranges != null)) return annotation;
      content = cleanText(this.element.text());
      range = annotation.ranges[0].normalize(this.annotator.wrapper[0]);
      charRange = new CharRange();
      offset = charRange.offsetsFromNormalizedRange(this.annotator.wrapper[0], range);
      selectedText = cleanText(annotation.quote);
      prefixStart = offset.start - extraChars < 0 ? 0 : offset.start - extraChars;
      suffixEnd = offset.end + extraChars > content.length ? content.length : offset.end + extraChars;
      annotation.prefix = content.slice(prefixStart, offset.start);
      annotation.suffix = content.slice(offset.end, suffixEnd);
      annotation.startOffset = offset.start;
      annotation.endOffset = offset.end;
      return annotation;
    };

    CharRangeSelection.prototype.annotationsLoaded = function(annotations) {
      var annotation, h, _i, _j, _len, _len2, _ref;
      for (_i = 0, _len = annotations.length; _i < _len; _i++) {
        annotation = annotations[_i];
        if (annotation.startOffset != null) {
          if (!(annotation.ranges != null) || annotation.ranges.length === 0) {
            this._loadAnnotation(annotation);
          } else if (annotation.originalQuote !== annotation.text) {
            if (annotation.highlights != null) {
              _ref = annotation.highlights;
              for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
                h = _ref[_j];
                $(h).replaceWith(h.childNodes);
              }
            }
            this._loadAnnotation(annotation);
          }
        }
      }
      return annotations;
    };

    CharRangeSelection.prototype._loadAnnotation = function(annotation) {
      var TEXT_NODE, head, offsets, range, selectedText;
      head = this.element[0];
      TEXT_NODE = 3;
      offsets = {
        start: annotation.startOffset,
        end: annotation.endOffset
      };
      range = new CharRange().rangeFromCharOffsets(head, offsets);
      selectedText = range.toString().trim();
      if ((annotation.originalQuote != null) && annotation.originalQuote !== selectedText) {
        console.log("PANIC: annotation is attached incorrectly. Should be: '" + annotation.originalQuote + "'. But is: '" + selectedText + "'", {
          range: range,
          annotation: annotation
        });
        return;
      }
      annotation.ranges = [];
      annotation.ranges.push(range);
      return this.annotator.setupAnnotation(annotation);
    };

    return CharRangeSelection;

  })(Annotator.Plugin);

  CharRange = (function() {
    var TEXT_NODE;

    function CharRange() {}

    TEXT_NODE = 3;

    CharRange.prototype.offsetsOfString = function(node, text) {
      var lastOffset, nodeOffset, offsets;
      offsets = {};
      nodeOffset = node.textContent.indexOf(text);
      lastOffset = node.textContent.lastIndexOf(text);
      if (nodeOffset !== lastOffset) {
        console.log("PANIC - multiple positions of text found");
      }
      offsets.start = calcCharOffset(node.textContent, nodeOffset);
      offsets.end = calcCharOffset(node.textContent, nodeOffset + text.length);
      return offsets;
    };

    CharRange.prototype.offsetsFromDomRange = function(node, range) {
      range = new Annotator.Range.BrowserRange(range).normalize(node);
      return this.offsetsFromNormalizedRange(node, range);
    };

    CharRange.prototype.offsetsFromNormalizedRange = function(node, range) {
      var charCount, findOffsets, offsets;
      offsets = {};
      charCount = 0;
      findOffsets = function(currNode) {
        if (currNode.nodeType === TEXT_NODE) {
          if (currNode === range.start) offsets.start = charCount;
          if (currNode === range.end) {
            offsets.end = charCount + cleanText(currNode.textContent).length;
          }
          return charCount += cleanText(currNode.textContent).length;
        }
      };
      walkDom(node, findOffsets);
      return offsets;
    };

    CharRange.prototype.rangeFromCharOffsets = function(node, offsets) {
      var charCount, endOffset, findRange, range, startOffset;
      startOffset = offsets.start;
      endOffset = offsets.end;
      charCount = 0;
      range = document.createRange();
      findRange = function(currNode) {
        var length, offset;
        if (currNode.nodeType === TEXT_NODE) {
          length = cleanText(currNode.textContent).length;
          if (length + charCount > startOffset && charCount <= startOffset) {
            offset = calcNodeOffset(currNode.textContent, startOffset - charCount);
            range.setStart(currNode, offset);
          }
          if (length + charCount >= endOffset && charCount <= endOffset) {
            offset = calcNodeOffset(currNode.textContent, endOffset - charCount);
            range.setEnd(currNode, offset);
          }
          return charCount += length;
        }
      };
      walkDom(node, findRange);
      return range;
    };

    return CharRange;

  })();

  calcNodeOffset = function(text, charOffset) {
    var char, cleanedCount, nodeCount, _i, _len;
    nodeCount = 0;
    cleanedCount = 0;
    if (charOffset === nodeCount) return nodeCount;
    for (_i = 0, _len = text.length; _i < _len; _i++) {
      char = text[_i];
      nodeCount++;
      if (!(removeChars.test(char))) cleanedCount++;
      if (charOffset === cleanedCount) return nodeCount;
    }
    return nodeCount;
  };

  calcCharOffset = function(text, nodeOffset) {
    var char, charOffset, nodeCount, _i, _len;
    charOffset = 0;
    nodeCount = 0;
    if (nodeOffset === nodeCount) return charOffset;
    for (_i = 0, _len = text.length; _i < _len; _i++) {
      char = text[_i];
      nodeCount++;
      if (!(removeChars.test(char))) charOffset++;
      if (nodeOffset === nodeCount) return charOffset;
    }
    return charOffset;
  };

  cleanText = function(text) {
    return text.replace(removeCharsGlobal, '');
  };

  removeChars = /[\n\s]/;

  removeCharsGlobal = /[\n\s]/g;

  walkDom = function(node, func) {
    var _results;
    func(node);
    node = node.firstChild;
    _results = [];
    while (node) {
      walkDom(node, func);
      _results.push(node = node.nextSibling);
    }
    return _results;
  };

  $ = Annotator.$;

}).call(this);
