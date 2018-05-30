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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var rangeBgColor = '#cfe2f3';
  var rowI = 2;
  performers = OPTIONS.performers;
  performers.forEach(function(user, i) {
    var userData = APIRequest('users', {query: [{key: 'name', value: user}]}).users[0];
    sheet.getRange(rowI++, 1).setValue(userData.firstname + ' ' + userData.lastname + ' (' + userData.login + ')').setBackground(rangeBgColor);
    OPTIONS.performers[i] = userData;
  });

  attendants = OPTIONS.attendants;
  sheet.getRange(rowI++, 1).setBackground(rangeBgColor);
  sheet.getRange(rowI++, 1).setValue('Дежурный').setBackground(rangeBgColor);
  attendants.forEach(function(user, i) {
    var userData = APIRequest('users', {query: [{key: 'name', value: user}]}).users[0];
    sheet.getRange(rowI++, 1).setValue(userData.firstname + ' ' + userData.lastname + ' (' + userData.login + ')').setBackground(rangeBgColor);
    OPTIONS.attendants[i] = userData;
  });

  rowI+=2;
  sheet.getRange(rowI, 1, 1, sheet.getLastColumn()).setBackground('#cfe2f3');
  sheet.getRange(rowI, 1).setValue('Итого').setFontWeight('bold');
  sheet.getRange(rowI++, 2).setValue(formatDate(OPTIONS.startDate));
  sheet.getRange(rowI++, 1).setValue('Ответственный').setBackground('#cfe2f3').setFontWeight('bold');
  sheet.getRange(rowI++, 1).setValue(OPTIONS.daily[0]).setBackground('#cfe2f3');
  sheet.getRange(rowI++, 1).setValue('Утверждает').setBackground('#cfe2f3').setFontWeight('bold');
  sheet.getRange(rowI++, 1).setValue(OPTIONS.daily[1]).setBackground('#cfe2f3');
  sheet.getRange(rowI++, 1).setValue('Оценка').setBackground('#cfe2f3').setFontWeight('bold');
  sheet.getRange(rowI, 1).setBackground('#cfe2f3');
  ss.setNamedRange('manualRange' + rowI + 1, sheet.getRange(sheet.getRange(rowI, 1).getA1Notation()));
}
