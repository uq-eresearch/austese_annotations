/*
** Annotator 1.2.6-dev-30b6543
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-05-21 00:13:13Z
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Annotator.Plugin.LoreStore = (function(_super) {

    __extends(LoreStore, _super);

    LoreStore.prototype.events = {
      'annotationCreated': 'annotationCreated',
      'annotationDeleted': 'annotationDeleted',
      'annotationUpdated': 'annotationUpdated'
    };

    LoreStore.prototype.options = {
      annotationData: {},
      emulateHTTP: false,
      prefix: '/lorestore',
      urls: {
        create: '/oa/',
        read: ':id',
        update: ':id',
        destroy: ':id',
        search: '/oa/'
      }
    };

    function LoreStore(element, options) {
      this._uuid = __bind(this._uuid, this);
      this._findById = __bind(this._findById, this);
      this._findAnnos = __bind(this._findAnnos, this);
      this._onError = __bind(this._onError, this);
      this._onLoadAnnotations = __bind(this._onLoadAnnotations, this);
      this.mapAnnotations = __bind(this.mapAnnotations, this);
      this._getAnnotations = __bind(this._getAnnotations, this);      LoreStore.__super__.constructor.apply(this, arguments);
      this.annotations = [];
    }

    LoreStore.prototype.pluginInit = function() {
      if (!Annotator.supported()) return;
      if (this.annotator.plugins.Auth) {
        return this.annotator.plugins.Auth.withToken(this._getAnnotations);
      } else {
        return this._getAnnotations();
      }
    };

    LoreStore.prototype._getAnnotations = function() {
      return this.loadAnnotationsFromSearch();
    };

    LoreStore.prototype.annotationCreated = function(annotation) {
      var _this = this;
      if (__indexOf.call(this.annotations, annotation) < 0) {
        this.registerAnnotation(annotation);
        return this._apiRequest('create', annotation, function(data) {
          var anno, created, creator, id;
          anno = _this._findAnnos(data['@graph'])[0];
          id = anno['@id'];
          created = anno.annotatedAt;
          creator = anno.annotatedBy;
          if (creator) {
            creator = _this._findById(data['@graph'], creator);
            if (creator && creator.name) creator = creator.name;
          }
          if (created) created = created['@value'];
          if (!(id != null)) {
            console.warn(Annotator._t("Warning: No ID returned from server for annotation "), annotation);
          }
          return _this.updateAnnotation(annotation, {
            'id': id,
            'created': created,
            'creator': creator
          });
        });
      } else {
        return this.updateAnnotation(annotation, {});
      }
    };

    LoreStore.prototype.annotationUpdated = function(annotation) {
      var _this = this;
      if (__indexOf.call(this.annotations, annotation) >= 0) {
        return this._apiRequest('update', annotation, (function(data) {
          return _this.updateAnnotation(annotation, {});
        }));
      }
    };

    LoreStore.prototype.annotationDeleted = function(annotation) {
      var _this = this;
      if (__indexOf.call(this.annotations, annotation) >= 0) {
        return this._apiRequest('destroy', annotation, (function() {
          return _this.unregisterAnnotation(annotation);
        }));
      }
    };

    LoreStore.prototype.registerAnnotation = function(annotation) {
      return this.annotations.push(annotation);
    };

    LoreStore.prototype.unregisterAnnotation = function(annotation) {
      return this.annotations.splice(this.annotations.indexOf(annotation), 1);
    };

    LoreStore.prototype.updateAnnotation = function(annotation, data) {
      if (__indexOf.call(this.annotations, annotation) < 0) {
        console.error(Annotator._t("Trying to update unregistered annotation!"));
      } else {
        jQuery.extend(annotation, data);
      }
      return jQuery(annotation.highlights).data('annotation', annotation);
    };

    LoreStore.prototype.mapAnnotations = function(data) {
      var anno, annos, annotations, body, creator, id, image, processSelector, selectiondata, selector, selectors, target, targetsel, tempanno, textQuoteSelector, _i, _j, _len, _len2;
      if (data == null) data = {};
      annotations = [];
      annos = this._findAnnos(data['@graph']);
      for (_i = 0, _len = annos.length; _i < _len; _i++) {
        anno = annos[_i];
        body = this._findById(data['@graph'], anno.hasBody);
        target = this._findById(data['@graph'], anno.hasTarget);
        if (target && target.hasSelector) {
          targetsel = this._findById(data['@graph'], target.hasSelector);
        }
        tempanno = {
          "id": anno['@id'],
          "text": body.chars,
          "ranges": [],
          "motivation": anno.motivatedBy
        };
        if (anno.annotatedBy) {
          creator = this._findById(data['@graph'], anno.annotatedBy);
          if (creator) {
            tempanno.annotatedBy = anno.annotatedBy;
            tempanno.creator = creator.name;
          }
        }
        if (anno.annotatedAt) tempanno.created = anno.annotatedAt['@value'];
        if (targetsel && targetsel['@type'] === 'oa:Choice') {
          textQuoteSelector = this._findById(data['@graph'], targetsel["default"]);
          tempanno.quote = textQuoteSelector.exact;
          tempanno.originalQuote = textQuoteSelector.exact;
          tempanno.prefix = textQuoteSelector.prefix;
          tempanno.suffix = textQuoteSelector.suffix;
          processSelector = function(sel) {
            switch (sel['@type']) {
              case 'austese:RangeSelector':
                return tempanno.ranges = [
                  {
                    "start": sel["lorestore:startElement"],
                    "startOffset": sel["lorestore:startOffset"],
                    "end": sel["lorestore:endElement"],
                    "endOffset": sel["lorestore:endOffset"]
                  }
                ];
              case 'oa:TextPositionSelector':
                tempanno.startOffset = sel['start'];
                return tempanno.endOffset = sel['end'];
            }
          };
          if (typeof targetsel.item === 'string') {
            selector = this._findById(data['@graph'], targetsel.item);
            processSelector(selector);
          } else if (typeof targetsel.item === 'object') {
            selectors = (function() {
              var _j, _len2, _ref, _results;
              _ref = targetsel.item;
              _results = [];
              for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
                id = _ref[_j];
                _results.push(this._findById(data['@graph'], id));
              }
              return _results;
            }).call(this);
            for (_j = 0, _len2 = selectors.length; _j < _len2; _j++) {
              selector = selectors[_j];
              processSelector(selector);
            }
          }
        } else if (targetsel && targetsel.value && targetsel.value.match("xywh=")) {
          image = jQuery("[data-id='" + target.hasSource + "']").find('img');
          if (image.length > 0) image = image[0];
          selectiondata = targetsel.value.split("=")[1].split(",");
          tempanno.relativeSelection = {
            "x1": parseFloat(selectiondata[0]),
            "y1": parseFloat(selectiondata[1]),
            "x2": parseFloat(selectiondata[0]) + parseFloat(selectiondata[2]),
            "y2": parseFloat(selectiondata[1]) + parseFloat(selectiondata[3]),
            "width": parseFloat(selectiondata[2]),
            "height": parseFloat(selectiondata[3]),
            "image": image
          };
        }
        annotations.push(tempanno);
      }
      return annotations;
    };

    LoreStore.prototype._onLoadAnnotations = function(data) {
      if (data == null) data = {};
      this.loads--;
      this.annotations = this.mapAnnotations(data);
      if (this.loads === 0) {
        return this.annotator.loadAnnotations(this.annotations.slice());
      }
    };

    LoreStore.prototype.loadAnnotationsFromSearch = function(searchOptions) {
      var embedded,
        _this = this;
      this.annotations = [];
      this.loads = 0;
      embedded = false;
      jQuery(this.element).find('[data-id]').andSelf().each(function(index, el) {
        var id;
        id = jQuery(el).data('id');
        if (id) {
          embedded = true;
          _this.loads++;
          return _this._apiRequest('search', {
            'annotates': id
          }, _this._onLoadAnnotations);
        }
      });
      if (!embedded) {
        if (!searchOptions) searchOptions = {};
        if (!searchOptions.annotates) {
          searchOptions.annotates = searchOptions.uri || document.location.href;
        }
        return this._apiRequest('search', searchOptions, this._onLoadAnnotations);
      }
    };

    LoreStore.prototype.dumpAnnotations = function() {
      var ann, _i, _len, _ref, _results;
      _ref = this.annotations;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ann = _ref[_i];
        _results.push(JSON.parse(this._dataFor(ann)));
      }
      return _results;
    };

    LoreStore.prototype._apiRequest = function(action, obj, onSuccess) {
      var id, options, request, resourceuri, url;
      id = obj && obj.id;
      resourceuri = obj && obj.resourceuri;
      url = this._urlFor(action, id, resourceuri);
      options = this._apiRequestOptions(action, obj, onSuccess);
      request = jQuery.ajax(url, options);
      request._id = id;
      request._action = action;
      return request;
    };

    LoreStore.prototype._apiRequestOptions = function(action, obj, onSuccess) {
      var data, method, opts;
      method = this._methodFor(action);
      opts = {
        type: method,
        headers: this.element.data('annotator:headers'),
        dataType: "json",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        success: onSuccess || function() {},
        error: this._onError
      };
      if (this.options.emulateHTTP && (method === 'PUT' || method === 'DELETE')) {
        opts.headers = jQuery.extend(opts.headers, {
          'X-HTTP-Method-Override': method
        });
        opts.type = 'POST';
      }
      if (action === "search") {
        opts = jQuery.extend(opts, {
          data: obj
        });
        return opts;
      }
      data = obj && this._dataFor(obj);
      if (this.options.emulateJSON) {
        opts.data = {
          json: data
        };
        if (this.options.emulateHTTP) opts.data._method = method;
        return opts;
      }
      opts = jQuery.extend(opts, {
        data: data,
        contentType: "application/json; charset=utf-8"
      });
      return opts;
    };

    LoreStore.prototype._urlFor = function(action, id, resourceuri) {
      var url;
      if (action !== 'read' && action !== 'search' && action !== 'create') {
        url = id;
      } else {
        url = this.options.prefix != null ? this.options.prefix : '';
        url += this.options.urls[action];
        url = url.replace(/:resourceuri/, resourceuri ? encodeURIComponent(resourceuri) : encodeURIComponent(document.location.href));
      }
      return url;
    };

    LoreStore.prototype._methodFor = function(action) {
      var table;
      table = {
        'create': 'POST',
        'read': 'GET',
        'update': 'PUT',
        'destroy': 'DELETE',
        'search': 'GET'
      };
      return table[action];
    };

    LoreStore.prototype._dataFor = function(annotation) {
      var agent, bodysrid, data, specifictarget, targetselector, targetselid, targetsrid, targeturi, tempanno;
      jQuery.extend(annotation, this.options.annotationData);
      bodysrid = 'urn:uuid:' + this._uuid();
      if (annotation.uri) {
        targeturi = annotation.uri;
      } else if (this.element.data('id')) {
        targeturi = this.element.data('id');
      } else {
        targeturi = document.location.href;
      }
      if (annotation.quote || annotation.relativeSelection) {
        targetsrid = 'urn:uuid:' + this._uuid();
      } else {
        targetsrid = targeturi;
      }
      tempanno = {
        '@context': {
          "oa": "http://www.w3.org/ns/oa#",
          "dc": "http://purl.org/dc/elements/1.1/",
          "cnt": "http://www.w3.org/2011/content#",
          "lorestore": "http://auselit.metadata.net/lorestore/",
          "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
          "austese": "http://austese.net/ns/oa/"
        },
        '@graph': [
          {
            '@id': annotation.id ? annotation.id : 'http://example.org/dummy',
            '@type': 'oa:Annotation',
            'oa:hasBody': {
              '@id': bodysrid
            },
            'oa:hasTarget': {
              '@id': targetsrid
            }
          }, {
            '@id': bodysrid,
            '@type': 'cnt:ContentAsText',
            'cnt:chars': annotation.text,
            'dc:format': 'text/plain'
          }
        ]
      };
      if (annotation.annotatedBy) {
        tempanno['@graph'][0]['oa:annotatedBy'] = {
          '@id': annotation.annotatedBy
        };
        agent = {
          '@id': annotation.annotatedBy,
          'foaf:name': annotation.creator
        };
        tempanno['@graph'].push(agent);
      }
      if (annotation.created) {
        tempanno['@graph'][0]['oa:annotatedAt'] = {
          '@value': annotation.created,
          '@type': 'dcterms:W3CDTF'
        };
      }
      if (annotation.motivation) {
        tempanno['@graph'][0]['oa:motivatedBy'] = {
          '@id': annotation.motivation
        };
      }
      if (annotation.quote || annotation.relativeSelection) {
        targetselid = 'urn:uuid:' + this._uuid();
        specifictarget = {
          '@id': targetsrid,
          '@type': 'oa:SpecificResource',
          'oa:hasSource': {
            '@id': targeturi
          },
          'oa:hasSelector': {
            '@id': targetselid
          }
        };
        tempanno['@graph'].push(specifictarget);
      }
      if (annotation.quote) {
        targetselector = {
          '@id': targetselid,
          '@type': 'oa:Choice',
          'oa:item': [
            {
              '@id': 'urn:uuid:' + this._uuid(),
              '@type': 'austese:RangeSelector',
              'lorestore:startOffset': annotation.ranges[0].startOffset,
              'lorestore:endOffset': annotation.ranges[0].endOffset,
              'lorestore:startElement': annotation.ranges[0].start,
              'lorestore:endElement': annotation.ranges[0].end
            }, {
              '@id': 'urn:uuid:' + this._uuid(),
              '@type': 'oa:TextPositionSelector',
              'oa:start': annotation.startOffset,
              'oa:end': annotation.endOffset
            }
          ],
          'oa:default': {
            '@type': 'oa:TextQuoteSelector',
            '@id': 'urn:uuid:' + this._uuid(),
            'oa:exact': annotation.quote,
            'oa:prefix': annotation.prefix,
            'oa:suffix': annotation.suffix
          }
        };
      } else if (annotation.relativeSelection) {
        targetselector = {
          '@id': targetselid,
          '@type': 'oa:FragmentSelector',
          'rdf:value': 'xywh=' + annotation.relativeSelection.x1 + ',' + annotation.relativeSelection.y1 + ',' + annotation.relativeSelection.width + ',' + annotation.relativeSelection.height
        };
      }
      tempanno['@graph'].push(targetselector);
      data = JSON.stringify(tempanno);
      return data;
    };

    LoreStore.prototype._onError = function(xhr) {
      var action, message;
      action = xhr._action;
      message = Annotator._t("Unable to ") + action + Annotator._t(" this annotation");
      if (xhr._action === 'search') {
        message = Annotator._t("Unable to search the store for annotations");
      } else if (xhr._action === 'read' && !xhr._id) {
        message = Annotator._t("Unable to ") + action + Annotator._t(" the annotations from the store");
      }
      switch (xhr.status) {
        case 401:
          message = Annotator._t("Sorry you are not allowed to ") + action + Annotator._t(" this annotation");
          break;
        case 404:
          message = Annotator._t("Unable to connect to the annotations store");
          break;
        case 500:
          message = Annotator._t("Something went wrong with the annotation store");
      }
      Annotator.showNotification(message, Annotator.Notification.ERROR);
      return console.error(Annotator._t("API request failed:") + (" '" + xhr.status + "'"));
    };

    LoreStore.prototype._findAnnos = function(graph) {
      var found, obj, _i, _len;
      found = [];
      for (_i = 0, _len = graph.length; _i < _len; _i++) {
        obj = graph[_i];
        if (obj['@type'] === 'oa:Annotation') found.push(obj);
      }
      return found;
    };

    LoreStore.prototype._findById = function(graph, id) {
      var found, obj, _i, _len;
      for (_i = 0, _len = graph.length; _i < _len; _i++) {
        obj = graph[_i];
        if (obj['@id'] === id) {
          found = obj;
          break;
        }
      }
      return found;
    };

    LoreStore.prototype._uuid = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r, v;
        r = Math.random() * 16 | 0;
        v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    };

    return LoreStore;

  })(Annotator.Plugin);

}).call(this);
