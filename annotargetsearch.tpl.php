<div id="metadata" data-op="search"
  <?php if(user_access('administer site configuration')) { print "data-useradmin='true'";} ?>  
  data-userid="<?php global $user; print url('user/' . $user->uid, array('absolute' => TRUE)); ?>">
</div>
<form class="form-search" action="javascript:void(0)">

   <!--   insert search for digital resources -->
   <input placeholder="Enter URL of target resource..." class="input-xlarge" id="annoInput" name="annotates" type="text"/>
   <input type="hidden" name="asTriples" value="false"/>
   <button id="annoSearchBtn" class="xlarge btn btn-primary">Search</button>
</form>
<hr class="mute"/>

<div id="annoSearchResult">
</div>
