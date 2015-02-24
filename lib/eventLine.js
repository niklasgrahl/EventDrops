"use strict";
/* global require, module, d3 */

var configurable = require('./util/configurable');
var filterData = require('./filterData');

var defaultConfig = {
  xScale: null
};

module.exports = function (config) {

  config = config || {
    xScale: null,
    eventColor: null
  };
  for (var key in defaultConfig) {
    config[key] = config[key] || defaultConfig[key];
  }

  var eventLine = function eventLine(selection) {
    selection.each(function (data) {
      d3.select(this).selectAll('text').remove();

      d3.select(this).append('text')
        .text(function(d) {
          var count = filterData(d.events, config.xScale).length;
          return d.name + (count > 0 ? ' (' + count + ')' : '');
        })
        .attr('text-anchor', 'end')
        .attr('transform', 'translate(-20)')
        .style('fill', 'black')
      ;
      d3.select(this).append('clipPath')
        .attr("id", "clip1")
        .append('rect')
        .attr('x',0)
        .attr('y',-15)
        .attr('width', config.xScale.range()[1])
        .attr('height',100)
      ;

      d3.select(this).selectAll('.event').remove();

      var rect = d3.select(this).selectAll('.event')
        .data(function(d) {
          // filter value outside of range
          return filterData(d.events, config.xScale);
        });

      var radius = 10;

      rect.enter()
        .append('rect')
        .attr('class', 'event')
        .attr('x', function(d) {
          return config.xScale(d.start) - radius;
        })
        .style('fill', config.eventColor)
        .attr('y', -15)
        .attr('rx', radius)
        .attr('ry', radius)
        .attr("clip-path", "url(#clip1)")
        .attr('width', function(d){
          var width = 2 * radius;
          if(d.end){
            width += config.xScale(d.end) - config.xScale(d.start);
          }
          return width;
        })
        .attr('height', 20)
      ;

      rect.exit().remove();

    });
  };

  configurable(eventLine, config);

  return eventLine;
};
