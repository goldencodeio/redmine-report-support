var OPTIONS = {};

function initMonthlyOptions() {
  var _ss = SpreadsheetApp.getActiveSpreadsheet();

  getOptionsData('monthly');

  var sheetName = 'Итог Месяц: ' + formatDate(OPTIONS.startDate).substr(0, 7);
  var existingSheet = _ss.getSheetByName(sheetName);
  if (existingSheet) _ss.deleteSheet(existingSheet);
  createNewSheet(sheetName, '#ffd966');
}
