function MessageHandler() {
  var self = this;
  if (!(this instanceof MessageHandler)) return new MessageHandler();

  self.socket = io();
  self.map = Map();

  self.postsQueue = [];
  self.shownPictures = [];
}

MessageHandler.prototype.start = function() {
  var self = this;

  self.bindSearchForms();
  self.map.render();

  self.socket.on('msg', self.handleIncomingPosts.bind(self));
  setInterval(self.performStep.bind(self), 5000);
}

MessageHandler.prototype.handleIncomingPosts = function(data) {
  var self = this;

  data.posts.forEach(function(post){
    if (self.shownPictures.indexOf(post.id) === -1) {
      self.postsQueue.push(self.parse(post));
      self.shownPictures.push(post.id);
    }
  })
}

MessageHandler.prototype.parse = function(post) {
  return {
    location: [ post.location.longitude, post.location.latitude ],
    pictureUrl: post.images.standard_resolution.url
  }
}
MessageHandler.prototype.performStep = function() {
  var self = this;
  if (self.postsQueue.length) {
    post = self.postsQueue.shift()

    self.map.removeCircle()
    self.map.step(post.location, function(){
      self.map.drawCircle(post.location)
      self.map.positionImage(post.pictureUrl)
    })
  }
}
MessageHandler.prototype.bindSearchForms = function() {
  var self = this;

  $('.hash-tag-form').submit(function(evt) {
    var data = $(this).serialize();
    var inputtedHashTag = $(this).find('input[name="hash_tag"]').val();
    var regex = new RegExp("^[a-zA-Z0-9_-]+$");
    // Validates for invalid copy and pasted values or blank text field
    if(!regex.test(inputtedHashTag)) {
      return false;
    }
    $.ajax({
      type: "POST",
      url: "/ig/subscribe",
      data: data,
      params: data,
      success: function(response) {
        self.socket.emit('subscribe', inputtedHashTag);
        self.shownPictures = [];
        DocumentEvents.submitHashTag(inputtedHashTag);
      }
    });
    return false;
  });
}
