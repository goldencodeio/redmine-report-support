function initOptions() {
  var _ss = SpreadsheetApp.getActiveSpreadsheet();

  getOptionsData();

  OPTIONS.currentDate = OPTIONS.startDate;
  var sheetName = formatDate(OPTIONS.currentDate);
  var existingSheet = _ss.getSheetByName(sheetName);
  var tDate = new Date(OPTIONS.currentDate.getTime());
  if (existingSheet) {
    existingSheet.activate();
    initTable();
    processReports();
    // tDate.setDate(tDate.getDate() + 1);
    // while ( tDate.getTime() <= OPTIONS.finalDate.getTime() ) {
    //   if (_ss.getSheetByName(formatDate(tDate))) {
    //     tDate.setDate(tDate.getDate() + 1);
    //     if (tDate.getTime() > OPTIONS.finalDate.getTime()) {
    //       OPTIONS.currentDate = new Date(tDate.getTime());
    //       break;
    //     }
    //     continue;
    //   }
    //   OPTIONS.currentDate = new Date(tDate.getTime());
    //   break;
    // }
    // if (tDate.getTime() <= OPTIONS.finalDate.getTime()) {
      // tDate.setDate(tDate.getDate() -1);
      // var prevSheet = _ss.getSheetByName(formatDate(tDate)).activate();
      // var isRangesEmpty = false;
      // var namedRanges = prevSheet.getNamedRanges();
      // for (var i = 0; i < namedRanges.length; i++) {
      //   if (namedRanges[i].getRange().getValue() === '') isRangesEmpty = true;
      // }
      // if (!isRangesEmpty) createNewSheet(formatDate(OPTIONS.currentDate), '#6d9eeb');
      // else OPTIONS.currentDate = new Date(tDate.getTime());
    // }
  } else {
    tDate.setDate(tDate.getDate() -1);
    var prevSheet = _ss.getSheetByName(formatDate(tDate));
    // var isRangesEmpty = false;
    if (prevSheet) {
      prevSheet.activate();
      // var namedRanges = prevSheet.getNamedRanges();
      // for (var i = 0; i < namedRanges.length; i++) {
      //   if (namedRanges[i].getRange().getValue() === '') isRangesEmpty = true;
      // }
    }
    // if (!isRangesEmpty) {
      createNewSheet(sheetName, '#6d9eeb');
      initTable();
      processReports();
    // } else Browser.msgBox('Не заполнены ручные поля за предыдущий день');
  }
}

function createNewSheet(name, color) {
  var _ss = SpreadsheetApp.getActiveSpreadsheet();
  return _ss.insertSheet(name).setTabColor(color).setColumnWidth(1, 200).activate().setFrozenColumns(1);
}
