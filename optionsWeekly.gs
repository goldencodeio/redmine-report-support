var OPTIONS = {};

function initWeeklyOptions() {
  var _ss = SpreadsheetApp.getActiveSpreadsheet();

  getOptionsData();

  var sheetName = formatDate(OPTIONS.startDate) + ' : ' + formatDate(OPTIONS.finalDate);
  OPTIONS.weeklySheet = _ss.getSheetByName(sheetName);
  if (!OPTIONS.sheetWeekly) OPTIONS.weeklySheet = createNewSheet(sheetName, '#93c47d');
}
