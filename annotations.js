function enableAnnotations(){
    // todo check if logged in
    jQuery('[data-id]').waitForImages(function(){
      jQuery('[data-id]').each(function(i, el){
          if (!el.annotationsEnabled){
              jQuery(el).annotator()
              .annotator('addPlugin','Image')
              .annotator('addPlugin', 'Motivations')
              .annotator('addPlugin', 'Prov')
              .annotator('addPlugin','LoreStore');
              el.annotationsEnabled = true;
          }
      });    
      
    })
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
function displayAnnotations(options){
    var displayReplies = options.displayReplies;
    var myUserId = jQuery('#metadata').data('userid');
    // for each graph entry with type annotation
    var nodes = options.annos['@graph'];
    var count = 0;
    jQuery.each(nodes,function(index, node){
        var type = node['@type'];
        if (type && type == "oa:Annotation"){
            count ++;
            var creator = lookup(nodes, node.annotatedBy);
            var creatorString = "";
            if (creator) {
                creatorString = "by <a href='" + node.annotatedBy + "'>" + creator.name + "</a>, ";
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
                    annotatesString += "<p>Annotates <span data-targeturi='" + st.hasSource + "'>" + st.hasSource + "</span></p>";
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
            
            var result = "<div class='" + options.cls + " well white-well' data-annoid='" + node['@id'] + "'>"
                 + "<p class='pull-right'>"
                    + (displayReplies? "<a title='Reply to this annotation' class='annoReplyBtn' href='javascript:void(0)'><i class='icon-comment'/></a>" : "")
                    + (myUserId == node.annotatedBy? 
                        ("&nbsp;&nbsp;<a title='Edit this annotation' class='annoEditBtn' href='javascript:void(0)'><i class='icon-pencil'/></a>"
                        + "&nbsp;&nbsp;<a title='Delete this annotation' class='annoDeleteBtn' href='javascript:void(0)'><i class='icon-remove'/></a>")
                        : "")
                    + "&nbsp;&nbsp;<a title='Share link to this annotation' class='annoShareBtn' href='javascript:void(0)'><i class='icon-share'/></a></p>"
                 + (displayReplies? "<h4>" + heading + "</h4>" : "")
                 + "<p><small>" + creatorString + "<a href='" + node['@id'] + "'>" + createdString + "</a></small></p>"
                 + (displayReplies? annotatesString : ""); 
            var body = lookup(nodes,node.hasBody);
            
            if (body){
                result += "<blockquote>" + body.chars + "</blockquote>";
            }
            
            result += "<p style='display:none' class='shareURL'><input style='cursor:text' title='Copy unique identifier for this Annotation' name='annoId' type='text' class='input-xxlarge' readonly value='" + node['@id'] + "'/>";
            if (displayReplies) {
                result += "<div class='replies'></div>";
            }
            
            result += "</div>";
            options.displayElement.append(result);
        }
        
    }); // end each
    // TODO update placeholders for targets and replies with further ajax requests
    if (displayReplies) {
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
            // insert reply editor
        });
    } else {
        options.displayElement.parent().find('.reply-count').html("<small>" + (count==0?"No":"<i cls='icon-play'> " + count) + " repl" + (count==1?"y":"ies") + "</small>");
    }
    jQuery('.annoShareBtn').on("click",function(){
        var container = jQuery(this).parent().parent();
        container.find('.shareURL').toggle().find('input').select();
    });
    jQuery('.annoDeleteBtn').on('click', function(){
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
            }
            // TODO handle errors by adding an alert to container
        });
    });
}
function displayAnnotationSearchResults(data){
    var feedUrl = '/lorestore/oa/?' + jQuery.param(data);
    jQuery.ajax({
        type: 'GET',
        url: '/lorestore/oa/',
        dataType: "json",
        data: data,
        headers: {
            'Accept': 'application/json'
        },
        success: function(result){
            jQuery('#annoSearchResult')
                .empty()
                .append("<div><a target='_blank' title='Feed of Annotations matching this search' href='" + feedUrl + "'>Subscribe<i icon-class='icon-rss'/></a></div>")
            displayAnnotations({
                annos: result, 
                cls: 'anno',
                displayReplies: true, 
                displayElement: jQuery('#annoSearchResult')
            });
        }
    }); 
}

jQuery().ready(function(){
    var myUserId = jQuery('#metadata').data('userid');
    // attach handler to annotation search button
    jQuery('#annoSearchBtn').click(function(){
        // search for annotations
        var searchWhere = jQuery('#annoSearchWhere').val();
        var searchTerm = jQuery('#annoInput').val();
        var data = {
            'asTriples': false,
            'matchval': searchTerm
        };
        if (searchWhere == "creator") {
            data.matchpred = "http://www.w3.org/ns/oa#annotatedBy";
        }
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
        displayAnnotationSearchResults(data);
    }
});



// template for replies
/*
 var annoid = "http://www.example.org/dummy";
var bodysrid = ""; // generate new id for body
var rootannoid = "";
var replytext = "";
{
  '@context': {
    "oa": "http://www.w3.org/ns/oa#",
    "cnt": "http://www.w3.org/2011/content#"
  },
  '@graph': [
   {
     '@id': annoid,
     '@type': 'oa:Annotation',
     'oa:motivatedBy': 'oa:replying',
     'oa:hasBody': {'@id': bodysrid},
     'oa:hasTarget': {'@id': rootannoid},
   },{
       '@id': bodysrid,
       '@type': 'cnt:ContentAsText',
       'cnt:chars': replytext,
       'dc:format': 'text/plain' 
   }
  ]
}
*/