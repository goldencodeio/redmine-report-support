function createDailyReport() {
  initOptions();
  initTable();
  processReports();
}

function createWeeklyReport() {
  initWeeklyOptions();
  initWeeklyTable();
//  processWeeklyReports();
}

function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.addMenu('GoldenCode Report', [
    {name: 'Создать Ежедневный Отчёт', functionName: 'createDailyReport'},
    {name: 'Создать Еженедельный Отчёт', functionName: 'createWeeklyReport'}
  ]);
}
