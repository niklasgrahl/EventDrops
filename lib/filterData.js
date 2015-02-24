"use strict";
/* global module */

module.exports = function filterDate(data, scale) {
  data = data || [];
  var filteredData = [];
  var boundary = scale.range();
  var min = boundary[0];
  var max = boundary[1];
  data.forEach(function (datum) {
    var start = scale(datum.start);
    var end = scale(datum.end);
    if (start <= max && end >= min) {
      filteredData.push(datum);
    }
  });

  return filteredData;
};
