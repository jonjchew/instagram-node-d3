var DocumentEvents = {

  initialize: function() {
    this.bindKeyboard();
    $('#hashTag').focus();
  },

  bindKeyboard: function() {
    $('#hashTag').bind('keypress', function(e) {
      if (e.which == 13) {
        e.preventDefault();
        $("#hashTagForm").submit();
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
  }
}
