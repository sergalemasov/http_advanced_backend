(function ($) {
  function ImgChanger() {
    this.intervalId = null;
    this.onError = this.onError.bind(this);
    this.startService = this.startService.bind(this);
    this.stopService = this.stopService.bind(this);
    this.arrowShown = false;
  }

  var _proto = ImgChanger.prototype;

  _proto.startService = function () {
    this.makeAjaxRequest('POST', 'api/img-changer/start', undefined)
      .then(function () {
        this.intervalId = window.setInterval(function () {
          this.getImgUrls();
        }.bind(this), 1000)
      }.bind(this))
      .catch(this.onError);
  };

  _proto.stopService = function () {
    this.makeAjaxRequest('POST', 'api/img-changer/stop', undefined)
      .then(function () {
        window.clearInterval(this.intervalId);
      }.bind(this))
      .catch(this.onError);
  };

  _proto.onError = function () {
    window.clearInterval(this.intervalId);
  };

  _proto.getImgUrls = function () {
    this.makeAjaxRequest('GET', 'api/img-changer/img-url-a', undefined)
      .then(function (data) {
        this.updateImgA(data.imgUrl);
      }.bind(this))
      .catch(this.onError);

    this.makeAjaxRequest('GET', 'api/img-changer/img-url-b', undefined)
      .then(function (data) {
        this.updateImgB(data.imgUrl);
      }.bind(this))
      .catch(this.onError);

    this.makeAjaxRequest('GET', 'api/img-changer/img-url-c', undefined)
      .then(function (data) {
        this.updateImgC(data.imgUrl);
      }.bind(this))
      .catch(this.onError);
  };

  _proto.makeAjaxRequest = function (method, url, data) {
    return $.ajax({ type: method, url: url, data: data });
  };

  _proto.updateImgA = function (imgUrl) {
    this.updateImgSrc('.hab-img-changer__img-' + 'a', imgUrl);
  }

  _proto.updateImgB = function (imgUrl) {
    this.updateImgSrc('.hab-img-changer__img-' + 'b', imgUrl);
  }

  _proto.updateImgC = function (imgUrl) {
    this.updateImgSrc('.hab-img-changer__img-' + 'c', imgUrl);
  }

  _proto.updateImgSrc = function (className, imgUrl) {
    $(className).attr('src', imgUrl + '?' + new Date().getTime());
    if (!this.arrowShown) {
      $('.hab-img-changer__arrow').addClass('hab-img-changer__arrow--visible');
      this.arrowShown = true;
    }
  }



  $(document).ready(function() {
    var imgChanger = new ImgChanger();
    imgChanger.startService();
  });


})(jQuery);