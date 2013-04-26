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
function displayAnnotationSearchResults(data){
    jQuery.ajax({
        type: 'GET',
        url: '/lorestore/oa/',
        dataType: "json",
        data: data,
        headers: {
            'Accept': 'application/json'
        },
        success: function(result){
            jQuery('#annoSearchResult').empty();
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
            var myUserId = jQuery('#metadata').data('userid');
            // for each graph entry with type annotation
            var nodes = result['@graph'];
            jQuery.each(nodes,function(index, node){
                // TODO pick out relevant fields and display annotation using template
                var type = node['@type'];
                if (type && type == "oa:Annotation"){
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
                            //console.log("specific target",st,selector);
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
                    
                    var result = "<div class='well white-well' data-annoid='" + node['@id'] + "'>"
                         + "<p class='pull-right'><span class='replies'></span> "
                            + "<a title='Reply to this annotation' class='annoReplyBtn' href='javascript:void(0)'><i class='icon-comment'/></a>"
                            + (myUserId == node.annotatedBy? 
                                ("&nbsp;&nbsp;<a title='Edit this annotation' class='annoEditBtn' href='javascript:void(0)'><i class='icon-pencil'/></a>"
                                + "&nbsp;&nbsp;<a title='Delete this annotation' class='annoDeleteBtn' href='javascript:void(0)'><i class='icon-remove'/></a>")
                                : "")
                            + "&nbsp;&nbsp;<a title='Share link to this annotation' class='annoShareBtn' href='javascript:void(0)'><i class='icon-share'/></a></p>"
                         + "<h3>" + heading + "</h3>" + annotatesString ;
                         
                    var body = lookup(nodes,node.hasBody);
                    if (body){
                        result += "<blockquote>" + body.chars + "</blockquote>";
                    }
                    result += "<p>" + creatorString + "<a href='" + node['@id'] + "'>" + createdString + "</a></p>";
                    result += "<p style='display:none' class='shareURL'><input style='cursor:text' title='Copy unique identifier for this Annotation' name='annoId' type='text' class='input-xxlarge' readonly value='" + node['@id'] + "'/>";
                    
                    
                    result += "</div>";
                    jQuery('#annoSearchResult').append(result);
                    // TODO display replies
                }
                
            }); // end each
            // TODO update placeholders for targets and replies with further ajax requests
            jQuery('.replies').each(function(i,el){
                // ajax request to load replies
            });
            jQuery('.annoShareBtn').on("click",function(){
                var container = jQuery(this).parent().parent();
                container.find('.shareURL').toggle().find('input').select();
            });
            jQuery('.annoReplyBtn').on('click',function(){
                
            });
        }
    }); // end ajax request
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
        var data = {
                'asTriples': false,
                'matchval': myUserId,
                'matchpred': 'http://www.w3.org/ns/oa#annotatedBy'
        };
        displayAnnotationSearchResults(data);
    }
});

// template for displaying annotation search results in a list
//motivation by creator, created view reply edit delete
//body


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