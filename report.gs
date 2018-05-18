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

function processReports() {  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var rowI = 2;
  var columnI = 2;
  OPTIONS.performers = OPTIONS.performers.map(function(user, userIndex) {
    user.reports = {};

    REPORT.forEach(function(report) {
      if (!report.manual) {
        var reportValue = getUserReport(report.code, user, userIndex, 'performers');
        user.reports[report] = reportValue;
        sheet.getRange(rowI, columnI++).setValue(reportValue);
      } else {
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

    REPORT.forEach(function(report) {
      if (!report.manual) {
        var reportValue = getUserReport(report.code, user, userIndex, 'attendants');
        user.reports[report] = reportValue;
        sheet.getRange(rowI, columnI++).setValue(reportValue);
      } else {
        ss.setNamedRange('manualRange' + rowI + columnI, sheet.getRange(sheet.getRange(rowI, columnI++).getA1Notation()));
      }
    });

    columnI = 2;
    rowI++;
    return user;
  });
}

function getUserReport(report, user, userIndex, userType) {
  switch (report) {
    case 'work_time':
      return getWorkTime(userIndex, userType);
      break;

    case 'written_time':
      return getWrittenTime(user, userIndex, userType);
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

function getWorkTime(i, type) {
  if (type === 'performers') return OPTIONS.performersWorkHours[i];
  if (type === 'attendants') return OPTIONS.attendantsWorkHours[i];
}

function getWrittenTime(user, i, type) {
  var res = APIRequest('time_entries', {query: [
    {key: 'user_id', value: user.id},
    {key: 'spent_on', value: formatDate(OPTIONS.currentDate)}
  ]});

  var timeEntries = res.time_entries.reduce(function(a, c) {
    return a + c.hours;
  }, 0);

  if (type === 'performers')
    if (!OPTIONS.performersWorkHours[i]) return 0;
    return (100 / parseInt(OPTIONS.performersWorkHours[i], 10) * timeEntries);

  if (type === 'attendants')
    if (!OPTIONS.performersWorkHours[i]) return 0;
    return (100 / parseInt(OPTIONS.attendantsWorkHours[i], 10) * timeEntries);
}

function getCountTotalTasks(user) {
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'created_on', value: formatDate(OPTIONS.currentDate)}
  ]});
  return res.issues.length;
}

function getCountDoneTasks(user) {
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: formatDate(OPTIONS.currentDate)}
  ]});
  return res.issues.length;
}

function getCountCriticalTasks(user) {
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'priority_id', value: '5'},
    {key: 'created_on', value: formatDate(OPTIONS.currentDate)}
  ]});
  return res.issues.length;
}

function getOverdueTasks(user) {
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: formatDate(OPTIONS.currentDate)}
  ]});

  return res.issues.reduce(function(a, c) {
    if (c.due_date && Date.parse(c.due_date) < OPTIONS.startDate.getTime()) return a + 1;
    else return a
  }, 0);
}

function getUnsubscribed(user) {
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: formatDate(OPTIONS.currentDate)},
    {key: 'cf_1', value: '1'}
  ]});
  var unsubscribed = res.issues.filter(function(item) {
    if (item.custom_fields.find(function(i) {return i.id === 1}).value === '')
      return true;
  });
  return unsubscribed.length;
}

function getClaims(user) {
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: 5},
    {key: 'assigned_to_id', value: user.id},
    {key: 'created_on', value: formatDate(OPTIONS.currentDate)}
  ]});
  return res.issues.length;
}
