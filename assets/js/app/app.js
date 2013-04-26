$(function() {
  var parseDateMask = 'yyyyMMdd',
      toStringDateMask = 'MMMM d, yyyy',
      metaYearMonthDateMask = 'yyyyMM';

  var timeline = new Timeline({
    id: 'timeline',
    rangeText: 'Showing: ',
    dateMasks: {
      parse: parseDateMask,
      toString: toStringDateMask,
      metaYearMonth: metaYearMonthDateMask,
    },
    onSelection: function(start, end, months) {
      $('#selections').append(
        $('<div>').html('You selected: ' + start.toString(toStringDateMask) + ' - ' + end.toString(toStringDateMask))
      )
    }
  });



  /**
   * timeline add() usage
   */
  setTimeout(function() {
    timeline.add({
      "20120405": 4,
      "20120506": 10,
      "20120625": 16,
      "20120823": 25,
      "20121212": 1,
      "20121213": 2,
      "20121214": 4,
      "20121215": 6,
      "20130104": 67,
      "20130106": 4,
      "20130108": 1,
      "20130112": 9,
      "20130304": 3
    });
  }, 100);
});
