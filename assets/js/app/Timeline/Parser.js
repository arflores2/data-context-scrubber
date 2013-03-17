var Parser = function(config) {

  jQuery.extend(this, {
    dateMasks: {
      parse: 'yyyyMMdd',
      toString: 'MMMM d, yyyy'
    },
    max: null,
    min: null,
    start: null,
    end: null
  }, config)

  function _parse(data) {
    var date,
        value;

    if(jQuery.isEmptyObject(data)) {
      return false;
    }


    for(var dateStr in data) {
      date = Date.parseExact(dateStr, this.dateMasks.parse);
      value = data[dateStr];

      if(date) _dateCompare.call(this, date);
      if(value) _numberCompare.call(this, value);
    }

    return {
      max: this.max,
      min: this.min,
      start: this.start.clone(),
      end: this.end.clone()
    }
  }

  function _dateCompare(date) {
    if(this.start == null && this.end == null) {
      this.start = date;
      this.end = date;
      return;
    }

    if(date.compareTo(this.start) == -1) { //before
      this.start = date;
    }

    if(date.compareTo(this.end) == 1) { //after
      this.end = date;
    }
    return;
  }

  function _numberCompare(value) {
    if(this.max == null && this.min == null) {
      this.max = value;
      this.min = value;
      return;
    }

    this.max = Math.max(this.max, value);
    this.min = Math.min(this.min, value);
  }

  return jQuery.extend(this, {
    parse: function(data) {
      return _parse.call(this, data);
    }
  })

}