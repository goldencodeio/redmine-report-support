var REPORT = [
  {    
    name: 'Исполнитель'
  },
  {    
    name: 'Рабочее время'
  },
  {    
    name: '% Списанного времени'
  },
  {    
    name: 'Всего задач'
  },
  {    
    name: 'Выполнено'
  },
  {    
    name: 'Критических'
  },
  {    
    name: 'Просроченных'
  },
  {    
    name: 'Неотписано'
  },
  {    
    name: 'Забыто'
  },
  {    
    name: 'Претензий'
  },
  {    
    name: 'Опозданий'
  },
  {    
    name: 'Забыто'
  },
  {    
    name: 'Вранья'
  },
];

function processReports() {
  OPTIONS.users = OPTIONS.users.map(function(userId) {
    var user = APIRequest('users', {query: [{key: 'name', value: userId}]}).users[0];
    // Get time entries for user in defined period
    user.time_entries = APIRequest('time_entries', {query: [
      {key: 'user_id', value: user.id},
      {key: 'spent_on', value: getDateRage()}
    ]}).time_entries;
    
    // Update projects list
    user.time_entries.forEach(function(t) {
      if (PROJECTS.hasOwnProperty(t.project.id)) return;
      PROJECTS[t.project.id] = t.project;
    });
    
    return user;
  });
}