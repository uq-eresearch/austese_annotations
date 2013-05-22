if (!console){
    var console = {};
}
if (!console.log){
    console.log = function(){};
}
jQuery.fn.serializeObject = function() {
     var o = {};
     var a = this.serializeArray();
     jQuery.each(a, function() {
         if (o[this.name] !== undefined) {
             if (!o[this.name].push) {
                 o[this.name] = [o[this.name]];
             }
             o[this.name].push(this.value || '');
         } else {
             o[this.name] = this.value || '';
         }
     });
     return o;
};

function enableAnnotations(){
    // todo check if logged in
    jQuery('[data-id]').waitForImages(function(){
      jQuery('[data-id]').each(function(i, el){
        enableAnnotationsOnElement(el);
      });
    });
}
function enableAnnotationsOnElement(el) {
  if (!el.annotationsEnabled){
      jQuery(el).annotator({'bindToDocument': true})
      .annotator('addPlugin','Image')
      .annotator('addPlugin', 'Prov')
      .annotator('addPlugin', 'CharRangeSelection')
      .annotator('addPlugin','LoreStore')
      .annotator('addPlugin', 'Reply')
      .annotator('addPlugin', 'Motivations',{
        "showField": false, // will display via prov plugin field instead
        "motivations":[
          {
            value: "oa:Commenting",
            label: "Comment"
          },
          {
            value: "oa:Questioning",
            label: "Question"
          },
          {
            value: "austese:TextualNote",
            label: "Textual Note"
          },
          {
            value: "austese:ExplanatoryNote",
            label: "Explanatory Note"
          },
          {
            value: "austese:HistoricalNote",
            label: "Historical Note"
          },
          {
            value: "austese:BiographicalNote",
            label: "Biographical Note"
          },
          {
            value: "austese:GeographicalNote",
            label: "GeographicalNote"
          },
          {
            value: "austese:Glossary",
            label: "Glossary"
          },
          {
            value: "austese:ClassicalAllusion",
            label: "Classical Allusion"
          },
          {
            value: "austese:BiblicalAllusion",
            label: "Biblical Allusion"
          },
          {
            value: "austese:PerformanceNote",
            label: "Performance Note"
          },
          {
            value: "oa:replying",
            label: "Reply"
          }/*,
          {
            value: "oa:tagging",
            label: "Tag"
          }*/
      ]});
      el.annotationsEnabled = true;
  }
}
function lookup(graph, id){
    if (!graph || !id) return;
    var found, obj, _i, _len;
    for (_i = 0, _len = graph.length; _i < _len; _i++) {
        obj = graph[_i];
        if (obj['@id'] === id) {
          found = obj;
          break;
        }
    }
    return found;
}
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r, v;
    r = Math.random() * 16 | 0;
    v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};
