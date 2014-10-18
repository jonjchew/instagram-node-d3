function MessageHandler() {
  var self = this;
  if (!(this instanceof MessageHandler)) return new MessageHandler();

  self.socket = io();
  self.map = Map()

  self.postsQueue = [];
  self.shownPictures = [];
}

MessageHandler.prototype.start = function() {
  var self = this;

  self.bindSearchForm()
  self.map.render()

  self.socket.on('msg', self.handleIncomingPosts.bind(self))
  setInterval(self.performStep.bind(self), 5000)
}

MessageHandler.prototype.handleIncomingPosts = function(data) {
  var self = this;

  data.posts.forEach(function(post){
    for(var i = 0; i < self.shownPictures.length; i++) {
      if (self.shownPictures[i] === post.id) {
        break;
      }
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
MessageHandler.prototype.bindSearchForm = function() {
  var self = this;

  $('#hashTagForm').submit(function(evt) {
    var data = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "/ig/subscribe",
      data: data,
      params: data,
      success: function(response) {
        self.socket.emit('subscribe', $('#hashTag').val());
        self.shownPictures = [];
      }
    });
    return false;
  });
}
