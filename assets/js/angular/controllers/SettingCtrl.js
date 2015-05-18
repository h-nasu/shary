
appCtrl.controller('SettingCtrl', function($scope, $rootScope, apiService) {
  $scope.setting = {};
  $scope.success = false;
  
  $scope.closeAlert = function(){
    $scope.success = false;
  }
  
  if (!$rootScope.currentUser) {
    window.document.location = '#!/home';
  }
  
  apiService.getSetting().then(function(data){
    $scope.setting = data[0];
  }, function(err){
    console.log(err);
  });
  
  $scope.changeSetting = function(setting) {
    if ($scope.form.settingForm.$valid) {
      setting.token = token;
      apiService.updateSetting(setting).then(function(data){
        $scope.setting = data[0];
        $scope.success = true;
      }, function(err){
        alert('Can not change setting!');
        console.log(err);
      });
    }
  }
});