/* Keep the shortlist available without making mobile visitors scroll past it. */
(function () {
 'use strict';
 const review=document.querySelector('[data-enquiry-review]');
 if(!review)return;
 const mobile=window.matchMedia('(max-width:880px)');
 function update(){review.open=!mobile.matches;}
 mobile.addEventListener('change',update);
 update();
})();
