<div id="metadata" data-op="search" data-userid="<?php global $user; print url('user/' . $user->uid, array('absolute' => TRUE)); ?>"></div>
<form class="form-search" action="javascript:void(0)">
   <input class="input-xlarge" id="annoInput" name="matchval" type="text"/>
   <input type="hidden" name="asTriples" value="false"/>
   <button id="annoSearchBtn" class="xlarge btn btn-primary">Search</button>
   
</form>
<hr class="mute"/>

<div id="annoSearchResult">
</div>

