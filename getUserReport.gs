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

    case 'delays':
      return getDelays(user, userIndex, userType);
      break;

    case 'overtime_spent':
      return getOvertimeSpent(user, userIndex, userType);
      break;
  }
}

function getWorkTime(i, userType) {
  if (userType === 'performers') return OPTIONS.performersWorkHours[i];
  if (userType === 'attendants')
    return getHoursByRange(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]);
}

function getWrittenTime(user, i, userType) {
  var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('time_entries', {query: [
    {key: 'user_id', value: user.id},
    {key: 'spent_on', value: date}
  ]});

  var timeEntries = res.time_entries.reduce(function(a, c) {
    return a + c.hours;
  }, 0);

  if (userType === 'performers') {
    if (!OPTIONS.performersWorkHours[i]) return 0;
    return Math.floor(100 / parseInt(OPTIONS.performersWorkHours[i], 10) * timeEntries);
  }

  if (userType === 'attendants')
    return Math.floor(100 / getHoursByRange(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) * timeEntries);
}

function getCountTotalTasks(user, i, userType) {
  var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: '!5'},
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: '*'},
    {key: 'created_on', value: date}
  ]});
  return res.issues;
}

function getCountDoneTasks(user, userIndex, userType) {
  var filterCreatedDate = (userType === 'attendants') ? formatDate(OPTIONS.attendantsFinalDate[userIndex]) : formatDate(OPTIONS.currentDate);
  var filterUpdatedDate = (userType === 'attendants') ? formatDate(OPTIONS.attendantsStartDate[userIndex]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: '!5'},
    {key: 'assigned_to_id', value: user.id},
    {key: 'status_id', value: '*'},
    {key: 'created_on', value: '<=' + filterCreatedDate},
    {key: 'updated_on', value: '>=' + filterUpdatedDate}
  ]});
  var filteredIssues = res.issues.filter(function(task) {
    var resDetail = APIRequestById('issues', task.id, {query: [
      {key: 'include', value: 'journals'}
    ]});
    for (var j = 0; j < resDetail.issue.journals.length; j++) {
      var journal = resDetail.issue.journals[j];
      if (userType === 'attendants') {
        if (Date.parse(journal.created_on) > OPTIONS.attendantsStartDate[userIndex].getTime() && Date.parse(journal.created_on) < OPTIONS.attendantsFinalDate[userIndex].getTime()) {
          for (var d = 0; d < journal.details.length; d++) {
            var detail = journal.details[d];
            if (detail.name === 'status_id' && detail.new_value === '3') return true;
          }
        }
      } else {
        var journalCreateDate = journal.created_on.split('T').shift();
        if (journalCreateDate === formatDate(OPTIONS.currentDate)) {
          for (var d = 0; d < journal.details.length; d++) {
            var detail = journal.details[d];
            if (detail.name === 'status_id' && detail.new_value === '3') return true;
          }
        }
      }
    }
    return false;
  });

  doneIssues = filteredIssues;

  var filteredIssuesWithRate = filteredIssues.filter(function(item) {
    var rate = item.custom_fields.find(function(i) {return i.id === 7});
    if (rate && rate.value !== '') return true;
  });
  return [filteredIssues, filteredIssuesWithRate];
}

function getCountCriticalTasks(user, i, userType) {
  // var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  // var res = APIRequest('issues', {query: [
  //   {key: 'assigned_to_id', value: user.id},
  //   {key: 'status_id', value: 'closed'},
  //   {key: 'closed_on', value: date},
  //   {key: 'priority_id', value: '5'}
  // ]});
  //
  // var res1 = APIRequest('issues', {query: [
  //   {key: 'assigned_to_id', value: user.id},
  //   {key: 'status_id', value: 'closed'},
  //   {key: 'closed_on', value: date},
  //   {key: 'priority_id', value: '4'}
  // ]});

  var criticalTasks = doneIssues.filter(function(item) {
    if (item.priority.id > 3) return true;
  });

  var criticalTasksWithRate = criticalTasks.filter(function(item) {
    var rate = item.custom_fields.find(function(i) {return i.id === 7});
    if (rate && rate.value !== '') return true;
  });

  return [criticalTasks, criticalTasksWithRate];
}

function getOverdueTasks(user, i, userType) {
  // if (userType === 'attendants') {
  //     var date = getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]);
  // } else {
  //     var prevDate = new Date(OPTIONS.currentDate.getTime());
  //     prevDate.setDate(prevDate.getDate() - 1);
  //     var date = '<=' + formatDate(prevDate);
  // }

  // var res = APIRequest('issues', {query: [
  //   {key: 'assigned_to_id', value: user.id},
  //   {key: 'status_id', value: 'closed'},
  //   {key: 'closed_on', value: formatDate(OPTIONS.currentDate)},
  //   {key: 'due_date', value: date}
  // ]});

  // return res.issues;

  var overdueTasks = doneIssues.filter(function(item) {
    if (userType === 'attendants') {
      if (item.due_date && (Date.parse(item.due_date) + 1000 * 60 * 60 * 24) < OPTIONS.attendantsFinalDate[i].getTime())
        return true;
    } else {
      if (item.due_date && (Date.parse(item.due_date) + 1000 * 60 * 60 * 24) <= OPTIONS.currentDate.getTime())
        return true;
    }
  });

  var overdueTasksWithRate = overdueTasks.filter(function(item) {
    var rate = item.custom_fields.find(function(i) {return i.id === 7});
    if (rate && rate.value !== '') return true;
  });

  return [overdueTasks, overdueTasksWithRate];
}

