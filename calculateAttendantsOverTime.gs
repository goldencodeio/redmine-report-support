function calculateAttendantsOverTime() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  var yesterdaySheet = ss.getSheetByName(formatDate(yesterdayDate));
  if (!yesterdaySheet) return;
  yesterdaySheet.activate();
  getOptionsData();

  OPTIONS.attendants = OPTIONS.attendants.map(function(user, i) {
    return APIRequestBitrix('user.get', {query: [{key: 'uf_phone_inner', value: user}]}).result[0];
  });

  var rowI = 2 + OPTIONS.performers.length + 2;
  var columnI = 16;

  OPTIONS.attendants.forEach(function(user, userIndex) {
    REPORT.forEach(function(report) {
      if (report.code === 'overtime_spent') {
        var reportValue = getUserReport(report.code, user, userIndex, 'attendants');
        yesterdaySheet.getRange(rowI, columnI).setValue(reportValue);
      }
    });

    rowI++;
  });
}
