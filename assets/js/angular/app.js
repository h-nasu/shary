'use strict';

// angular.element($0).scope()
// var apiUrl = 'http://node.icat.co.th:85';
var apiUrl = 'http://'+document.location.host;
var downloadLink = apiUrl+'/file/download/'
var token;

// Declare app level module which depends on filters, and services
angular.module('shary', [
  'ngRoute',
  'shary.filters',
  'shary.services',
  'shary.directives',
  'shary.controllers',
  'ui.bootstrap',
  'angularFileUpload',
  'ngTagsInput',
  'ngAnimate',
  'infinite-scroll'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.when('/home', {templateUrl: 'templates/home.tpl.html', controller: 'HomeCtrl'});
  $routeProvider.when('/upload', {templateUrl: 'templates/upload.tpl.html', controller: 'UploadCtrl'});
  $routeProvider.when('/user', {templateUrl: 'templates/user.tpl.html', controller: 'UserCtrl'});
  $routeProvider.when('/userForm', {templateUrl: 'templates/userForm.tpl.html', controller: 'UserFormCtrl'});
  $routeProvider.when('/setting', {templateUrl: 'templates/setting.tpl.html', controller: 'SettingCtrl'});
  $routeProvider.otherwise({redirectTo: '/home'});
  
}]);