function displayAnnotations(options){
    var myUserId = jQuery('#metadata').data('userid');
    var userAdmin = jQuery('#metadata').data('useradmin');
    // for each graph entry with type annotation
    var nodes = options.annos['@graph'];
    var count = 0;
    var tempElement = jQuery("<div></div>");
    jQuery.each(nodes,function(index, node){
        var type = node['@type'];
        if (type && type == "oa:Annotation"){
            count ++;
            var creator = lookup(nodes, node.annotatedBy);
            var creatorString = "";
            if (creator) {
                console.log("creator is ",creator)
                creatorString = "by <a href='" + node.annotatedBy + "'>" + (creator.name || creator['foaf:name']) + "</a>, ";
            }
            var heading="Annotation";
            // TODO look up motivations rather than hardcode them here
            if (node.motivatedBy){
                var mb = node.motivatedBy;
                if (mb.match("oa:replying")) {
                    heading = "Reply";
                } else if (mb.match("oa:commenting")) {
                    heading="Comment";
                } else if (mb.match("oa:questioning")) {
                    heading="Question";
                } else if (mb.match("austese:TextualNote")) {
                    heading="Textual Note";
                } else if (mb.match("austese:ExplanatoryNote")){
                    heading="Explanatory Note";
                } else if (mb.match("austese:HistoricalNote")) {
                    heading="Historical Note";
                } else if (mb.match("austese:BiographicalNote")) {
                    heading="Biographical Note";
                } else if (mb.match("austese:Glossary")){
                    heading="Glossary";
                } else if (mb.match("austese:ClassicalAllusion" )){
                    heading="Classical Allusion";
                } else if (mb.match("austese:BiblicalAllusion")){
                    heading="Biblical Allusion";
                }
            }
            var annotatesString = "";
            var createdString = node.annotatedAt ? jQuery.timeago(new Date(node.annotatedAt['@value'])) : "Unknown date";
            // look for a specific target and if there is one with 'exact', display that as a blockquote snippet
            var hasTarget = node.hasTarget;
            if (Object.prototype.toString.call( hasTarget ) !== '[object Array]' && hasTarget && hasTarget.match("^urn:uuid")) {
                // FIXME: handle multiple targets
                // annotates specific target
                var st = lookup(nodes, node.hasTarget);
                if (st){
                    annotatesString += "<p>Annotates <span data-targeturi='" + st.hasSource + "'><a href='" + st.hasSource + "'>" + st.hasSource +"</a></span></p>";
                    var selector = lookup(nodes,st.hasSelector);
                    if (selector && selector['@type']=='oa:Choice'){
                        // text selector
                        var textsel = lookup(nodes,selector['default']);
                        if (textsel){
                            annotatesString += "<p><em>" + textsel.exact + "</em></p>"; 
                        }
                    } else if (selector && selector['@type']=='oa:FragmentSelector'){
                        // image selector
                        annotatesString += "<p><em>(Image selection)</em><p>"
                    }
                }
            } else if (Object.prototype.toString.call( hasTarget ) !== '[object Array]' && hasTarget && hasTarget.match("^http")){
                // annotates entire resource - most likely a reply
                annotatesString = "<p>Annotates <span data-targeturi='" + hasTarget + "'><a href='" + hasTarget + "'>" + hasTarget + "</a></span></p>";
            }
            
            var result = "<div" + (node.annotatedAt? " data-timestamp='" + node.annotatedAt['@value'] + "'": "") + " class='well white-well " + options.cls + "' data-annoid='" + node['@id'] + "'>"
                 + "<p class='pull-right'>"
                    
                    + (myUserId == node.annotatedBy || userAdmin? 
                        (//"&nbsp;&nbsp;<a title='Edit this annotation' class='annoEditBtn' href='javascript:void(0)'><i class='icon-pencil'/></a>"
                        //+ 
                        "&nbsp;&nbsp;<a title='Delete this annotation' class='annoDeleteBtn' href='javascript:void(0)'><i class='icon-remove'/></a>")
                        : "")
                    + "&nbsp;&nbsp;<a title='Share link to this annotation' class='annoShareBtn' href='javascript:void(0)'><i class='icon-share'/></a>"
                    + ((options.displayReplies && heading != 'Reply')? "&nbsp;&nbsp;<a title='Reply to this annotation' class='annoReplyBtn' href='javascript:void(0)'><i class='icon-reply'/></a>" : "")
                    +"</p>"
                 + (options.displayReplies? "<h4>" + heading + "</h4>" : "")
                 + "<p><small>" + creatorString + "<a href='" + node['@id'] + "'>" + createdString + "</a></small></p>"
                 + (options.displayReplies? annotatesString : ""); 
            var body = lookup(nodes,node.hasBody);
            
            if (body && body.chars){
                result += "<blockquote>" + body.chars + "</blockquote>";
            }
            
            result += "<p style='display:none' class='shareURL'><input style='cursor:text' title='Copy unique identifier for this Annotation' name='annoId' type='text' class='input-xxlarge' readonly value='" + node['@id'] + "'/>";
            if (options.displayReplies && heading != 'Reply') {
                result += "<div class='replies'></div>";
            }
            
            result += "</div>";
            tempElement.append(result);
        }
        
    }); // end each
    var resultElems = tempElement.children('div').sort(function(a,b){
        var tsa = jQuery(a).data('timestamp');
        var tsb = jQuery(b).data('timestamp');
        var tempDate = new Date();
        if (!tsb) {
            tsb = tempDate;
        } else {
            tsb = new Date(tsb);
        }
        if (!tsa) {
            tsa = tempDate;
        } else {
            tsa = new Date(tsa);
        }
        //console.log("is " + tsa + " greater than " + tsb,tsa > tsb)
        return tsa > tsb;
    });
    options.displayElement.append(resultElems);
    // TODO update placeholders for targets with further ajax requests
    if (options.displayReplies) {
        jQuery('.replies').each(function(i,el){
            // ajax request to load replies
            var container = jQuery(el).parent();
            var annoid = container.data('annoid');
            jQuery.ajax({
                type: 'GET',
                url: '/lorestore/oa/',
                dataType: "json",
                data: {
                    'annotates': annoid
                },
                headers: {
                    'Accept': 'application/json'
                },
                success: function(result){
                    // collapsible element that displays replies
                    jQuery(el).append('<p data-toggle="collapse" data-target="#r' + i + '-replies" class="reply-count collapsed"></p>');
                    var repliesEl = jQuery('<div class="replies-collapse collapse in" id="r' + i + '-replies"></div>');
                    jQuery(el).append(repliesEl);
                    repliesEl.collapse();
                    displayAnnotations({
                        annos: result, 
                        cls: 'reply',
                        displayReplies: false, 
                        displayElement: repliesEl
                    });
                    
                }
            });
        });
        jQuery('.annoReplyBtn').on('click',function(){
            var container = jQuery(this).parent().parent();
            if (container.find('.replyEditor').length == 0){
                // ensure replies are visible
                container.find('.replies-collapse').collapse('show');
                // insert reply editor
                var replyEditor = jQuery("<div class='well white-well replyEditor'><textarea class='input-xxlarge' rows='4' placeholder='Edit reply...'></textarea><br /><button class='saveReplyBtn btn btn-small'>Save</button> <button class='cancelReplyBtn btn btn-small'>Cancel</button></div>");
                container.append(replyEditor);
                // scroll to editor
                replyEditor[0].scrollIntoView();
                // button handlers
                container.find('.cancelReplyBtn').on('click',function(){
                    // remove reply editor on cancel
                    jQuery(this).parent().remove();
                });
                container.find('.saveReplyBtn').on('click',function(){
                    // save reply
                    var annoid = "http://www.example.org/dummy";
                    var bodysrid = "urn:uuid:" + uuid(); // generate new id for body
                    var rootannoid = jQuery(this).parent().parent().data('annoid');
                    var replytext = jQuery(this).prev().prev().val();
                    var newReply = {
                      "@context": {
                        "oa": "http://www.w3.org/ns/oa#",
                        "cnt": "http://www.w3.org/2011/content#"
                      },
                      "@graph": [
                       {
                         "@id": annoid,
                         "@type": "oa:Annotation",
                         "oa:motivatedBy": {"@id": "oa:replying"},
                         "oa:hasBody": {"@id": bodysrid},
                         "oa:hasTarget": {"@id": rootannoid}
                       },{
                           "@id": bodysrid,
                           "@type": "cnt:ContentAsText",
                           "cnt:chars": replytext,
                           "dc:format": "text/plain" 
                       }
                      ]
                    };
                    
                    jQuery.ajax({
                        type: 'POST',
                        url: '/lorestore/oa/',
                        dataType: "json",
                        processData: false,
                        data: JSON.stringify(newReply),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        success: function(data){
                            // remove editor on successful save
                            container.find('.replyEditor').remove();
                            // update replies for current annotation
                            displayAnnotations({
                                annos: data, 
                                cls: 'reply',
                                displayReplies: false, 
                                displayElement: container.find('.replies-collapse')
                            });
                        },
                        error: function(xhr, status, error){
                            // alert error and keep editor visible on failure to save
                            console.log("error saving reply",xhr,status,error);
                            container.find('.replyEditor').parent().append("<p class='alert alert-error'><button type='button' class='close' data-dismiss='alert'>&times;</button> Unable to save reply: " + error + "</p>");
                        }
                    });
                });
            }
        });
    } else {
        options.displayElement.parent().find('.reply-count').html("<small>" + (count==0?"No": count) + " repl" + (count==1?"y":"ies") + "</small>");
    }
    jQuery('.annoShareBtn').off('click');
    jQuery('.annoShareBtn').on("click",function(e){
        var container = jQuery(this).parent().parent();
        container.find('.shareURL:first').toggle().find('input').select();
    });
    jQuery('.annoDeleteBtn').off('click')
    jQuery('.annoDeleteBtn').on('click', function(){
        // TODO warn if annotation has replies - replies are not deleted
        var container = jQuery(this).parent().parent()
        var annoid = container.data('annoid');
        jQuery.ajax({
            type: 'DELETE',
            url: annoid,
            success: function(d){
                // TODO: add a restore link?
                container.removeClass('white-well')
                    .addClass('alert')
                    .addClass('alert-success')
                    .html("<button type='button' class='close' data-dismiss='alert'>&times;</button>Annotation deleted");
            },
            error: function(xhr, status, error){
                console.log("error deleting anno",xhr,status,error);
                container.append("<p class='alert alert-error'><button type='button' class='close' data-dismiss='alert'>&times;</button> Unable to delete annotation: " + error + "</p>");
            }
        });
    });

}
function displayById(id){
    jQuery.ajax({
        type: 'GET',
        url: id,
        dataType: "json",
        headers: {
            'Accept': 'application/json'
        },
        success: function(result){
            displayAnnotations({
                annos: result, 
                cls: 'anno',
                displayReplies: true, 
                displayElement: jQuery('#annoSearchResult')
            });
        }
    }); 
}
function displayAnnotationSearchResults(data){
    var feedUrl = '/lorestore/oa/feed/?' + jQuery.param(data);
    jQuery.ajax({
        type: 'GET',
        url: '/lorestore/oa/',
        dataType: "json",
        data: data,
        headers: {
            'Accept': 'application/json'
        },
        success: function(result){
            if (data.annotates || data.matchval) {
              jQuery('#annoSearchResult')
                .empty()
                .append("<p><a target='_blank' title='Feed of matching Annotations' href='" + feedUrl + "'>Subscribe</a></p>")
            }
            displayAnnotations({
                annos: result, 
                cls: 'anno',
                displayReplies: true, 
                displayElement: jQuery('#annoSearchResult')
            });
        }
    }); 
}

