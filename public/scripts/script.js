$( document ).ready(function() {
  $( "#greenbutton" ).click(function(e) {
    e.preventDefault();
    $( "#fuckthisform" ).submit();
  });
});

$('#dropdownstick .dropdown-menu').on({
	"click":function(e){
      e.stopPropagation();
    }
});
