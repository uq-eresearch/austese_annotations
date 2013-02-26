<link rel="stylesheet" href="/sites/all/libraries/ext-4.1.1a/resources/css/ext-all.css">
<link rel="stylesheet" href="/sites/all/libraries/ext-4.1.1a/resources/css/ext-all-gray.css">
<link rel='stylesheet' href='/<?php print drupal_get_path('module', 'annotations'); ?>/lib/annotator.min.css'>
<?php 

if (property_exists($user,'data')){
 $fullscreen = $user->data['fullscreen'];
} else {
 $fullscreen = false;
}
?>
<div id="metadata"
 <?php if ($fullscreen):?>
 data-fullscreen="<?php print $fullscreen; ?>"
 <?php endif; ?>
 data-modulepath="<?php print drupal_get_path('module', 'annotations'); ?>">
</div>
<!--  div id="uiplaceholder"></div-->

<div>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vel mattis diam. Vestibulum placerat purus vitae elit rutrum ut luctus felis placerat. Quisque sit amet sollicitudin nisl. Aliquam fringilla dolor eget dui venenatis eleifend. In hac habitasse platea dictumst. Praesent bibendum faucibus cursus. Aenean ultricies vehicula augue, eget congue metus ultricies sed. Praesent pretium risus eleifend tellus molestie rhoncus. Pellentesque sodales consectetur faucibus. Quisque nec urna quam, vitae iaculis ante. Phasellus cursus convallis velit id dapibus. Aenean non nunc purus, ut feugiat est. Duis ac leo tellus. Mauris pharetra varius felis.
</p><p>
Fusce faucibus dapibus augue, eu varius libero semper at. Donec quis vulputate magna. Cras tristique molestie nunc, luctus porttitor justo egestas accumsan. Nunc et felis lacus. Nullam eu nisi quis nulla varius euismod. Phasellus tempus turpis diam. Mauris pretium rutrum eros, tempus venenatis nisl venenatis ut. Praesent id faucibus nisi. Sed a luctus eros. In sollicitudin cursus molestie. In hac habitasse platea dictumst. Quisque rhoncus purus et magna vestibulum a hendrerit neque auctor. Quisque faucibus dolor id purus condimentum mollis. Phasellus rhoncus, erat eget sagittis pellentesque, ipsum urna sodales nisl, eu sagittis dolor enim ut justo. Donec eros neque, suscipit sit amet sodales eget, tincidunt id ipsum.
</p><p>
Proin vitae nisl odio. Sed mattis lobortis libero in egestas. Nam ut aliquam mauris. Donec quis diam tellus, dictum vestibulum mauris. Suspendisse potenti. Maecenas gravida semper lacinia. Phasellus aliquet tellus vitae nisi interdum quis imperdiet massa tempus. Nullam gravida rutrum sollicitudin. Aenean mollis nibh non neque commodo convallis. Aliquam arcu turpis, malesuada nec dapibus sit amet, vehicula at orci. Curabitur id sapien purus.
</p><p>
Vestibulum turpis ipsum, rhoncus in placerat sodales, blandit eu tellus. Ut ullamcorper metus vel erat adipiscing pulvinar. Nulla facilisi. Donec sed ante nulla, eu ullamcorper arcu. Sed mollis, risus et posuere pulvinar, sapien lectus ullamcorper nisl, eget ultrices tortor mi ut lectus. Phasellus sodales elit ac dui blandit pharetra at eu enim. Duis a viverra mi. Maecenas odio sem, lobortis sit amet tempus eu, bibendum et orci. Pellentesque ornare, diam vel tincidunt facilisis, turpis elit interdum urna, non fermentum purus lacus eu nisl. Proin vel quam ipsum. In felis metus, fringilla tristique aliquam at, tristique vel justo. Ut sagittis volutpat massa nec feugiat. Maecenas sed odio non mauris porta consectetur ut consectetur est. Etiam aliquam vestibulum sagittis. Donec pellentesque, diam vitae bibendum sagittis, erat nunc dictum quam, nec dapibus sem mauris eu leo.
</p><p>
Sed ut leo dui. Nulla facilisi. Quisque turpis justo, imperdiet at sagittis non, pretium volutpat sem. Pellentesque mattis interdum dui, ac aliquet justo luctus a. Nunc vehicula justo purus. Pellentesque arcu nibh, blandit vitae luctus ac, rhoncus et elit. Suspendisse eget diam nunc, ut laoreet nulla.
</p>
</div>
<script>
 window.addEventListener("load", function(){
     
  jQuery(document.body)
   .annotator()
   .annotator('addPlugin','Permissions')
   .annotator('addPlugin', 'Tags');
  
 });
</script>