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
    name: 'Критических/Выполнено',
    manual: false
  },
 {
   code: 'overdue_tasks',
   name: 'Просроченных/Выполнено',
   manual: false
 },
 {
   code: 'paid_separately',
   name: 'Оплачивается отдельно',
   manual: false
 },
  {
    code: 'unsubscribed',
    name: 'Неотписано',
    manual: false
  },
 {
   code: 'claims',
   name: 'Претензий',
   manual: false
 },
 {
   code: 'client_rating_avg',
   name: 'Ср. Оценка заявителя',
   manual: false
 },
 {
   code: 'boss_rating_avg',
   name: 'Ср. Оценка ведения задачи',
   manual: false
 },
 {
   code: 'forgotten',
   name: 'Забыто',
   manual: true
 },
  {
    code: 'delays',
    name: 'Опозданий (мин)',
    manual: true
  },
  {
    code: 'overtime_spent',
    name: 'Переработок (мин)',
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
        if ((Array.isArray(reportValue))) {
          var listUrl = '';
          reportValue.forEach(function(task) {
            listUrl += 'http://redmine.zolotoykod.ru/issues/' + task.id + '\r\n';
          });
          sheet.getRange(rowI, columnI++).setValue(reportValue.length).setNote(listUrl);
        } else {
          sheet.getRange(rowI, columnI++).setValue(reportValue);
        }
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
        if ((Array.isArray(reportValue))) {
          var listUrl = '';
          reportValue.forEach(function(task) {
            listUrl += 'http://redmine.zolotoykod.ru/issues/' + task.id + '\r\n';
          });
          sheet.getRange(rowI, columnI++).setValue(reportValue.length).setNote(listUrl);
        } else {
          sheet.getRange(rowI, columnI++).setValue(reportValue);
        }
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
      return getCountTotalTasks(user, userIndex, userType);
      break;

    case 'done_tasks':
      return getCountDoneTasks(user, userIndex, userType);
      break;

    case 'critical_tasks':
      return getCountCriticalTasks(user, userIndex, userType);
      break;

    case 'overdue_tasks':
      return getOverdueTasks(user, userIndex, userType);
      break;

    case 'paid_separately':
      return getPaidSeparatelyTasks(user, userIndex, userType);
      break;

    case 'unsubscribed':
      return getUnsubscribed(user, userIndex, userType);
      break;

    case 'claims':
      return getClaims(user, userIndex, userType);
      break;

    case 'client_rating_avg':
      return getClientRatingAverage(user, userIndex, userType);
      break;

    case 'boss_rating_avg':
      return getBossRatingAverage(user, userIndex, userType);
      break;
  }
}

function getWorkTime(i, userType) {
  if (userType === 'performers') return OPTIONS.performersWorkHours[i];
  if (userType === 'attendants')
    return getHoursByRange(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]);
}

function getWrittenTime(user, i, userType) {
  var res = APIRequest('time_entries', {query: [
    {key: 'user_id', value: user.id},
    {key: 'spent_on', value: formatDate(OPTIONS.currentDate)}
  ]});

  var timeEntries = res.time_entries.reduce(function(a, c) {
    return a + c.hours;
  }, 0);

  if (userType === 'performers')
    if (!OPTIONS.performersWorkHours[i]) return 0;
    return (100 / parseInt(OPTIONS.performersWorkHours[i], 10) * timeEntries);

  if (userType === 'attendants')
    return (100 / getHoursByRange(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) * timeEntries);
}

function getCountTotalTasks(user, i, userType) {
  var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'created_on', value: date}
  ]});
  return res.issues;
}

function getCountDoneTasks(user, i, userType) {
  var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: date}
  ]});
  return res.issues;
}

function getCountCriticalTasks(user, i, userType) {
  var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: date},
    {key: 'priority_id', value: '5'}
  ]});

  var res1 = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: date},
    {key: 'priority_id', value: '4'}
  ]});

  res.issues.concat(res1.issues);
  return res.issues;
}

function getOverdueTasks(user, i, userType) {
  if (userType === 'attendants') {
      var date = getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]);
  } else {
      var prevDate = new Date(OPTIONS.currentDate.getTime());
      prevDate.setDate(prevDate.getDate() - 1);
      var date = '<=' + formatDate(prevDate);
  }

  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: formatDate(OPTIONS.currentDate)},
    {key: 'due_date', value: date}
  ]});

  return res.issues;

  // return res.issues.reduce(function(a, c) {
  //   if (c.due_date && (Date.parse(c.due_date) + 1000 * 60 * 60 * 24) < OPTIONS.currentDate.getTime()) return a + 1;
  //   else return a
  // }, 0);
}

function getPaidSeparatelyTasks(user, i, userType) {
  var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: date},
    {key: 'cf_24', value: 'Единовременная услуга (К оплате)'}
  ]});

  return res.issues;
}

function getUnsubscribed(user, i, userType) {
  var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: date},
    {key: 'cf_1', value: '1'}
  ]});
  var unsubscribed = res.issues.filter(function(item) {
    if (item.custom_fields.find(function(i) {return i.id === 1}).value === '')
      return true;
  });
  return unsubscribed;
}

function getClaims(user, i, userType) {
  var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: 5},
    {key: 'assigned_to_id', value: user.id},
    {key: 'created_on', value: date}
  ]});
  return res.issues;
}

function getClientRatingAverage(user, i, userType) {
  var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: date},
    {key: 'cf_7', value: '*'}
  ]});
  var sum = res.issues.reduce(function(a, c) {
    return a + parseInt(c.custom_fields.find(function(i) {return i.id === 7}).value, 10);
  }, 0);
  return res.issues.length ? sum / res.issues.length : 0;
}

function getBossRatingAverage(user, i, userType) {
  var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('issues', {query: [
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: 'closed'},
    {key: 'closed_on', value: date},
    {key: 'cf_8', value: '*'}
  ]});
  var sum = res.issues.reduce(function(a, c) {
    return a + parseInt(c.custom_fields.find(function(i) {return i.id === 8}).value, 10);
  }, 0);
  return res.issues.length ? sum / res.issues.length : 0;
}
