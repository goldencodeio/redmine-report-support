function initTable() {
  writeHeader();
  writeUserRows();
}

function writeHeader() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();  
  sheet.getRange(1, 1).setValue('Исполнитель').setBackground('#cfe2f3');
  var columnI = 2;
  REPORT.forEach(function(k) {    
    var rangeBgColor = (k.manual) ? '#b4a7d6' : '#cfe2f3';
    sheet.getRange(1, columnI++).setValue(k.name).setBackground(rangeBgColor);
  });
}

function writeUserRows() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rangeBgColor = '#cfe2f3';
  var rowI = 2;
  users = OPTIONS.performers;
  users.forEach(function(user, i) {
    var userData = APIRequest('users', {query: [{key: 'name', value: user}]}).users[0];
    sheet.getRange(rowI++, 1).setValue(userData.firstname + ' ' + userData.lastname + ' (' + userData.login + ')').setBackground(rangeBgColor);
    OPTIONS.performers[i] = userData;
  });
}