var REPORT = [
  {
    code: 'work_time',
    name: 'Рабочее время',
    manual: false
  },
  {
    code: 'written_time',
    name: '% Списанного времени',
    manual: false
  },
  {
    code: 'total_tasks',
    name: 'Всего задач',
    manual: false
  },
  {
    code: 'done_tasks',
    name: 'Выполнено',
    manual: false
  },
  {
    code: 'critical_tasks',
    name: 'Критических',
    manual: false
  },
 {
   code: 'overdue_tasks',
   name: 'Просроченных',
   manual: false
 },
  {
    code: 'unsubscribed',
    name: 'Неотписано',
    manual: false
  },
  {
    code: 'forgotten',
    name: 'Забыто',
    manual: true
  },
 {
   code: 'claims',
   name: 'Претензий',
   manual: false
 },
  {
    code: 'delays',
    name: 'Опозданий',
    manual: true
  },
  {
    code: 'lies',
    name: 'Вранья',
    manual: true
  }
];

function processWeeklyReports() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetWeekly = ss.getActiveSheet();
  var allSheets = ss.getSheets();
  var dailySheets = [];
  var performers = [];
  var attendants = [];

  allSheets.forEach(function(sheet, i) {
    var tDate = new Date(OPTIONS.startDate.getTime());
    while (tDate.getTime() <= OPTIONS.finalDate.getTime()) {
      if (sheet.getName() === formatDate(tDate)) dailySheets.push(sheet);
      tDate.setDate(tDate.getDate() + 1);
    }
  });

  if (dailySheets.length > 0) {
    dailySheets.forEach(function(sheet, iSheet) {
      var data = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
      data.forEach(function(row) {
        var login = row.shift();
        login = login.match(/\d{4}/);
        if (!login) return;
        login = login[0];

        OPTIONS.performers.forEach(function(user, iUser) {
          // Browser.msgBox(user + ' | ' + login);
          if (user == login){
            if (performers[iUser] === undefined) performers[iUser] = [];
            performers[iUser].push(row);
          }
        });
        OPTIONS.attendants.forEach(function(user, iUser) {
          if (user == login){
            if (attendants[iUser] === undefined) attendants[iUser] = [];
            attendants[iUser].push(row);
          }
        });
      });
    });
  }

  performers = performers.map(function(user) {
    var arrSum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    arrSum.forEach(function(sum, i) {
      user.forEach(function(row) {
          arrSum[i] += parseFloat(row[i]);
      });
    });
    arrSum[1] = arrSum[1] / user[0].length;
    return arrSum;
  });

  attendants = attendants.map(function(user) {
    var arrSum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    arrSum.forEach(function(sum, i) {
      user.forEach(function(row) {
          arrSum[i] += parseFloat(row[i]);
      });
    });
    arrSum[1] = arrSum[1] / user[0].length;
    return arrSum;
  });

  // print

  var rowI = 2;
  var columnI = 2;
  performers.forEach(function(user) {
    user.forEach(function(value) {
      sheetWeekly.getRange(rowI, columnI++).setValue(value);
    });
    columnI = 2;
    rowI++;
  });

  rowI += 2;

  attendants.forEach(function(user) {
    user.forEach(function(value) {
      sheetWeekly.getRange(rowI, columnI++).setValue(value);
    });
    columnI = 2;
    rowI++;
  });
}
