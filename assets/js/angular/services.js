'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('shary.services', []).
  value('version', '0.1')
  .factory('GetUser', function($rootScope){
    
  })
  
  .service("apiService", function($http, $q){
    return({
      login: login,
      loginCheck: loginCheck,
      logout: logout,
      getUsers: getUsers,
      addUser: addUser,
      deleteUser: deleteUser,
      changeUserSetting: changeUserSetting,
      changeUserPassword: changeUserPassword,
      changeAdmin: changeAdmin,
      getFiles: getFiles,
      getMyFiles: getMyFiles,
      deleteFile: deleteFile,
      autoTags: autoTags,
      getAllTags: getAllTags,
      addTag: addTag,
      deleteTag: deleteTag,
      addPassword: addPassword,
      getSetting: getSetting,
      updateSetting: updateSetting
    });
    
    // Login
    function login(data) {
      var request = $http({
        method: 'post',
        credentials: true,
        url: apiUrl+'/user/login',
        data: data
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Check Login
    function loginCheck() {
      // localstorage check
      var checkToken = '';
      if(typeof(Storage) !== "undefined" && localStorage.token) {
        checkToken = localStorage.token;
      }
      var request = $http({
        method: 'get',
        url: apiUrl+'/user/loginCheck/?token='+checkToken,
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Logout
    function logout() {
      var request = $http({
        method: 'get',
        credentials: true,
        url: apiUrl+'/user/logout/?token='+token,
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Get User list
    function getUsers() {
      var request = $http({
        method: 'get',
        url: apiUrl+'/user',
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Register
    function addUser(data) {
      var request = $http({
        method: 'post',
        url: apiUrl+'/user/?token='+token,
        data: data
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Delete User
    function deleteUser(id) {
      var request = $http({
        method: 'get',
        url: apiUrl+'/user/destroy/'+id+'?token='+token
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Change User Settings
    function changeUserSetting(data) {
      var request = $http({
        method: 'put',
        url: apiUrl+'/user/update/'+data.user_id,
        data: data
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Change User Password
    function changeUserPassword(data) {
      var request = $http({
        method: 'post',
        url: apiUrl+'/user/changePassword/',
        data: data
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Change Admin
    function changeAdmin(data) {
      var request = $http({
        method: 'post',
        url: apiUrl+'/user/changeAdmin/',
        data: data
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Get File list
    function getFiles() {
      var request = $http({
        method: 'get',
        url: apiUrl+'/file/?token='+token,
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Get My File list
    function getMyFiles() {
      var request = $http({
        method: 'get',
        url: apiUrl+'/file/myFiles/?token='+token
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Delete File
    function deleteFile(id) {
      var request = $http({
        method: 'get',
        url: apiUrl+'/file/destroy/'+id+'?token='+token
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Get Tags for auto complete
    function autoTags(query) {
      var request = $http({
        method: 'get',
        url: apiUrl+'/file/autoTags/'+query
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Get all Tags
    function getAllTags(user_id) {
      var param = '';
      if (user_id) param = '?user_id='+user_id;
      var request = $http({
        method: 'get',
        url: apiUrl+'/file/allTags/'+param
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Add Tag
    function addTag(data) {
      var request = $http({
        method: 'post',
        url: apiUrl+'/file/addTag/',
        data: data
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Delete Tag
    function deleteTag(data) {
      var request = $http({
        method: 'post',
        url: apiUrl+'/file/deleteTag/',
        data: data
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Add Password
    function addPassword(data) {
      var request = $http({
        method: 'post',
        url: apiUrl+'/file/addPassword/',
        data: data
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Get Setting
    function getSetting() {
      var request = $http({
        method: 'get',
        url: apiUrl+'/setting',
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Update Setting
    function updateSetting(data) {
      var request = $http({
        method: 'post',
        url: apiUrl+'/setting',
        data: data
      });
      return(request.then(handleSuccess, handleError));
    }
    
    // Private Functions
    function handleSuccess(response) {
      return( response.data );
    }
    
    function handleError(response) {
      if (
          ! angular.isObject( response.data ) ||
          ! response.data.summary
          ) {
          return( $q.reject( "An unknown error occurred." ) );
        }
        return( $q.reject( response.data.summary ) );
    }
    
  })
  
  ;

  