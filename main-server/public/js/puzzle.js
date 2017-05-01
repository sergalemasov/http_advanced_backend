(function ($) {
  var Puzzle = function () {
    this.server = null;

    this.getImgUrls = this.getImgUrls.bind(this);
  }

  var _proto = Puzzle.prototype;

  _proto.populateServer = function () {
    this.server = $('.hab-puzzle__btn-ip').html();
    console.log(this.server);
  }

  _proto.getImgUrls = function () {
    if (!this.server) {
      console.log('please populate server first');
      return;
    }
    '123456789'.split('').forEach(function (num) {
      var method = 'GET';
      var headers;

      switch(num) {
        case '5':
          method = 'PUT';
          break;
        case '9':
          headers = {
            'some': 'header'
          }
          break;
      }

      this.makeAjaxRequest(
        method,
        'http://' + this.server + '/api/puzzle/' + num + '?origin=' + encodeURIComponent(window.location.origin),
        undefined,
        headers
      ).then(function (data, textStatus, request) {
        var url = request.getResponseHeader('src');
        if (!url) {
          throw new Error('header parse failed');
        }
        this.updateImg(url, num);
      }.bind(this))
      .catch(function (err) {
        this.onError(err, num);
      }.bind(this));
    }.bind(this));
  };

  _proto.updateImg = function (url, num) {
    $('.hab-puzzle__piece' + num).attr('src', url);
  }

  _proto.onError = function (err, num) {
    if (num) {
      $('.hab-puzzle__piece' + num).attr('src', 'img/monkey/tile.jpg');
    } else {
      throw(err);
    }
  }

  _proto.makeAjaxRequest = function (method, url, data, headers) {
    return $.ajax({ type: method, url: url, data: data, headers: headers });
  };

  $(document).ready(function() {
    var puzzle = new Puzzle();
    puzzle.populateServer();

    var startBtn = $('.hab-puzzle__btn');
    startBtn.on('click', puzzle.getImgUrls);
  });

}(jQuery))