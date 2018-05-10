function main() {  
  writeTable();
}

function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.addMenu('GoldenCode Report', [
    {name: 'Создать Отчёт', functionName: 'main'}
  ]);
}

//function menu() 
//{
//     var ss = SpreadsheetApp.getActiveSpreadsheet();
//     var entries = [ {name: "Моя единственная функция", functionName: "FirstExampleFunc"} ]
//     ss.addMenu("Мои функции", entries);
//}

//var ss = SpreadsheetApp.getActiveSpreadsheet();    
//var sheet = ss.getSheets()[0];
//sheet.getRange("A1").setValue("Содержимое ячейки");