function getPaidSeparatelyTasks(user, i, userType) {
  // var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  // var res = APIRequest('issues', {query: [
  //   {key: 'assigned_to_id', value: user.id},
  //   {key: 'status_id', value: 'closed'},
  //   {key: 'closed_on', value: date},
  //   {key: 'cf_24', value: 'Единовременная услуга (К оплате)'}
  // ]});
  //
  // return res.issues;

  var paidSeparatelyTasks = doneIssues.filter(function(item) {
    var tariff = item.custom_fields.find(function(i) {
      return i.id === 24 || i.id === 25 || i.id === 26;
    });
    if (tariff && tariff.value === 'Единовременная услуга (К оплате)') return true;
  });

  var paidSeparatelyTasksWithRate = paidSeparatelyTasks.filter(function(item) {
    var rate = item.custom_fields.find(function(i) {return i.id === 7});
    if (rate && rate.value !== '') return true;
  });

  return [paidSeparatelyTasks, paidSeparatelyTasksWithRate];
}

function getUnsubscribed(user, i, userType) {
  // var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  // var res = APIRequest('issues', {query: [
  //   {key: 'assigned_to_id', value: user.id},
  //   {key: 'status_id', value: 'closed'},
  //   {key: 'closed_on', value: date},
  //   {key: 'cf_1', value: '1'}
  // ]});

  var unsubscribed = doneIssues.filter(function(item) {
    var result = item.custom_fields.find(function(i) {return i.id === 1});
    if (result && result.value === '') return true;
  });

  var unsubscribedWithRate = unsubscribed.filter(function(item) {
    var rate = item.custom_fields.find(function(i) {return i.id === 7});
    if (rate && rate.value !== '') return true;
  });

  return [unsubscribed, unsubscribedWithRate];
}

function getClaims(user, i, userType) {
  var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  var res = APIRequest('issues', {query: [
    {key: 'tracker_id', value: 5},
    {key: 'status_id', value: '*'},
    {key: 'created_on', value: date}
  ]});

  var allClaims = res.issues.filter(function(item) {
    var responsibles = item.custom_fields.find(function(i) {return i.id === 40}).value;
    for (var i = 0; i < responsibles.length; i++) {
      if (parseInt(responsibles[i], 10) === user.id) return true;
    }
  });

  var closedClaims = allClaims.filter(function(item) {
    return item.status.id === 5;
  });

  return [allClaims, closedClaims];
}

function getClientRatingAverage(user, i, userType) {
  // var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  // var res = APIRequest('issues', {query: [
  //   {key: 'assigned_to_id', value: user.id},
  //   {key: 'status_id', value: 'closed'},
  //   {key: 'closed_on', value: date},
  //   {key: 'cf_7', value: '*'}
  // ]});

  var doneIssuesWithRate = doneIssues.filter(function(item) {
    var rate = item.custom_fields.find(function(i) {return i.id === 7});
    if (rate && rate.value !== '') return true;
  });

  var sum = doneIssuesWithRate.reduce(function(a, c) {
    return a + parseInt(c.custom_fields.find(function(i) {return i.id === 7}).value, 10);
  }, 0);
  return doneIssuesWithRate.length ? sum / doneIssuesWithRate.length : 0;
}

function getBossRatingAverage(user, i, userType) {
  // var date = (userType === 'attendants') ? getDateRangeWithTime(OPTIONS.attendantsStartDate[i], OPTIONS.attendantsFinalDate[i]) : formatDate(OPTIONS.currentDate);
  // var res = APIRequest('issues', {query: [
  //   {key: 'assigned_to_id', value: user.id},
  //   {key: 'status_id', value: 'closed'},
  //   {key: 'closed_on', value: date},
  //   {key: 'cf_8', value: '*'}
  // ]});

  var doneIssuesWithRate = doneIssues.filter(function(item) {
    var rate = item.custom_fields.find(function(i) {return i.id === 8});
    if (rate && rate.value !== '') return true;
  });

  var sum = doneIssuesWithRate.reduce(function(a, c) {
    return a + parseInt(c.custom_fields.find(function(i) {return i.id === 8}).value, 10);
  }, 0);
  return doneIssuesWithRate.length ? sum / doneIssuesWithRate.length : 0;
}

function getDelays(user, userIndex, userType) {
  Logger.log(user.ID);
  var res = APIRequestBitrix('timeman.status', {query: [
    {key: 'user_id', value: user.ID}
  ]});

  if (!res.result.TIME_START) return 0;

  if (res.result.TIME_START.substr(0, 10) !== res.time.date_start.substr(0, 10)) return 0;

  var date = new Date(res.result.TIME_START);

  if (userType === 'performers') {
    var mustStartMin = parseInt(OPTIONS.performersStartHour[userIndex], 10) * 60;
  } else {
    var mustStartMin = 19 * 60;
  }

  var delay = (date.getHours() * 60 + date.getMinutes()) - mustStartMin;

  return (delay > 0) ? delay : 0;
}

function getOvertimeSpent(user, userIndex, userType) {
  var res = APIRequestBitrix('timeman.status', {query: [
    {key: 'user_id', value: user.ID}
  ]});

  if (!res.result.TIME_FINISH) return 0;

  if (res.result.TIME_FINISH.substr(0, 10) !== res.time.date_start.substr(0, 10)) return 0;

  var date = new Date(res.result.TIME_FINISH);

  if (userType === 'performers') {
    var overTime = (date.getHours() * 60 + date.getMinutes()) - (parseInt(OPTIONS.performersStartHour[userIndex], 10) + 9) * 60;
  } else {
    // if (formatDate(date) === formatDate(new Date())) {
    //   var overTime = 0;
    // } else {
      var overTime = (date.getHours() * 60 + date.getMinutes()) - 8 * 60;
    // }
  }

  return (overTime > 0) ? overTime : 0;
}
