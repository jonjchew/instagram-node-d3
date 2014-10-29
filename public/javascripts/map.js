function Map(opts) {
  var self = this;
  if (!(this instanceof Map)) return new Map(opts);
  if (!opts) opts = {};

  self.width = opts.width || window.innerWidth;
  self.height = opts.height || window.innerHeight;
  self.zooms = opts.zooms || [500, 1000, 1500];
  self.zoomIndex = -1;
  self.projection = d3.geo.stereographic()
    .clipAngle(160)
    .scale(self.zooms[0] / 3)
    .rotate([-35, -15])
    .translate([self.width / 2, self.height / 2])
    .precision(.1);
  self.path = d3.geo.path().projection(self.projection);
  self.svg = d3.select("#map-div").append("svg")
    .attr("fill", '#34495e')
    .attr("width", self.width)
    .attr("height", self.height);
  self.land = {}
  self.svgLand = {}
}

Map.prototype.render = function() {
  var self = this;
  d3.json('/world-50m', function(error, world) {
    self.land = topojson.feature(world, world.objects.land),
    self.svgLand = self.svg.append("path").datum(self.land).attr("d", self.path);
  });
}
Map.prototype.step = function(position, callback) {
  var self = this;
  if (++self.zoomIndex >= self.zooms.length) self.zoomIndex = 0;

  d3.transition()
    .duration(2000)
    .tween("rotate", function() {
      var point =  position,
          rotate = d3.interpolate(self.projection.rotate(), [-point[0], -point[1]]),
          scale = d3.interpolate(self.projection.scale(), (self.zooms[self.zoomIndex]/0.5));
      return function(t) {
        self.projection
          .rotate(rotate(t))
          .scale(scale(t));
        self.svgLand.attr("d", self.path);
      };
    })
    .each("end", callback)
}

Map.prototype.drawCircle = function(position) {
  var circle = this.projection(position);

  this.svg.append("circle")
    .attr("cx", circle[0])
    .attr("cy", circle[1])

  d3.selectAll('circle')
    .style('opacity', 1)
    .attr('r', '0px')
    .transition()
    .duration(1500)
    .ease('linear')
    .attr('r', '200px')
    .attr('stroke', '#f2f2f2')
    .attr('stroke-width', '3px')
    .attr('fill', 'none')
    .style('opacity', 0);
}

Map.prototype.removeCircle = function() {
  var circle = $('circle')
  $(circle).remove()
}

Map.prototype.positionImage = function(imgUrl, postUrl) {
  var newContainer = "<div><a href='" + postUrl + "' target='_blank'>" + "<img src='" + imgUrl + "'/></a></div>"
    $('#posts-container').fadeOut('slow',function(){
      $(this).html(newContainer).fadeIn('slow')
    });
}
