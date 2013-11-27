<div id="metadata" data-op="search" 
  <?php if(user_access('administer site configuration')) { print "data-useradmin='true'";} ?> 
  data-userid="<?php global $user; print url('user/' . $user->uid, array('absolute' => TRUE)); ?>">
</div>
<form class="form-search" action="javascript:void(0)">

   <!--   insert search for digital resources -->
    <input placeholder="Enter tag" class="input-xlarge" id="annoInput" name="matchval" type="text"/>
    <input type="hidden" name="asTriples" value="false"/>
    <input type="hidden" name="matchpred" value="http://www.w3.org/2011/content#chars"/>
    <button id="annoSearchBtn" class="xlarge btn btn-primary">Search</button>
</form>
<hr class="mute"/>

<div id="annoSearchResult">
</div>

<div class="pagination">
  <ul id="pager">
  </ul>
</div>