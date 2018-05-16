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
  for (var i = 0; i < allSheets.length; i++) {
    if (allSheets[i].getName() === formatDate(OPTIONS.startDate)) {
      dailySheets.push(allSheets[i]);
      for (var j = 1; j < 7; j++) {
        if (allSheets[i + j]) dailySheets.push(allSheets[i + j]);
      }
    }
  }
  
}
