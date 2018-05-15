var OPTIONS = {};

function initOptions() {
  var _ss = SpreadsheetApp.getActiveSpreadsheet();

  var optionsSheet = _ss.setActiveSheet(getOptionsSheet());

  var data = optionsSheet.getRange(1, 1, optionsSheet.getLastRow(), optionsSheet.getLastColumn()).getValues();
  data.forEach(function(row) {
    var key = row.shift();
    row = row.filter(function(a) {return a});
    OPTIONS[key] = row.length > 1 ? row : row[0];
  });

  OPTIONS.startDate.setHours(OPTIONS.startDate.getHours() - 1 * OPTIONS.startDate.getTimezoneOffset() / 60);
  OPTIONS.finalDate.setHours(OPTIONS.finalDate.getHours() - 1 * OPTIONS.finalDate.getTimezoneOffset() / 60);

  if (!Array.isArray(OPTIONS.performers)) OPTIONS.performers = [OPTIONS.performers];
  if (!Array.isArray(OPTIONS.attendants)) OPTIONS.attendants = [OPTIONS.attendants];

  OPTIONS.currentDate = OPTIONS.startDate;
  var startSheetName = formatDate(OPTIONS.currentDate);
  var existingStartSheet = _ss.getSheetByName(startSheetName);
  if (existingStartSheet) {
    var tDate = new Date(OPTIONS.currentDate.getTime());
    tDate.setDate(tDate.getDate() + 1);
    while ( tDate.getTime() <= OPTIONS.finalDate.getTime() ) {
      if (_ss.getSheetByName(formatDate(tDate))) {
        tDate.setDate(tDate.getDate() + 1);
        if (tDate.getTime() > OPTIONS.finalDate.getTime()) {
          OPTIONS.currentDate = new Date(tDate.getTime());
          break;
        }
        continue;
      }
      OPTIONS.currentDate = new Date(tDate.getTime());
      break;
    }
    if (tDate.getTime() <= OPTIONS.finalDate.getTime()) {
      tDate.setDate(tDate.getDate() -1);
      var prevSheet = _ss.getSheetByName(formatDate(tDate)).activate();
      var isRangesEmpty = false;
      var namedRanges = prevSheet.getNamedRanges();
      for (var i = 0; i < namedRanges.length; i++) {
        if (namedRanges[i].getRange().getValue() === '') isRangesEmpty = true;
      }
      if (!isRangesEmpty) createNewSheet(formatDate(OPTIONS.currentDate));
      else OPTIONS.currentDate = new Date(tDate.getTime());
    }
  } else createNewSheet(startSheetName);
}

function getOptionsSheet() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().toLowerCase() === 'options')
      return sheets[i];
  }
  return null;
}

function createNewSheet(name) {
  var _ss = SpreadsheetApp.getActiveSpreadsheet();
  _ss.insertSheet(name).setTabColor('#6d9eeb').setColumnWidth(1, 200).setColumnWidth(3, 150).activate();
}
