'use strict';

(function (window, FB) {
  var FACEBOOK_APP_ID = '614770475384463',
      FACEBOOK_APP_VERSION = 'v2.8';

  function statusChangeCallback(response) {
    console.log(response);
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : FACEBOOK_APP_ID,
      xfbml      : true,
      version    : FACEBOOK_APP_VERSION
    });
    

    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  };


})(window, FB);