'use strict';

/* Filters */

angular.module('shary.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  
  .filter('startFrom', function() {
    return function(input, start) {
      if(input) {
        start = +start; //parse to int
        return input.slice(start);
      }
      return [];
    }
  })
  
  .filter('tagFilter', function() {
    return function(input, tags) {
      if (typeof tags !== 'undefined' && tags.length) {
        return input.filter(function(obj){
          for (var i in tags) {
            if (typeof obj.tags[0] !== 'undefined' && typeof obj.tags[0].text !== 'undefined') {
              for (var x in obj.tags) {
                if (obj.tags[x].text == tags[i].text) {
                  return obj;
                }
              }
            } else {
              if (obj.tags.indexOf(tags[i].text) != -1) {
                return obj
              }
            }
          }
        });
      } else {
        return input;
      }
    }
  })
  
  ;
