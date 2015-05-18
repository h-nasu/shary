
appCtrl.controller('HomeCtrl', function($scope, $rootScope, $timeout, $location, apiService) {
  $rootScope.currentUser = null;
  $rootScope.downloadLink = downloadLink;
  $rootScope.currentTotalUsage = null;
  $rootScope.loggedin = false;
  $scope.token = '';
  $scope.predicate = 'createdAt';
  $scope.reverse = true;
  
  // Forever Scroll
  $scope.files = [];
  $scope.pageSize = 10;
  
  var loadFiles = function(){
    apiService.getFiles().then(function(data){
      // set files
      $scope.token = $rootScope.currentUser.admin ? '?token='+token : '';
      $scope.files = data;
    }, function(err){
      alert('Can not get file List!');
      console.log(err);
    });
    
    apiService.getAllTags().then(function(data){
      $scope.allTags = data;
    }, function(err){
      alert('Can not get Tags!');
      console.log(err);
    });
    
  };
  
  apiService.loginCheck().then(function(data){
    $rootScope.currentUser = data;
    $rootScope.currentTotalUsage = data.totalUsage;
    token = data.token;
    loadFiles();
  }, function(err){});
  
 
  $rootScope.login = function(user){
    apiService.login(user).then(function(data){
      $rootScope.currentUser = data;
      token = data.token;
      
      // save token to localstorage
      if(typeof(Storage) !== "undefined") {
        localStorage.token = token;
      }
      
      $timeout(function(){
        $rootScope.$apply(function() {$location.path('upload');});
      });
      
    }, function(err){
      alert('Can not login!');
    });
  };
  
  $rootScope.logout = function(){
    apiService.logout().then(function(data){
      $rootScope.currentUser = null;
      token = null;
      $scope.files = [];
      if(typeof(Storage) !== "undefined") {
        delete localStorage.token;
      }
      $timeout(function(){
        $rootScope.$apply(function() {$location.path('home');});
      });
    }, function(err){
      alert('Can not logout!');
    });
  };
  
  $scope.autoLoadTags = function(query) {
    return apiService.autoTags(query).then(function(data){
      return data;
    }, function(err){
      alert('Can not search tag!');
      console.log(err);
    });
  };
  
  $scope.deleteFile = function(file) {
    var res = confirm('Are sure to remove '+file.filename+'?');
    if (res) {
      apiService.deleteFile(file.id).then(function(data){
        loadFiles();
      }, function(err){
        alert('Can not delete!');
      });
    }
  };
  
  $scope.addTagInput = function(tag) {
    $scope.tags.push({text: tag});
  }
  
  $scope.loadMore = function() {
    $scope.pageSize += $scope.pageSize;
  }
  
});
