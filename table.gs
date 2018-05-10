function writeTable() {
  writeHeader();
  writeUserRows();
}

function sheetСlear() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
}

function writeHeader() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rangeBgColor = '#fff2cc';
  sheet.setName('Итог Месяц').setTabColor('#ffd966');
  var columnI = 1;
  REPORT.forEach(function(k) {
    sheet.getRange(1, columnI++).setValue(k.name).setBackground(rangeBgColor);
  });
}

function writeUserRows() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rangeBgColor = '#fff2cc';
  var rowI = 2;
  users = OPTIONS.users;
  users.forEach(function(user, i) {
    var userData = APIRequest('users', {query: [{key: 'name', value: user}]}).users[0];
    sheet.getRange(rowI++, 1).setValue(userData.firstname + ' ' + userData.lastname).setBackground(rangeBgColor);
    OPTIONS.users[i] = userData;
  });
}