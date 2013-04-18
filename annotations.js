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