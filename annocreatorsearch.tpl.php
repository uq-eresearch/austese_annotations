<div id="metadata" data-op="search" 
  <?php if(user_access('administer site configuration')) { print "data-useradmin='true'";} ?> 
  data-userid="<?php global $user; print url('user/' . $user->uid, array('absolute' => TRUE)); ?>">
</div>
<form class="form-search" action="javascript:void(0)">

   <!--   insert search for digital resources -->
   <select class="input-xlarge" id="annoInput" name="matchval">
   <?php $query = db_select('users', 'u');
    $query->fields('u', array('name', 'uid'));
    $result = $query->execute();
    while($record = $result->fetchAssoc()) {
       if ($record['uid'] != 0) {
         print_r('<option value="' 
           . url('user/' . $record['uid'], array('absolute' => TRUE)) 
           . '">'. $record['name'] . '</option>');
        }
    }?>
     
    </select>
    <input type="hidden" name="asTriples" value="false"/>
    <input type="hidden" name="matchpred" value="http://www.w3.org/ns/oa#annotatedBy"/>
    <button id="annoSearchBtn" class="xlarge btn btn-primary">Search</button>
</form>
<hr class="mute"/>

<div id="annoSearchResult">
</div>
