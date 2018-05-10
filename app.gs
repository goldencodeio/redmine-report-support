function main() {  
  initOptions();
  processReports();
  writeTable();
}

function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.addMenu('GoldenCode Report', [
    {name: 'Создать Отчёт', functionName: 'main'}
  ]);
}