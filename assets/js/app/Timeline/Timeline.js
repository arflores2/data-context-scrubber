var Timeline = function(config) {
  var context = this,
      _$div = $("<div>"),
      _$body = $('body');

  /* timeline */
  var _$timeline;

  /* info */
  var _infoIdSuffix = '-info',
      _rangeIdSuffix = '-range',
      _cursorIdSuffix = '-cursor';

  /* controls */
  var _controlsIdSuffix = '-controls',
      _$controls;

  /* zoom */
  var _zoomInIdSuffix = '-zoom-in',
      _zoomOutIdSuffix = '-zoom-out',
      _zoomClass = 'zoom',
      _$zoomTmpl = $("<button>");


  jQuery.extend(this, {
    id: 'timeline',

    /* info */
    rangeText: 'Showing: ',
    cursorText: 'Curosor: ',

    /* units */
    unitType: 'Month',
    unitsInView: 6,
    rows: 3,
    baseUnit: 10,

    /* parser */
    parser: new Parser(),

    /* zoome */
    zoomIncrement: 1,

    /* date masks */
    dateMasks: {
      parse: 'yyyyMMdd',
      metaYearMonth: 'yyyyMM',
      toString: 'MMMM d, yyyy'
    },

    onSelection: function(start, end, months) {
      console.log('timeline', start, end, months);
    },

    /* data */
    data: {},

    /* parsed data */
    stats: null
  }, config);

  jQuery.extend(this, {
    defaults: {
      start: Date.today().addMonths((-1*this.unitsInView)*2),
      end: Date.today()
    },
  })

  function _init() {
    _setElements.call(this);

    this.stats = this.parser.parse(this.data);
    if(!this.stats) {
      this.start = this.defaults.start;
      this.end = this.defaults.end;
    }

    _buildTimeline.call(this, this.data);
  }

  function _setElements() {
    var context = this;

    _$timeline = _$div.clone().attr('id', this.id);
    _$controls = _$div.clone();
    _$info = _$div.clone();

    _$body.prepend(_$timeline);

    _$timeline.on('mouseover', 'table.days-table td', function highlighter() {
      var date = /\d{8}/.exec(this.dataset['date']).toString();
      date = Date.parseExact(date, context.dateMasks.parse);

      if(date) {
        $('#timeline-info-cursor span.info').html(date.toString(context.dateMasks.toString))
      }
    });
  }

  function _buildTimeline(dataset) {
    _buildGrid.call(this);
    _add.call(this, dataset);
    _buildControls.call(this);
    _buildInfo.call(this);
  }

  function _redrawGrid(dataset) {
    _buildGrid.call(this);
    _add.call(this, dataset);
  }

  function _add(dataset) {
    if(typeof dataset === 'object') {
      var count;

      for(var date in dataset) {
        count = dataset[date];
        this.grid.add(date, count);
      }
    }
  }

  function _buildGrid() {

    var _yAxisIncrement;

    if(this.stats.max == null) {
      _yAxisIncrement = null;
    }
    else {
      _yAxisIncrement = Math.ceiling(this.stats.max / this.rows, this.baseUnit);
    }

    this.grid = new Grid({
      parentId: this.id,
      rows: this.rows,
      yAxisIncrement: _yAxisIncrement,
      unitsInView: this.unitsInView,
      start: this.start.clone(),
      end: this.end.clone(),
      dateMasks: this.dateMasks,
      onSelection: this.onSelection,
    })
  }

  function _buildControls() {
    var context = this;

    _$controls.attr('id', this.id + _controlsIdSuffix)
      .append(
        _$zoomTmpl.clone()
          .html('+')
          .attr('id', this.id + _zoomInIdSuffix)
          .attr('data-zoom', 'in')
          .addClass(_zoomClass)
        )
      .append(
        _$zoomTmpl.clone()
          .html('-')
          .attr('id', this.id + _zoomOutIdSuffix)
          .attr('data-zoom', 'out')
          .addClass(_zoomClass)
        )
      .css({
        height: _$timeline.height(),
        right: 0,
        top: 20
      })
      .on('click', 'button.zoom', function() {
        var action = $(this).data('zoom');

        if(action == 'in') {
          _zoomIn.call(context, context.zoomIncrement);
        }
        else if(action = 'out') {
          _zoomOut.call(context, context.zoomIncrement);
        }
      });

    _$timeline.append(_$controls);
  }

  function _buildInfo() {
    _$info
      .attr('id', this.id + _infoIdSuffix)
      .append(
        $('<div>')
          .attr('id', this.id + _infoIdSuffix + _rangeIdSuffix)
          .append(this.rangeText)
          .append("<span class='info'>" + this.start.toString(this.dateMasks.toString) + ' - ' + this.end.toString(this.dateMasks.toString) + "</span>")
      )
      .append(
        $('<div>')
          .attr('id', this.id + _infoIdSuffix + _cursorIdSuffix)
          .append(this.cursorText)
          .append("<span class='info'></span>")
      )
      .width(_$timeline.width());

    _$timeline.append(_$info);
  }

  function _zoomIn(decrement) {
    if(this.unitsInView <= 1) return;

    this.grid.destroy();
    this.unitsInView -= decrement;
    _redrawGrid.call(this, this.data);
  }

  function _zoomOut(increment) {
    if(this.unitsInView >= 12) return;

    this.grid.destroy();
    this.unitsInView += increment;
    _redrawGrid.call(this, this.data);
  }

  _init.call(this, _$timeline);

  return jQuery.extend(this, {
    add: function(dataset) {
      this.data = dataset;
      this.destroy();
      _init.call(this);
    },
    zoomIn: function(decrement) {
      _zoomIn.call(this, decrement);
    },
    zoomOut: function(increment) {
      _zoomOut.call(this, increment);
    },
    zoomTo: function(from, to) {
      var pos = this.grid.positionOf(to);
      console.log(pos);
    },
    destroy: function() {
      _$timeline.remove();
      _$controls.remove();
      _$info.remove();
    }
  })

};
