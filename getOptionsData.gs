var OPTIONS = {};

function getOptionsData(reportType) {
  var _ss = SpreadsheetApp.getActiveSpreadsheet();

  var optionsSheet = _ss.setActiveSheet(getOptionsSheet());

  var data = optionsSheet.getRange(1, 1, optionsSheet.getLastRow(), optionsSheet.getLastColumn()).getValues();
  data.forEach(function(row) {
    var key = row.shift();
    row = row.filter(function(a) {
      if (a === 0) return true;
      return a
    });
    OPTIONS[key] = row.length > 1 ? row : row[0];
  });

  if (reportType) {
    switch (reportType) {
      case 'weekly':
        OPTIONS.startDate = OPTIONS.startDateWeekly;
        OPTIONS.finalDate = OPTIONS.finalDateWeekly;
        break;

      case 'monthly':
        OPTIONS.startDate = OPTIONS.startDateMonthly;
        OPTIONS.finalDate = OPTIONS.finalDateMonthly;
        break;
    }

    OPTIONS.finalDate.setHours(OPTIONS.finalDate.getHours() - 1 * OPTIONS.finalDate.getTimezoneOffset() / 60);
  }

  OPTIONS.startDate.setHours(OPTIONS.startDate.getHours() - 1 * OPTIONS.startDate.getTimezoneOffset() / 60);

  if (!Array.isArray(OPTIONS.performers)) OPTIONS.performers = [OPTIONS.performers];
  if (!Array.isArray(OPTIONS.attendants)) OPTIONS.attendants = [OPTIONS.attendants];
  if (!Array.isArray(OPTIONS.performersWorkHours)) OPTIONS.performersWorkHours = [OPTIONS.performersWorkHours];
  if (!Array.isArray(OPTIONS.attendantsStartDate)) OPTIONS.attendantsStartDate = [OPTIONS.attendantsStartDate];
  if (!Array.isArray(OPTIONS.attendantsFinalDate)) OPTIONS.attendantsFinalDate = [OPTIONS.attendantsFinalDate];

  OPTIONS.attendantsStartDate.map(function(date) {
    date.setHours(date.getHours() - 1 * date.getTimezoneOffset() / 60);
    return date;
  });

  OPTIONS.attendantsFinalDate.map(function(date) {
    date.setHours(date.getHours() - 1 * date.getTimezoneOffset() / 60);
    return date;
  });
}

function getOptionsSheet() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().toLowerCase() === 'options')
      return sheets[i];
  }
  return null;
}
