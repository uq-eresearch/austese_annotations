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
      .annotator('addPlugin', 'Motivations')
      .annotator('addPlugin', 'Prov')
      .annotator('addPlugin', 'CharRangeSelection')
      .annotator('addPlugin','LoreStore');
      el.annotationsEnabled = true;
  }
}
