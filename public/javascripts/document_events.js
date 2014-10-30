var DocumentEvents = {

  initialize: function() {
    this.bindKeyboard();
    this.bindModal();
    this.resetFirstSearchForm();
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

  submitHashTag: function(hashTag) {
    this.hideSearchForm();
    this.showMap();
    this.resetSecondSearchForm();
    this.showHashTagQueried(hashTag);
    this.setDocumentTitle(hashTag);
  },

  hideSearchForm: function() {
    $('#search-form-div').addClass('hidden');
  },

  showMap: function() {
    setTimeout(function() {
      $('#map-div').css('z-index', '1');
    }, 550);
  },

  resetFirstSearchForm: function() {
    $('#search-form-div .hash-tag-input').val('');
    $('#search-form-div .hash-tag-input').focus();
  },

  resetSecondSearchForm: function() {
    $('#map-div .hash-tag-input').val('');
    $('#map-div .hash-tag-input').focus();
  },

  showHashTagQueried: function(hashTag) {
    $('#hash-tag-display').addClass('hidden');
    setTimeout(function() {
      $('#hash-tag-display p').text('#' + hashTag);
      $('#hash-tag-display').removeClass('hidden');
    }, 600)
  },

  showModal: function(message) {
    if (message === '') {
      message = 'Something went wrong.'
    }
    $('.modal-content span').text(message);
    $('#alert-modal').modal('show');
  },

  hideModal: function() {
    $('#alert-modal').modal('hide');
  },

  bindModal: function() {
    var self = this;
    $('.modal button').click(function() {
      self.hideModal();
    });
    $('.modal').on('hide.bs.modal', function() {
      if ($('#search-form-div').hasClass('hidden')) {
        self.resetSecondSearchForm();
      } else {
        self.resetFirstSearchForm();
      }
    })
  },

  setDocumentTitle: function(hashTag) {
    document.title = '#' + hashTag;
  },

}
