function DocumentEvents() {
  if (!(this instanceof DocumentEvents)) return new DocumentEvents();
}

DocumentEvents.prototype.initialize = function() {
  this.bindKeyboard();
}

DocumentEvents.prototype.bindKeyboard = function(data) {
  $('#hashTag').bind('keypress', function(e) {
    var regex = new RegExp("^[a-zA-Z0-9_-]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
       event.preventDefault();
       return false;
    }
  }); 
}

DocumentEvents.prototype.hideSearchForm = function(post) {
  $('#search-form-div').addClass('hidden');
}

MessageHandler.prototype.showMap = function() {
  $('map-div').removeClass('hidden');
}
