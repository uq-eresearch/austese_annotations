function enableAnnotations(){
    // todo check if logged in
    jQuery('[data-id]').waitForImages(function(){
      jQuery('[data-id]')
      .annotator()
      .annotator('addPlugin','Image')
       //.annotator('addPlugin', 'Tags')
      .annotator('addPlugin','LoreStore');
    })
}