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
  var allSheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var dailySheets = [];
  var performers = [];
  var attendants = [];

  allSheets.forEach(function(sheet, i) {
    if (sheet.getName() === formatDate(OPTIONS.startDate)) {
      dailySheets.push(sheet);
      for (var j = 1; j < 7; j++) {
        if (allSheets[i + j]) dailySheets.push(allSheets[i + j]);
      }
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
          if (user == login) performers[iUser][iSheet] = row;
        });
        OPTIONS.attendants.forEach(function(user, iUser) {
          if (user == login) attendants[iUser][iSheet] = row;
        });
      });
    });
  }

  performers = performers.map(function(user) {
    var arrSum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    arrSum.forEach(function(sum, i) {
      user.forEach(function(row) {
          arrSum[i] += row[i];
      });
    });
    arrSum[1] = arrSum[1] / user[0].length;
    return arrSum;
  });
}