function updatePager(page, numPages){
    var startIndex = Math.max(0,page - 5);
    var endIndex = Math.min(numPages, page+5);
    if (page <= 5){
        endIndex += (5 - page);
        endIndex = Math.min(endIndex,numPages);
    }
    jQuery('#pager').empty();
    if (startIndex > 0){
      jQuery('#pager').append(jQuery("<li><a href='javascript:void(0)'>&laquo;</a></li>").click(function(){
        //loadObjects(page-1);
        console.log("load " + (page-1))
     }));
   }
   for (i = startIndex; i < endIndex; i++){
      jQuery('#pager').append("<li class='pagebtn" + (page == (i+1)? " active": "")+ "'><a href='javascript:void(0)'>" + (i + 1) + "</a></li>");
   }
   jQuery('.pagebtn').click(function(){
       var pageNum = parseInt(jQuery(this).html() - 1);
       //loadObjects(pageNum);
       console.log("load " + pageNum)
   });
   if(numPages > endIndex){
       jQuery('#pager').append(jQuery("<li><a href='javascript:void(0)'>&raquo;</a></li>").click(function(){
          //loadObjects(page+1);
        console.log("load " + (page+1))
       }));
   }
}
function loadAnnotations(page){
    //var pageSize = 10;
    var myUserId = jQuery('#metadata').data('userid');
    // attach handler to annotation search button
    jQuery('#annoSearchBtn').click(function(){
        var data = jQuery(this).closest('.form-search').serializeObject();
        
        //data.offset = (page? page * pageSize : 0);
        //data.limit = pageSize;
        
        // display annotation results
        displayAnnotationSearchResults(data);
    });
    if (jQuery('#metadata').data('op') == 'user'){
        // search for annotations created by this user for My Annotations page
        var data = {
                'asTriples': false,
                'matchval': myUserId,
                'matchpred': 'http://www.w3.org/ns/oa#annotatedBy'
        };
        //data.offset = page? page * pageSize: 0;
        //data.limit = pageSize;
        displayAnnotationSearchResults(data);
    }
    if (jQuery('#metadata').data('op') == 'id') {
        // display an annotation by id for the id search page
        var id = jQuery('#metadata').data('annoid');
        if (id){
            displayById(id);
        }
    }
}

jQuery().ready(function(){
    loadAnnotations(0);
});

