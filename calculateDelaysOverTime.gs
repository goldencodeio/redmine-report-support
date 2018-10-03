function calculateDelaysOverTime() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var todaySheet = ss.getSheetByName(formatTodayDate());
  if (!todaySheet) {
    createNewSheet(formatTodayDate(), '#6d9eeb');
    todaySheet = ss.getSheetByName(formatTodayDate());
  }
  getOptionsData();
  todaySheet.activate();

  OPTIONS.performers = OPTIONS.performers.map(function(user, i) {
    return APIRequestBitrix('user.get', {query: [{key: 'uf_phone_inner', value: user}]}).result[0];
  });

  OPTIONS.attendants = OPTIONS.attendants.map(function(user, i) {
    return APIRequestBitrix('user.get', {query: [{key: 'uf_phone_inner', value: user}]}).result[0];
  });

  var rowI = 2;
  var columnI = 14;

  OPTIONS.performers.forEach(function(user, userIndex) {
    REPORT.forEach(function(report) {
      if (report.code === 'delays' || report.code === 'overtime_spent') {
        var reportValue = getUserReport(report.code, user, userIndex, 'performers');
        todaySheet.getRange(rowI, columnI).setValue(reportValue);
        columnI += 2;
      }
    });

    columnI = 14;
    rowI++;
  });

  rowI += 2;

  OPTIONS.attendants.forEach(function(user, userIndex) {
    REPORT.forEach(function(report) {
      if (report.code === 'delays' || report.code === 'overtime_spent') {
        var reportValue = getUserReport(report.code, user, userIndex, 'attendants');
        todaySheet.getRange(rowI, columnI).setValue(reportValue);
        columnI += 2;
      }
    });

    columnI = 14;
    rowI++;
  });
}
