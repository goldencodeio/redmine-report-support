function writeTable() {
  writeHeader();
  writeUserRows();
}

function writeHeader() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(1, 1).setValue('Исполнитель');
  sheet.getRange(1, 2).setValue('Рабочее время');
  sheet.getRange(1, 3).setValue('% Списанного времени');  
  sheet.getRange(1, 4).setValue('Всего задач');    
  sheet.getRange(1, 5).setValue('Выполнено'); 
  sheet.getRange(1, 6).setValue('Критических'); 
  sheet.getRange(1, 7).setValue('Просроченных'); 
  sheet.getRange(1, 8).setValue('Неотписано'); 
  sheet.getRange(1, 9).setValue('Забыто'); 
  sheet.getRange(1, 10).setValue('Претензий'); 
  sheet.getRange(1, 11).setValue('Опозданий'); 
  sheet.getRange(1, 12).setValue('Вранья'); 
}