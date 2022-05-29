const getDaysInMonth = async function (month, year) { // returns an Array of all Days (as Date()-Object) of the month (cave: not month-index!) in year
  var date = new Date(year, month-1, 1);
  var days = [];
  while (date.getMonth() === month-1) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default getDaysInMonth