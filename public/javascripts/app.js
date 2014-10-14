var socket = io();

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


  var width = window.innerWidth,
    height = window.innerHeight;

  var zooms = [500, 1000, 1500],
      i = -1;

  var projection = d3.geo.stereographic()
      .clipAngle(160)
      .scale(zooms[0] / 3)
      .rotate([-35, -15])
      .translate([width / 2, height / 2])
      .precision(.1);

  var path = d3.geo.path()
      .projection(projection);

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  var land, svgLand;
  d3.json('/world-50m', function(error, world) {
    land = topojson.feature(world, world.objects.land),
    svgLand = svg.append("path")
      .datum(land)
      .attr("d", path);
  });
 
  socket.on('msg', handleIncomingPosts)

  var postsQueue = [];
  function handleIncomingPosts(data) {
    console.log("incoming")
    data.posts.forEach(function(post){
      postsQueue.push(parse(post));
    })
    return postsQueue
  }

  function parse(post) {
    return {
      location: [ post.location.longitude, post.location.latitude ],
      pictureUrl: post.images.standard_resolution.url
    }
  }

  setInterval(doStep, 5000)

  function doStep() {
    console.log(postsQueue)
    if (postsQueue.length) {
      post = postsQueue.shift()

      removeCircle()
      step(post.location, function(){
        drawCircle(post.location)
        positionImage(post.pictureUrl)
      })
    }
  }
  function step(position, callback) {
    if (++i >= zooms.length) i = 0;

    d3.transition()
      .duration(2000)
      .tween("rotate", function() {
        var point =  position,
            rotate = d3.interpolate(projection.rotate(), [-point[0], -point[1]]),
            scale = d3.interpolate(projection.scale(), (zooms[i]/0.5));
        return function(t) {
          projection
            .rotate(rotate(t))
            .scale(scale(t));
          svgLand.attr("d", path);
        };
      })
      .each("end", callback)
  }

  function drawCircle(position) {
    var circle = projection(position);

    svg.append("circle")
      .attr("cx", circle[0])
      .attr("cy", circle[1])

    d3.selectAll('circle')
      .style('opacity', 1)
      .attr('r', '0px')
      .transition()
      .duration(2000)
      .ease('linear')
      .attr('r', '300px')
      .attr("fill", "yellow")
      .style('opacity', 0);
  }

  function removeCircle() {
    var circle = $('circle')
    $(circle).remove()
  }

  function positionImage(url) {
    $('#posts-container').html($('<li>').html("<img src='" + url + "'/>"));
  }

});
