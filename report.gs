var REPORT = [  
  { 
    code: 'work_time',
    name: 'Рабочее время',
    manual: true
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
//  { 
//    code: 'overdue_tasks',
//    name: 'Просроченных',
//    manual: true
//  },
  { 
    code: 'unsubscribed',
    name: 'Неотписано',
    manual: true
  },
  { 
    code: 'forgotten',
    name: 'Забыто',
    manual: true
  },
//  { 
//    code: 'claims',
//    name: 'Претензий',
//    manual: false
//  },
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

function processReports() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rowI = 2;
  var columnI = 2;
  OPTIONS.performers = OPTIONS.performers.map(function(user) {
    user.reports = {};

    REPORT.forEach(function(report) {            
      if (!report.manual) {
        var reportValue = getUserReport(user, report.code);
        user.reports[report] = reportValue;
        sheet.getRange(rowI, columnI++).setValue(reportValue);
      } else {
        sheet.getRange(rowI, columnI++).setValue('');
      }
    });

    columnI = 2;
    rowI++;
    return user;
  });
}

function getUserReport(user, report) {
  switch (report) {   
    case 'written_time':
      return getWrittenTime(user);
      break;
      
    case 'total_tasks':
      return getCountTotalTasks(user);
      break;
      
    case 'done_tasks':
      return getCountDoneTasks(user);
      break;
      
    case 'critical_tasks':
      return getCountCriticalTasks(user);
      break;
    
    case 'overdue_tasks':
      return getOverdueTasks(user);
      break;
      
    case 'unsubscribed':
      return getUnsubscribed(user);
      break;         
      
    case 'claims':
      return getClaims(user);
      break;         
  }
}

function getWrittenTime(user) {
  var res = APIRequest('time_entries', {query: [
    {key: 'user_id', value: user.id},
    {key: 'spent_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)}    
  ]});
  return res.time_entries.reduce(function(a, c) {
    return a + c.hours;
  }, 0);
}

function getCountTotalTasks(user) {
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id}, 
    {key: 'created_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)}    
  ]});
  return res.issues.length;
}

function getCountDoneTasks(user) {
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)}    
  ]});
  return res.issues.length;
}

function getCountCriticalTasks(user) {
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'priority_id', value: '5'},
    {key: 'created_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)}   
  ]});
  return res.issues.length;
}

function getOverdueTasks(user) {
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: formatDate(OPTIONS.startDate)},    
    {key: 'due_date', value: '>' + formatDate(OPTIONS.startDate)}    
  ]});
  return res.issues.length;
}

function getUnsubscribed(user) {
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: getDateRage(OPTIONS.startDate, OPTIONS.finalDate)},
    {key: 'cf_1', value: ''}
  ]});
  return res.issues.length;
}