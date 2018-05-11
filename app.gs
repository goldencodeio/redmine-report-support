function main() {  
  initOptions();
  initTable();
  processReports();  
}

function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.addMenu('GoldenCode Report', [
    {name: 'Создать Отчёт', functionName: 'main'}
  ]);
}