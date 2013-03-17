Date.spanDifference = function sd(from, to) {

  //do not manipulate pas objects, clone
  var _from = from.clone(),
      _to = to.clone();

  if(!sd.months) sd.months = [];
  //if(!sd.daysLeft) sd.daysLeft = (new TimeSpan(_to - _from)).getDays();

  var fromDay = _from.getDate(),
      fromMonth = _from.getMonth(),
      fromShortMonth = _from.toString('MMM'),
      fromMonthNumber = _from.toString('MM'),
      fromMonthName = _from.getMonthName(),
      fromYear = _from.getFullYear(),

      toDay = _to.getDate(),
      toMonth = _to.getMonth(),
      toYear = _to.getFullYear();

  sd.months.push({
    dateStr: from.toString('yyyy-MM-dd'),
    day: fromDay,
    month: fromMonth,
    monthClass: fromYear.toString() + fromMonthNumber.toString(),
    shortMonth: fromShortMonth,
    monthNumber: fromMonthNumber,
    monthName: fromMonthName,
    year: fromYear,
    days: from.getDaysInMonth()
  });

  if(fromMonth == toMonth && fromYear == toYear) {
    var ret = sd.months;
    sd.months = [];
    return ret;
  }

  return sd(_from.addMonths(1).moveToFirstDayOfMonth(), _to);
}