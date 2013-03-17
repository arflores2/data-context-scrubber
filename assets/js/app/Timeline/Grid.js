var Grid = function(config) {

  var context = this,
      _$table = $("<table>"),
      _$div = $("<div>"),
      _$timeline;

  /* viewport */
  var _viewportIdSuffix = '-viewport',
      _$viewport;

  /* content */
  var _contentIdSuffux = '-content',
      _totalWidth,
      _$content;

  /* table */
  var _timelineTableIdSuffix = '-table',
      _daysTableClass = 'days-table',
      _xAxisClass = 'x-axis',
      _yAxisClass = 'y-axis-row',
      _yAxisMarkerClass = 'y-axis-marker',
      _$timelineTable = _$table.clone(),
      _$rowTmpl = $("<tr>"),
      _$colTmpl = $("<td>"),
      _$xAxis,
      _xAxisHeight = 20,
      _padding = 31,
      _monthLabelWidth = 45;

  jQuery.extend(this, {
    rows: 3,
    unitsInView: 3,
    yAxisIncrement: 10,
    start: Date.parseExact('20120103', 'yyyyMMdd'),
    end: Date.parseExact('20130307', 'yyyyMMdd'),
    dateMasks: {},
    scrubber: null,
    onSelection: null
  }, config);

  function init() {
    _setElements.call(this);
    _buildGrid.call(this);
    _buildScrubber.call(this);
  };

  function _setElements() {
    this.id = this.parentId + _timelineTableIdSuffix;

    _$timeline = $('#' + this.parentId);
    _$timelineTable = _$table.clone().attr('id', this.id)
    _$viewport = $('<div>').attr('id', this.parentId + _viewportIdSuffix);
    _$content = $('<div>').attr('id', this.parentId + _contentIdSuffux);
  };

  function _buildGrid() {
    var months = Date.spanDifference(this.start, this.end),
        verticalSpacing = parseInt((_$timeline.height() - _xAxisHeight) / this.rows),
        horizontalSpacing = _$timeline.width() / this.unitsInView,
        totalWidth = horizontalSpacing * months.length,
        _totalWidth = totalWidth,
        rows = this.rows + 1, //add x-axis
        month,
        $row,
        $month,
        $daysTable;

    for(var i = rows; i > 0 ; i--) {

      $row = _getRow.call(this, i, rows, verticalSpacing);

      for(var j = 0, len = months.length; j < len; j++) {
        month = months[j];

        $month = _getMonth.call(this, i, month, horizontalSpacing);
        $daysTable = _getDaysTable.call(this, i, month);
        _$timelineTable.append(
          $row.append(
            $month.append($daysTable)
          )
        );
      }
    }

    _$timeline.append(_$viewport.append(_$content.width(totalWidth).append(_$timelineTable)));
    _$timeline.width($('body').width() - _padding);
    _$viewport.scrollLeft(totalWidth);
  };

  function _buildScrubber() {
    var context = this;
    this.scrubber = new Scrubber({
      timelineId: this.parentId,
      referenceElId: _$viewport.attr('id'),
      callback: function(start, end, months) {
        if(typeof context.onSelection === 'function') {
          context.onSelection(start, end, months);
        }
      },
      scroll: function(diff) {
        var oldScroll = _$viewport.scrollLeft();
        _$viewport.scrollLeft(oldScroll + diff);
      }
    });
  }

  function _getRow(index, count, height) {
    var $row = _$rowTmpl.clone();

    if(index == 1) {
      $row.addClass(_xAxisClass);
    }
    else {
      $row.addClass(_yAxisClass);
      $row.height(height);
    }

    if(index != 1 && (index != count)) {
      _$timelineTable.append(_$rowTmpl.clone().addClass(_yAxisMarkerClass).append(_$colTmpl.clone().html(parseInt((index-1)*this.yAxisIncrement).toString())));
    }

    return $row;
  };

  function _getMonth(index, month, width) {
    var $month = _$colTmpl.clone().addClass('month ' + month.monthClass);

    if(index == 1) {
      $month
        .prepend(
          $("<div class='month-label'>" + month.shortMonth + " " + month.year +  "</div>")
            .css({
              top: _xAxisHeight,
              left: (width/2) - (_monthLabelWidth/2)
            })
        )
        .addClass('unit-marker');
    }

    return $month;
  };

  function _getDaysTable(index, month) {
    var $daysTable = _$table.clone().addClass(_daysTableClass);
    var $daysRow = _getDaysRow.call(this, index, month);

    return $daysTable.append($daysRow);
  };

  function _getDaysRow(index, month) {
    var $daysRow = _$rowTmpl.clone(),
        dayClass;

    for(var d = 1, days = month.days; d <= days; d++) {
      dayClass = month.monthClass + ((d < 10) ? "0" + d.toString() : d.toString());
      if(index == 1) {
        dayClass += ' sub-unit-marker';
      }
      $daysRow.append(_$colTmpl.clone().addClass(dayClass + ' day').attr('data-date', dayClass));
    }

    return $daysRow;
  };

  function _addToDayColumn(dateStr, count) {
    var $yAxisRow,
        $dayCol,
        $item;

    for(var i = 1; i <= count; i++) {
        //$dayCol = $('#timeline-table tr.y-axis-row:last-child table.days-table td.' + key);
        $yAxisRow = _getYAxisRow.call(this, i);
        //$yAxisRow = $('tr.y-axis-row').last();
        $dayCol = $yAxisRow.find('td.' + dateStr.substr(0, dateStr.length - 2)).find('table.days-table td.' + dateStr);;

        if($dayCol.length > 0) {
          $item = _$div.clone().addClass('item').css('height', $yAxisRow.height() / this.yAxisIncrement);

          if(i > this.yAxisIncrement) {
            $item.css({
              bottom: -3*(this.rows - $yAxisRow.data('index'))
            });
          }

          $dayCol.append($item);

        }
        else {
          console.log(dateStr + ' was not found in table.days-table')
        }
      }

      _getYAxisRow.rows = null;
  };

  function _getYAxisRow(n) {
    if(!_getYAxisRow.rows) {
      _getYAxisRow.rows = $('tr.y-axis-row');
    }

    var base = this.yAxisIncrement,
        index = Math.abs((Math.ceil(n / base)) - 3),
        $row;

    $row = $(_getYAxisRow.rows[index]).attr('data-index', index);
    return $row;
  };

  init.call(this);

  return jQuery.extend(this, {
    add: function(key, count) {
      _addToDayColumn.call(this, key, count);
    },
    destroy: function() {
      this.scrubber.destroy();
      _$viewport.remove();
    },
    positionOf: function(date) {
      var monthClass = date.toString(this.dateMasks.metaYearMonth);
      var $month = $('tr.' + _xAxisClass + ' .' + monthClass);
      var offset = $month.offset();

      return {
        left: offset.left,
        top: offset.top,
        width: $month.width(),
        height: $month.height()
      }
    },
    redraw: function(config) {
      this.destroy();
      jQuery.extend(this, config);
      init.call(this);
    }
  })
};