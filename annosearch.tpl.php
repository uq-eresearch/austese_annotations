<div id="metadata" data-op="search" 
  <?php if(user_access('administer site configuration')) { print "data-useradmin='true'";} ?> 
  data-userid="<?php global $user; print url('user/' . $user->uid, array('absolute' => TRUE)); ?>">
</div>
<form class="form-search" action="javascript:void(0)">
   <input placeholder="Enter keywords..." class="input-xlarge" id="annoInput" name="matchval" type="text"/>
   <input type="hidden" name="asTriples" value="false"/>
   <button id="annoSearchBtn" class="xlarge btn btn-primary">Search</button>
   
</form>
<hr class="mute"/>

<div id="annoSearchResult">
</div>
<div class="pagination">
  <ul id="pager">
  </ul>
</div>

