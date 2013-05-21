<div id="metadata" data-op="search" 
  <?php if(user_access('administer site configuration')) { print "data-useradmin='true'";} ?> 
  data-userid="<?php global $user; print url('user/' . $user->uid, array('absolute' => TRUE)); ?>">
</div>
<form class="form-search" action="javascript:void(0)">

   <!--   insert search for digital resources -->
   <select class="input-xlarge" id="annoInput" name="matchval">
     <option value="http://www.w3.org/ns/oa#commenting">Comment</option>
     <option value="http://www.w3.org/ns/oa#questioning">Question</option>
     <option value="http://www.w3.org/ns/oa#replying">Reply</option>
     <option value="http://austese.net/ns/oa/TextualNote">Textual Note</option>
     <option value="http://austese.net/ns/oa/ExplanatoryNote">Explanatory Note</option>
     <option value="http://austese.net/ns/oa/HistoricalNote">Historical Note</option>
     <option value="http://austese.net/ns/oa/BiographicalNote">Biographical Note</option>
     <option value="http://austese.net/ns/oa/Glossary">Glossary</option>
     <option value="http://austese.net/ns/oa/ClassicalAllusion">Classical Allusion</option>
     <option value="http://austese.net/ns/oa/BiblicalAllusion">Biblical Allusion</option>
    </select>
    <input type="hidden" name="asTriples" value="false"/>
    <input type="hidden" name="matchpred" value="http://www.w3.org/ns/oa#motivatedBy"/>
    <button id="annoSearchBtn" class="xlarge btn btn-primary">Search</button>
</form>
<hr class="mute"/>

<div id="annoSearchResult">
</div>
