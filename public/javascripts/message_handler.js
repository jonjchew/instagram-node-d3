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
  self.isUpdating = false;

  self.socket.on('msg', self.handleIncomingPosts.bind(self));
  setInterval(self.performStep.bind(self), 5500);
}

MessageHandler.prototype.handleIncomingPosts = function(data) {
  var self = this;
  self.isUpdating = true;

  data.posts.forEach(function(post){
    if (self.shownPictures.indexOf(post.id) === -1) {
      self.postsQueue.push(self.parse(post));
      self.shownPictures.push(post.id);
    }
  })
}

MessageHandler.prototype.parse = function(post) {
  var postObject = {
    location: [ post.location.longitude, post.location.latitude ],
    pictureUrl: post.images.low_resolution.url,
    postUrl: post.link,
    caption: ''
  }
  if (post.caption != null) {
    postObject.caption = post.caption.text
  }
  return postObject;
}
MessageHandler.prototype.performStep = function() {
  var self = this;
  if (self.postsQueue.length) {
    self.noPictureStepCount = 0;
    post = self.postsQueue.shift()

    self.map.removeCircle()
    self.map.step(post.location, function(){
      self.map.positionImage(post.pictureUrl, post.postUrl);
      self.map.drawCircle(post.location);
      self.map.replaceCaption(post.caption);
    })
  }
  else {
    if (self.isUpdating) {
      self.noPictureStepCount++;
      if (self.noPictureStepCount == 2) {
        self.isUpdating = false;
        DocumentEvents.showModal('Not enough people are posting with your hashtag. Maybe try something more popular like #nofilter or #tbt?')
      }
    }
  }
}
MessageHandler.prototype.bindSearchForms = function() {
  var self = this;

  $('.hash-tag-form').submit(function(evt) {
    var data = $(this).serialize();
    var inputtedHashTag = $(this).find('input[name="hash_tag"]').val();
    var regex = new RegExp("^[a-zA-Z0-9_-]+$");
    if(!regex.test(inputtedHashTag)) {
      return false;
    }
    $.ajax({
      type: "POST",
      url: "/ig/subscribe",
      data: data,
      params: data,
      success: function(recentPictures) {
        self.postsQueue = [];
        self.shownPictures = [];
        self.handleIncomingPosts({ posts: recentPictures });
        self.socket.emit('subscribe', inputtedHashTag);
        DocumentEvents.submitHashTag(inputtedHashTag);
      },
      error: function (request, status, error) {
        DocumentEvents.showModal(request.responseText);
      }
    });
    return false;
  });
}
