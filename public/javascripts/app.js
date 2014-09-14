var socket = io();
socket.on('firstShow', function(data) {
  data.firstShow.forEach(function(picture){
    console.log("First show: " + picture.tags);
    var pictureUrl = picture.images.standard_resolution.url
    $('#pictures').append($('<li>').html("<img src='" + pictureUrl + "'/>"));
  })
});

socket.on('show', function(data) {
  data.show.forEach(function(picture){
    console.log("Real time: " + picture.tags)
    var picture_url = picture.images.standard_resolution.url
    $('#pictures').prepend($('<li>').html("<img src='" + picture_url + "'/>"));
  })
});


$(document).ready(function() {
 
  $('#hashTagForm').submit(function(evt) {
    var data = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "/ig/subscribe",
      data: data,
      params: data,
      success: function(response) {
        socket.emit('subscribe', $('#hashTag').val());
      }
    });
    return false;
  });

});
