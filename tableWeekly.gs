function initWeeklyTable() {
  writeWeeklyHeader();
  writeWeeklyUserRows();
}

function writeWeeklyHeader() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(1, 1).setValue('Исполнитель').setBackground('#d9ead3');
  var columnI = 2;
  REPORT.forEach(function(k) {
    sheet.getRange(1, columnI++).setValue(k.name).setBackground('#d9ead3');
  });
}

function writeWeeklyUserRows() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rangeBgColor = '#d9ead3';
  var rowI = 2;
  performers = OPTIONS.performers;
  performers.forEach(function(user, i) {
    var userData = APIRequest('users', {query: [{key: 'name', value: user}]}).users[0];
    sheet.getRange(rowI++, 1).setValue(userData.firstname + ' ' + userData.lastname + ' (' + userData.login + ')').setBackground(rangeBgColor);
  });

  attendants = OPTIONS.attendants;
  sheet.getRange(rowI++, 1).setBackground(rangeBgColor);
  sheet.getRange(rowI++, 1).setValue('Дежурный').setBackground(rangeBgColor);
  attendants.forEach(function(user, i) {
    var userData = APIRequest('users', {query: [{key: 'name', value: user}]}).users[0];
    sheet.getRange(rowI++, 1).setValue(userData.firstname + ' ' + userData.lastname + ' (' + userData.login + ')').setBackground(rangeBgColor);
  });
}
