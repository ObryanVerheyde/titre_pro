'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Timer = function() {
  function Timer(el) {
    _classCallCheck(this, Timer);

    this.el = el;
    this.timer = '00:00';
  }

  Timer.prototype.start = function start() {
    var _this = this;

    this.startTime = new Date();
    this.interval = setInterval(function() {
      _this.update();
    }, 100);
  };

  Timer.prototype.pause = function pause() {
    clearInterval(this.interval);
  };

  Timer.prototype.update = function update() {
    this.now = new Date();
    var then = this.now.getTime() - this.startTime.getTime();

    var seconds = Math.floor(then / 1000) % 60;
    seconds = (seconds < 10
      ? '0'
      : '') + seconds;

    var minutes = Math.floor(then / 1000 / 60);
    minutes = (minutes < 10
      ? '0'
      : '') + minutes;

    this.el.innerHTML = this.timer = minutes + ':' + seconds;
  };

  Timer.prototype.reset = function reset() {
    clearInterval(this.interval);
    this.start();
  };

  return Timer;
}();

var Card = function() {
  function Card(el) {
    _classCallCheck(this, Card);

    this.el = el;
    this.index = el.dataset.index;
    this.active = false;
    this.matched = false;
  }

  Card.prototype.toggle = function toggle() {
    if (!this.matched) {
      this.active = !this.active;
      this.el.dataset.active = this.active.toString();
    }
  };

  return Card;
}();

