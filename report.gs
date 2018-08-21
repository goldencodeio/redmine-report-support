var REPORT = [
  {
    code: 'work_time',
    name: 'Рабочее\nвремя',
    manual: false
  },
  {
    code: 'written_time',
    name: '% Списанного\nвремени',
    manual: false
  },
  {
    code: 'total_tasks',
    name: 'Всего\nзадач',
    manual: false
  },
  {
    code: 'done_tasks',
    name: 'Выполнено/\nОценено',
    manual: false
  },
  {
    code: 'critical_tasks',
    name: 'Критических/\nОценено',
    manual: false
  },
 {
   code: 'overdue_tasks',
   name: 'Просроченных/\nОценено',
   manual: false
 },
 {
   code: 'paid_separately',
   name: 'Оплачивается\nотдельно/\nОценено',
   manual: false
 },
  {
    code: 'unsubscribed',
    name: 'Неотписано/\nОценено',
    manual: false
  },
 {
   code: 'claims',
   name: 'Претензий/\nОтработано',
   manual: false
 },
 {
   code: 'client_rating_avg',
   name: 'Ср. Оценка\nзаявителя',
   manual: false
 },
 {
   code: 'boss_rating_avg',
   name: 'Ср. Оценка\nведения задачи',
   manual: false
 },
 {
   code: 'forgotten',
   name: 'Забыто',
   manual: true
 },
  {
    code: 'delays',
    name: 'Опозданий\n(мин)',
    manual: true
  },
  {
    code: 'overtime_spent',
    name: 'Переработок\n(мин)',
    manual: true
  },
  {
    code: 'lies',
    name: 'Вранья',
    manual: true
  },
  {
    code: 'points_written_off',
    name: 'Баллов\nсписано по\nпретензиям',
    manual: true
  }
];

