var DocumentEvents = {

  initialize: function() {
    this.bindKeyboard();
    $('#search-form-div .hash-tag-input').focus();
  },

  bindKeyboard: function() {
    $('.hash-tag-input').bind('keypress', function(e) {
      if (e.which == 13) {
        e.preventDefault();
        $(this).closest('form').submit();
      }
      var regex = new RegExp("^[a-zA-Z0-9_-]+$");
      var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
      if (!regex.test(key)) {
         e.preventDefault();
         return false;
      }
    }); 
  },

  hideSearchForm: function() {
    $('#search-form-div').addClass('hidden');
  },

  showMap: function() {
    setTimeout(function() {
      $('#map-div').css('z-index', '1');
    }, 300);
  }
}
