var Scrubber = function(config) {
  var context = this,
      _$document = $(document),
      _$body = $('body'),
      _$button = $('<button>');

  /* scrubber */
  var _scrubberIdSuffix = '-scrubber',
      _$scrubber = $('<div>'),
      _defaultWidth = 1;

  /* scurbber close control */
  var _scrubberCloseIdSuffix = '-close',
      _$scrubberClose;

  /* event namespace */
  var _ns = 'scrubber';

  /* reference element */
  var _$reference,
      _top,
      _height;

  jQuery.extend(this, {
    timelineId: 'timeline',
    referenceElId: 'timeline-viewport',

    start: null,
    end: null,

    dateMasks: {
      parse: 'yyyyMMdd'
    },

    callback: null,
    scroll: null
  }, config);

  function _init() {
    _setElements.call(this);

    _addMouseDownHandler.call(this);
  }

  function _setElements() {
    _$reference = $('#' + this.referenceElId);
    _top = _$reference.offset().top;
    _height = _$reference.height();
  }

  function _addMouseDownHandler() {
    var context = this,
        left,
        $startEl;

    _$reference.on('mousedown.' + _ns, function(event) {
      event.preventDefault();
      left = event.pageX;

      _addMouseMoveHandler.call(context, left);
      _addMouseUpHanlder.call(context);

      context.destroy();
      context.create();

      context.start = _extractDateFromEl.call(context, document.elementFromPoint(event.pageX, event.pageY));

      context.show({top: _top, left: event.pageX}, _height);
    })
  }

  function _removeMouseDownHandler() {
    _$reference.on('mousedown.' + _ns);
  }

  function _addMouseMoveHandler(initialLeft) {
    var context = this,
        _left = initialLeft;

    _$body.on('mousemove.' + _ns, function(event) {
      event.preventDefault();
      _$scrubber.width(event.pageX - _left);
    })
  }

  function _addMouseUpHanlder() {
    var context = this;

    _$body.on('mouseup.' + _ns, function(event) {
      _$body.off('mousemove.' + _ns);
      _$body.off('mouseup.' + _ns);

      if(_$scrubber.width() < 20) {
        context.destroy();
        return;
      }

      context.end = _extractDateFromEl.call(context, document.elementFromPoint(event.pageX, event.pageY));

      _startScrubberState.call();

      context.callback(context.start.clone(), context.end.clone(), Date.spanDifference(context.start.clone(), context.end.clone()));
    });
  }

  function _startScrubberState() {
    _$scrubber.append(_$scrubberClose);

    _addScrubberMouseDownHandler.call(this);

  }

  function _endScrubberState() {
    _removeScrubberMouseDownHandler();
  }

  function _addScrubberMouseDownHandler() {
    var context = this;
    _$scrubber.on('mousedown.' + _ns, function() {
      event.preventDefault();
      _addScrubberMouseMoveHandler.call(context);
      _addScrubberMouseUpHandler.call(context);
    })
  }

  function _removeScrubberMouseDownHandler() {
    _$scrubber.off('mousedown.' + _ns);
  }

  function _addScrubberMouseMoveHandler() {

    _$scrubber.on('mousemove.' + _ns, function(event) {
      event.preventDefault();
      event.stopPropagation();

      if(!_addScrubberMouseMoveHandler.initialMousePosition) _addScrubberMouseMoveHandler.initialMousePosition = {x: event.pageX, y: event.pageY};
      if(!_addScrubberMouseMoveHandler.initialLeft) _addScrubberMouseMoveHandler.initialLeft = parseInt(_$scrubber.css('left'));

      var newLeft = _addScrubberMouseMoveHandler.initialLeft - (_addScrubberMouseMoveHandler.initialMousePosition.x - event.pageX);

      if(newLeft < _$reference.offset().left + 50) {
        context.scroll(-50);
        //newLeft = _$reference.offset().left + 50;
      }

      var ref = _$reference.offset().left + _$reference.width() - parseInt(_$reference.css('padding'));
      var scr = newLeft + _$scrubber.width();
      if( scr > ref - 50) {
        context.scroll(50);
        //newLeft = ref - _$scrubber.width();
      }

      _$scrubber.css({
        left: newLeft
      });
    });
  }

  function _removeScrubbberMouseMOveHandler() {
   _addScrubberMouseMoveHandler.initialMousePosition = null;
   _addScrubberMouseMoveHandler.initialLeft = null;
    _$scrubber.off('mousemove.' + _ns);
  }

  function _addScrubberMouseUpHandler() {
    _$scrubber.on('mouseup.' + _ns, function() {
      _removeScrubbberMouseMOveHandler();
      _removeScrubberMouseUpHandler();
    })
  }

  function _removeScrubberMouseUpHandler() {
    _$scrubber.off('mouseup.' + _ns);
  }

  function _addScrubberCloseHandler() {
    var context = this;
    _$scrubberClose.on('click.' + _ns, function() {
      context.destroy();
    });

    _$document.on('keyup.' + _ns, function(event) {
      if(event.keyCode == 27) context.destroy();
    })
  }

  function _removeScrubberCloseHandler() {
    _endScrubberState();
    _$scrubberClose.off('click.' + _ns);
    _$document.off('keyup.' + _ns);
  }

  function _extractDateFromEl(el) {
    var $el = $(el),
        dateStr,
        date,
        metadata;

    metadata = $el.data('date') || $el.attr('class');

    dateStr = /\d{8}/.exec(metadata).toString();
    date = Date.parseExact(dateStr, this.dateMasks.parse);

    if(!date) throw 'Date could not be extracted from ' + dateStr;

    return date.clone();
  }

  _init.call(this);

  return jQuery.extend(this, {

    create: function() {
      _$scrubberClose = _$button.clone().html('x').attr('id', this.id  + _scrubberCloseIdSuffix);

      _$scrubber
        .attr('id', this.timelineId + _scrubberIdSuffix)
        .width(_defaultWidth)
        .appendTo(_$body);

      //just in case
      this.start = null;
      this.end = null;

      _addScrubberCloseHandler.call(this);
    },

    destroy: function() {
      this.start = null;
      this.end = null;

      /* scrubber */
      if(_$scrubber) {
        _$scrubber.remove();
      }

      /* scrubber close */
      if(_$scrubberClose) {
        _removeScrubberCloseHandler.call(this);
        _$scrubberClose.remove();
      }
    },

    show: function(pos, height) {

      _$scrubber.show().css({
        top: pos.top,
        left: pos.left,
        height: _$reference.height()
      })
    }
  });
}