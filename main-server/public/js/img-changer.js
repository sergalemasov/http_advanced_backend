(function ($) {
  function ImgChanger() {
    this.onError = this.onError.bind(this);
    this.startService = this.startService.bind(this);
    this.stopService = this.stopService.bind(this);
    this.toggleBtn = this.toggleBtn.bind(this);
    
    this.intervalId = null;
    this.arrowShown = false;
  }

  var _proto = ImgChanger.prototype;

  _proto.startService = function () {
    this.makeAjaxRequest('POST', 'api/img-changer/start', undefined)
      .then(function () {
        this.intervalId = window.setInterval(function () {
          this.getImgUrls();
          this.getPokeName();
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
    'abcde'.split('').forEach(function (letter) {
      this.makeAjaxRequest('GET', 'api/img-changer/img-url-' + letter, undefined)
        .then(function (data) {
          this.updateImg(data.imgUrl, letter);
        }.bind(this))
        .catch(this.onError);
    }.bind(this));
  };

  _proto.getPokeName = function () {
    this.makeAjaxRequest('GET', 'api/img-changer/poke-name', undefined)
      .then(function (data) {
        this.updatePokeName(data.pokeName);
      }.bind(this))
      .catch(this.onError);
  }

  _proto.makeAjaxRequest = function (method, url, data) {
    return $.ajax({ type: method, url: url, data: data });
  };

  _proto.updateImg = function (imgUrl, letter) {
    this.updateImgSrc('.hab-img-changer__img-' + letter, imgUrl);
  }

  _proto.updatePokeName = function (pokeName) {
    $('.hab-img-changer__poke-name').html(pokeName);
  };

  _proto.updateImgSrc = function (className, imgUrl) {
    $(className).attr('src', imgUrl + '?' + new Date().getTime());
    if (!this.arrowShown) {
      $('.hab-img-changer__arrow').addClass('hab-img-changer__arrow--visible');
      this.arrowShown = true;
    }
  }

  _proto.toggleBtn = function (event) {
    var btn = $(event.target);
    var imgChanger = $('.hab-img-changer');
    var btnStartText = 'START';
    var btnStopText = 'STOP';
    var btnStartClass = 'hab-img-changer__btn--start';
    var btnStopClass = 'hab-img-changer__btn--stop';

    if (btn.html() === btnStartText) {
      btn.html(btnStopText);
      btn.removeClass(btnStartClass);
      btn.addClass(btnStopClass);

      this.startService();
      imgChanger.show();
    } else {
      btn.html(btnStartText);
      btn.addClass(btnStartClass);
      btn.removeClass(btnStopClass);

      this.stopService();
      imgChanger.hide();
    }
  }

  $(document).ready(function() {
    var imgChanger = new ImgChanger();

    var startBtn = $('.hab-img-changer__btn');
    startBtn.on('click', imgChanger.toggleBtn);
  });

})(jQuery);