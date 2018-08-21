function createDailyReport() {
  initOptions();
}

function createWeeklyReport() {
  initWeeklyOptions();
  initPeriodTable('#d9ead3');
  processPeriodReports();
}

function createMonthlyReport() {
  initMonthlyOptions();
  initPeriodTable('#fff2cc');
  processPeriodReports();
}

function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.addMenu('GoldenCode Report', [
    {name: 'Создать Ежедневный Отчёт', functionName: 'createDailyReport'},
    {name: 'Создать Еженедельный Отчёт', functionName: 'createWeeklyReport'},
    {name: 'Создать Ежемесячный Отчёт', functionName: 'createMonthlyReport'}
  ]);
}

function createTrigger() {
  ScriptApp.newTrigger('createDailyReport')
      .timeBased()
      .everyHours(1)
      .create();
}

function createBitrixTrigger1() {
  ScriptApp.newTrigger('calculateDelaysOverTime')
      .timeBased()
      .everyDays(1)
      .atHour(23)
      .create();
}

function createBitrixTrigger2() {
  ScriptApp.newTrigger('calculateAttendantsOverTime')
      .timeBased()
      .everyDays(1)
      .atHour(10)
      .create();
}

function deleteAllTriggers() {
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}
