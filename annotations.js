function enableAnnotations(){
    // todo check if logged in
    jQuery('[data-id]')
     //jQuery(document.body)
      .annotator()
      .annotator('addPlugin','Image')
       //.annotator('addPlugin', 'Tags')
      .annotator('addPlugin','LoreStore');
}