function processReports() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var rowI = 2;
  var columnI = 2;
  var doneIssues = [];
  var totalReports = [];
  OPTIONS.performers = OPTIONS.performers.map(function(user, userIndex) {
    user.reports = {};

    REPORT.forEach(function(report, reportIndex) {
      if (!report.manual) {
        var reportValue = getUserReport(report.code, user, userIndex, 'performers');
        user.reports[report] = reportValue;
        if ((Array.isArray(reportValue))) {
          if (totalReports[reportIndex] === undefined) totalReports[reportIndex] = [];
          var listUrl = '';
          if ((Array.isArray(reportValue[0]))) {
            if (totalReports[reportIndex][0] === undefined) totalReports[reportIndex][0] = [];
            if (totalReports[reportIndex][1] === undefined) totalReports[reportIndex][1] = [];
            totalReports[reportIndex][0] = totalReports[reportIndex][0].concat(reportValue[0]);
            totalReports[reportIndex][1] = totalReports[reportIndex][1].concat(reportValue[1]);
            reportValue[0].forEach(function(task) {
              listUrl += 'http://redmine.zolotoykod.ru/issues/' + task.id + '\n';
            });
            sheet.getRange(rowI, columnI++).setValue(reportValue[0].length + ' / '+ reportValue[1].length).setNote(listUrl);
          } else {
            totalReports[reportIndex] = totalReports[reportIndex].concat(reportValue);
            reportValue.forEach(function(task) {
              listUrl += 'http://redmine.zolotoykod.ru/issues/' + task.id + '\n';
            });
            sheet.getRange(rowI, columnI++).setValue(reportValue.length).setNote(listUrl);
          }
        } else {
          if (totalReports[reportIndex] === undefined) totalReports[reportIndex] = 0;
          totalReports[reportIndex] += reportValue;
          if (report.code === 'work_time' && reportValue === 0) sheet.hideRows(rowI);
          sheet.getRange(rowI, columnI++).setValue(reportValue);
        }
      } else {
        if (parseInt(OPTIONS.performersWorkHours[userIndex], 10) === 0) sheet.getRange(rowI, columnI).setValue(0);
        ss.setNamedRange('manualRange' + rowI + columnI, sheet.getRange(sheet.getRange(rowI, columnI++).getA1Notation()));
      }
    });

    columnI = 2;
    rowI++;
    return user;
  });

  rowI += 2;

  OPTIONS.attendants = OPTIONS.attendants.map(function(user, userIndex) {
    user.reports = {};

    REPORT.forEach(function(report, reportIndex) {
      if (!report.manual) {
        var reportValue = getUserReport(report.code, user, userIndex, 'attendants');
        user.reports[report] = reportValue;
        if ((Array.isArray(reportValue))) {
          if (totalReports[reportIndex] === undefined) totalReports[reportIndex] = [];
          var listUrl = '';
          if ((Array.isArray(reportValue[0]))) {
            if (totalReports[reportIndex][0] === undefined) totalReports[reportIndex][0] = [];
            if (totalReports[reportIndex][1] === undefined) totalReports[reportIndex][1] = [];
            totalReports[reportIndex][0] = totalReports[reportIndex][0].concat(reportValue[0]);
            totalReports[reportIndex][1] = totalReports[reportIndex][1].concat(reportValue[1]);
            reportValue[0].forEach(function(task) {
              listUrl += 'http://redmine.zolotoykod.ru/issues/' + task.id + '\n';
            });
            sheet.getRange(rowI, columnI++).setValue(reportValue[0].length + ' / '+ reportValue[1].length).setNote(listUrl);
          } else {
            totalReports[reportIndex] = totalReports[reportIndex].concat(reportValue);
            reportValue.forEach(function(task) {
              listUrl += 'http://redmine.zolotoykod.ru/issues/' + task.id + '\n';
            });
            sheet.getRange(rowI, columnI++).setValue(reportValue.length).setNote(listUrl);
          }
        } else {
          if (totalReports[reportIndex] === undefined) totalReports[reportIndex] = 0;
          totalReports[reportIndex] += reportValue;
          if (report.code === 'work_time' && reportValue === 0) sheet.hideRows(rowI);
          sheet.getRange(rowI, columnI++).setValue(reportValue);
        }
      } else {
        ss.setNamedRange('manualRange' + rowI + columnI, sheet.getRange(sheet.getRange(rowI, columnI++).getA1Notation()));
      }
    });

    columnI = 2;
    rowI++;
    return user;
  });

  rowI += 2;

  totalReports.forEach(function(value, i) {
    if (i === 0 || i === 9 || i === 10) return ++columnI;

    if ((Array.isArray(value))) {
      var listUrl = '';
      if ((Array.isArray(value[0]))) {
        if (i === 8 && value[0].length > 1) {
          value[0] = filterUniqueArray(value[0]);
          if (value[1].length > 1) value[1] = filterUniqueArray(value[1]);
        }
        value[0].forEach(function(task) {
          listUrl += 'http://redmine.zolotoykod.ru/issues/' + task.id + '\n';
        });
        if (value[0].length === 0) sheet.hideColumns(columnI);
        sheet.getRange(rowI, columnI++).setValue(value[0].length + ' / ' + value[1].length).setNote(listUrl);
      } else {
        value.forEach(function(task) {
          listUrl += 'http://redmine.zolotoykod.ru/issues/' + task.id + '\n';
        });
        if (value.length === 0) sheet.hideColumns(columnI);
        sheet.getRange(rowI, columnI++).setValue(value.length).setNote(listUrl);
      }
    } else {
      if (value === 0) sheet.hideColumns(columnI);
      sheet.getRange(rowI, columnI++).setValue(Math.floor(value / (OPTIONS.performers.length + OPTIONS.attendants.length)));
    }
  });

  columnI++;
  var colTotalDelays = sheet.getRange(rowI, columnI).getA1Notation().substr(0, 1);
  sheet.getRange(rowI, columnI++).setFormula('=SUM('+ colTotalDelays + '2:' + colTotalDelays + (rowI - 1) + ')');

  var colTotalOverTime = sheet.getRange(rowI, columnI).getA1Notation().substr(0, 1);
  sheet.getRange(rowI, columnI++).setFormula('=SUM('+ colTotalOverTime + '2:' + colTotalOverTime + (rowI - 1) + ')');
}
