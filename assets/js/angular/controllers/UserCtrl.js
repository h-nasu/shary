
appCtrl.controller('UserRegisterCtrl', function($scope, $rootScope, apiService, $modalInstance) {
  $scope.close = function() {
    $modalInstance.dismiss('close');
  };
  
  $scope.user = {};
  $scope.form = {};
  
  $scope.register = function(user) {
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    } else {
      delete user.confirmPassword
    }
    if (user.info) {
      return;
    }
    if ($scope.form.registerForm.$valid) {
      apiService.addUser(user).then(function(data){
        //data.password = user.password;
        //$rootScope.login(data);
        $rootScope.$emit('refreshUsers', true);
        $scope.close();
      }, function(err){
        alert('Probably username already used.');
        console.log(err);
      });
    }
  }
});

appCtrl.controller('UserCtrl', function($scope, $rootScope, $modal, apiService) {
  // Pager Setting
  $scope.pagerMaxSize = 10;
  $scope.pageSize = 20;
  $scope.userCurrentPage = 1;
  $scope.users = [];
  $scope.usertotalItems = 0;
  $scope.success = false;
  
  $scope.closeAlert = function(){
    $scope.success = false;
  }
  
  var loadUsers = function(){
    apiService.getUsers().then(function(data){
      // set users
      $scope.users = data;
      $scope.userTotalItems = data.length;
      $scope.noOfPages = Math.ceil($scope.users.length/$scope.pageSize);
    }, function(err){
      alert('Can not get file List!');
      console.log(err);
    });
  }
  
  if (!$rootScope.currentUser) {
    window.document.location = '#!/home';
  } else {
    loadUsers();
  }
  
  $scope.deleteUser = function(user){
    var res = confirm('Are sure to remove '+user.username+'?');
    if (res) {
      apiService.deleteUser(user.id).then(function(data){
        loadUsers();
      }, function(err){
        alert('Can not delete!');
      });
    }
  };
  
  $scope.userRegister = function () {
    var UploadInstance = $modal.open({
      templateUrl: 'templates/userRegister.tpl.html',
      controller: 'UserRegisterCtrl'
    })
  };
  
  $rootScope.$on('refreshUsers', function(event, success){
    loadUsers();
    $scope.success = success;
  });
    
  // for filter pagers
  $scope.usersFiltered = [];
  $scope.$watchCollection('usersFiltered', function(newUsers) {
    $scope.noOfPages = Math.ceil(newUsers.length/$scope.pageSize);
    $scope.userTotalItems = newUsers.length;
    $scope.userCurrentPage = 1;
  });
  
});


appCtrl.controller('UserFormCtrl', function($scope, $rootScope, apiService) {
  $scope.spaceLimit;
  $scope.userId;
  $scope.setrlt = false;
  $scope.pwrlt = false;
  
  $scope.changeUserSetting = function(spaceLimit) {
    if (spaceLimit !== parseFloat(spaceLimit) || spaceLimit <= 0 ) return alert('Space Limit can not be character and smaller than 0!');
    var setObj = {
      token: token,
      user_id: $scope.userId,
      spaceLimit: spaceLimit
    };
    apiService.changeUserSetting(setObj).then(function(data){
      $scope.setrlt = data ? 'Set!' : 'Not Set!';
      $rootScope.$emit('refreshUsers', false);
    }, function(err){
      alert('Can not change Setting!');
      console.log(err);
    });
  };
  
  $scope.changeUserPassword = function(password) {
    var pwObj = {
      token: token,
      user_id: $scope.userId,
      password: password
    };
    apiService.changeUserPassword(pwObj).then(function(data){
      $scope.pwrlt = data ? 'New Password is set!' : 'Password is not set!';
      $scope.password = '';
    }, function(err){
      alert('Can not change Password!');
      console.log(err);
    });
  };
  
  $scope.adminChange = function() {
    var adminObj = {
      token: token,
      user_id: $scope.userId,
      admin: $scope.admin
    };
    apiService.changeAdmin(adminObj).then(function(data){
      // success
    }, function(err){
      alert('Can not change Admin!');
      console.log(err);
    });
  };
  
  // close form
  $scope.close = function() {
    $scope.$parent.$parent.edit = false;
  };
});
