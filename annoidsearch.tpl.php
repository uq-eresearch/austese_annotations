<div id="metadata"
  data-op="id"
  data-annoid='<?php print $_GET["uri"]; ?>'
  <?php if(user_access('administer site configuration')) { print "data-useradmin='true'";} ?> 
  data-userid="<?php global $user; print url('user/' . $user->uid, array('absolute' => TRUE)); ?>">
</div>

<div id="annoSearchResult">
</div>
