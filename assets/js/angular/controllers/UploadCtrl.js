
appCtrl.controller('UploadCtrl', function($scope, $rootScope, $modal, apiService) {
  // Pager Setting
  $scope.pagerMaxSize = 10;
  $scope.pageSize = 20;
  $scope.fileCurrentPage = 1;
  $scope.files = [];
  $scope.fileTotalItems = 0;
  $scope.predicate = 'createdAt';
  $scope.reverse = true;
  
  
  var loadMyFiles = function(){
    apiService.getMyFiles().then(function(data){
      $scope.files = data;
      $scope.fileTotalItems = data.length;
      $scope.noOfPages = Math.ceil($scope.files.length/$scope.pageSize);
      apiService.loginCheck().then(function(user){
        $rootScope.currentTotalUsage = user.totalUsage;
        $rootScope.limitUsage = user.spaceLimit;
      }, function(err){});
    }, function(err){
      alert('Can not get file List!');
      console.log(err);
    });
  };
  
  if (!$rootScope.currentUser) {
    window.document.location = '#!/home';
  } else {
    loadMyFiles();
  }
  
  $scope.deleteFile = function(file){
    var res = confirm('Are sure to remove '+file.filename+'?');
    if (res) {
      apiService.deleteFile(file.id).then(function(data){
        loadMyFiles();
      }, function(err){
        alert('Can not delete!');
      });
    }
  };
  
  $scope.openUploadFile = function () {
    var UploadInstance = $modal.open({
      templateUrl: 'templates/uploadFile.tpl.html',
      controller: 'UploadFileCtrl'
    })
  };
  
  $rootScope.$on('refreshMyFiles', function(){
    loadMyFiles();
  });
  
  // for filter pagers
  $scope.filesFiltered = [];
  $scope.$watchCollection('filesFiltered', function(newFiles) {
    $scope.noOfPages = Math.ceil(newFiles.length/$scope.pageSize);
    $scope.fileTotalItems = newFiles.length;
    $scope.fileCurrentPage = 1;
  });
  
  $scope.autoLoadTags = function(query) {
    return apiService.autoTags(query).then(function(data){
      return data;
    }, function(err){
      alert('Can not search tag!');
      console.log(err);
    });
  };
  
  apiService.getAllTags($rootScope.currentUser.id).then(function(data){
    $scope.allTags = data;
  }, function(err){
    alert('Can not get Tags!');
    console.log(err);
  });
  
  $scope.addTagInput = function(tag) {
    $scope.tags.push({text: tag});
  }
  
});


appCtrl.controller('UploadFileCtrl', function($scope, $rootScope, $modalInstance, $upload) {
  $scope.close = function() {
    $modalInstance.dismiss('close');
  };
  
  $scope.success = false;
  $scope.start = false;
  
  $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    $scope.start = true;
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: apiUrl+'/file/upload',
        method: 'POST',
        //headers: {'header-key': 'header-value'},
        //withCredentials: true,
        data: {myObj: $scope.myModelObj, token: token},
        file: file, // or list of files ($files) for html5 only
        //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
        // customize file formData name ('Content-Disposition'), server side file variable name. 
        fileFormDataName: 'up_file', //or a list of names for multiple files (html5). Default is 'file' 
        // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
        //formDataAppender: function(formData, key, val){}
      }).progress(function(evt) {
        $scope.percent = parseInt(100.0 * evt.loaded / evt.total);
        //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        // console.log(data);
        $scope.success = true;
        $rootScope.$emit('refreshMyFiles');
      }).error(function(err){
        alert(err);
      });
      //.error(...)
      //.then(success, error, progress); 
      // access or attach event listeners to the underlying XMLHttpRequest.
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})
    }
  };
  
});


appCtrl.controller('UploadFormCtrl', function($scope, $rootScope, apiService) {
  $scope.fileId;
  $scope.tags;
  $scope.password;
  $scope.pwrlt = false;
  
  $scope.autoLoadTags = function(query) {
    return apiService.autoTags(query).then(function(data){
      return data;
    }, function(err){
      alert('Can not search tag!');
      console.log(err);
    });
  };
  
  $scope.tagAdded = function(tag) {
    var tagObj = {
      token: token,
      id: $scope.fileId,
      tag: tag.text
    };
    apiService.addTag(tagObj).then(function(data){
      //$scope.files = data;
    }, function(err){
      alert('Can not add tag!');
      console.log(err);
    });
  };
  
  $scope.tagRemoved = function(tag) {
    var tagObj = {
      token: token,
      id: $scope.fileId,
      tag: tag.text
    };
    apiService.deleteTag(tagObj).then(function(data){
      //$scope.files = data;
    }, function(err){
      alert('Can not delete tag!');
      console.log(err);
    });
  };
  
  $scope.addPassword = function(password) {
    var pwObj = {
      token: token,
      id: $scope.fileId,
      password: password
    };
    apiService.addPassword(pwObj).then(function(data){
      $scope.pwrlt = password ? 'Password is set!' : 'Unset the Password!'
    }, function(err){
      alert('Can not add Password!');
      console.log(err);
    });
  };
  
  // close form
  $scope.close = function() {
    $scope.$parent.$parent.edit = false;
  };
});