var Game = function() {
  function Game(container) {
    _classCallCheck(this, Game);

    console.clear();

    this.container = container;

    this.domCards = this.container.querySelectorAll('.card');
    this.cards = [];

    for (var _iterator = Array.from(this.domCards), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray
      ? _iterator
      : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length)
          break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done)
          break;
        _ref = _i.value;
      }

      var card = _ref;

      var item = new Card(card);
      this.cards.push(item);
    }

    // Timer
    var timerContainer = document.getElementById('timer');
    this.timer = new Timer(timerContainer);

    // Actions
    this.actions = 0;
    this.actionsContainer = document.getElementById('actions');

    this.resultsContainer = document.getElementById('results');
    this.resultsActions = document.getElementById('resultsActions');
    this.resultsTimer = document.getElementById('resultsTimer');

    this.pause = false;

    this.bind();
    this.reset();
  }

  Game.prototype.bind = function bind() {
    var _this2 = this;

    var _loop = function _loop() {
      if (_isArray2) {
        if (_i2 >= _iterator2.length)
          return 'break';
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done)
          return 'break';
        _ref2 = _i2.value;
      }

      var card = _ref2;

      card.el.addEventListener('click', function() {
        _this2.matchCards(card);
      }, false);
    };

    for (var _iterator2 = this.cards, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2
      ? _iterator2
      : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      var _ret = _loop();

      if (_ret === 'break')
        break;
      }

    var resetButtons = document.querySelectorAll('.resetButton');
    for (var _iterator3 = Array.from(resetButtons), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3
      ? _iterator3
      : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length)
          break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done)
          break;
        _ref3 = _i3.value;
      }

      var button = _ref3;

      button.addEventListener('click', this.reset.bind(this), false);
    }
  };

  Game.prototype.matchCards = function matchCards(clickedCard) {
    var _this3 = this;

    if (!this.pause) {
      // Check if there is already an active card
      var activeAndNotMatchedCards = 0;
      for (var _iterator4 = this.cards, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4
        ? _iterator4
        : _iterator4[Symbol.iterator]();;) {
        var _ref4;

        if (_isArray4) {
          if (_i4 >= _iterator4.length)
            break;
          _ref4 = _iterator4[_i4++];
        } else {
          _i4 = _iterator4.next();
          if (_i4.done)
            break;
          _ref4 = _i4.value;
        }

        var _card = _ref4;

        if (_card.active == true && _card.matched == false && _card != clickedCard) {
          activeAndNotMatchedCards++;
          break;
        }
      }

      // If there is an active card
      // Check if the active card and the clicked card are matching
      if (activeAndNotMatchedCards != 0) {
        var _loop2 = function _loop2() {
          if (_isArray5) {
            if (_i5 >= _iterator5.length)
              return 'break';
            _ref5 = _iterator5[_i5++];
          } else {
            _i5 = _iterator5.next();
            if (_i5.done)
              return 'break';
            _ref5 = _i5.value;
          }

          var card = _ref5;

          // If an active card matchs the clicked card
          // Set both to matched and active
          if (card.index == clickedCard.index && card.active == true && card != clickedCard) {
            clickedCard.toggle();
            clickedCard.matched = true;
            card.matched = true;

            // Reset all active and not matched cards
          } else {
            _this3.pause = true;
            setTimeout(function() {
              if (card.active == true && card != clickedCard) {
                card.toggle();
                clickedCard.toggle();
              }
              _this3.pause = false;
            }, 500);
          }
        };

        for (var _iterator5 = this.cards, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5
          ? _iterator5
          : _iterator5[Symbol.iterator]();;) {
          var _ref5;

          var _ret2 = _loop2();

          if (_ret2 === 'break')
            break;
          }

        // Add one action
        this.actions++;
        this.actionsContainer.innerHTML = this.actions + ' moves';
        clickedCard.toggle();

        // If there is no active card
        // And the clicked card is not already matched
        // Toggle the clicked card
      } else {
        if (clickedCard.matched == false) {
          clickedCard.toggle();
        }
      }
    }

    this.checkEnd();
  };

  Game.prototype.checkEnd = function checkEnd() {
    var over = true;
    for (var _iterator6 = this.cards, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6
      ? _iterator6
      : _iterator6[Symbol.iterator]();;) {
      var _ref6;

      if (_isArray6) {
        if (_i6 >= _iterator6.length)
          break;
        _ref6 = _iterator6[_i6++];
      } else {
        _i6 = _iterator6.next();
        if (_i6.done)
          break;
        _ref6 = _i6.value;
      }

      var _card2 = _ref6;

      if (!_card2.matched) {
        over = false;
      }
    }

    if (over) {
      this.resultsContainer.classList.add('show');
      this.timer.pause();
      this.resultsActions.innerHTML = this.actions;
      this.resultsTimer.innerHTML = this.timer.timer;
    }
  };

  Game.prototype.reset = function reset() {
    var _this4 = this;

    for (var _iterator7 = this.cards, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7
      ? _iterator7
      : _iterator7[Symbol.iterator]();;) {
      var _ref7;

      if (_isArray7) {
        if (_i7 >= _iterator7.length)
          break;
        _ref7 = _iterator7[_i7++];
      } else {
        _i7 = _iterator7.next();
        if (_i7.done)
          break;
        _ref7 = _i7.value;
      }

      var _card4 = _ref7;

      _card4.matched = false;
      if (_card4.active) {
        _card4.toggle();
      }
    }

    setTimeout(function() {
      for (var _iterator8 = _this4.cards, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8
        ? _iterator8
        : _iterator8[Symbol.iterator]();;) {
        var _ref8;

        if (_isArray8) {
          if (_i8 >= _iterator8.length)
            break;
          _ref8 = _iterator8[_i8++];
        } else {
          _i8 = _iterator8.next();
          if (_i8.done)
            break;
          _ref8 = _i8.value;
        }

        var _card3 = _ref8;

        _card3.el.style.order = Math.floor(Math.random() * 1000);
      }

      // Reset the timer
      _this4.timer.reset();

      // Reset the action counter
      _this4.actions = 0;
      _this4.actionsContainer.innerHTML = _this4.actions + ' move';

      _this4.resultsContainer.classList.remove('show');
    }, 200);
  };

  return Game;
}();

var container = document.getElementById('game');
var experience = new Game(container);
