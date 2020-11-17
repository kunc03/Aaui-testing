// import dayjs from "dayjs";
// import React from "react";

// function getDate(hours: number): number {
//   return (
//     dayjs()
//       .startOf("day")
//       .valueOf() +
//     hours * 60 * 60 * 1000
//   );
// }

const now = new Date()

export const dataKalender = [
  {
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2015, 3, 0),
    end: new Date(2015, 3, 1),
  },
  {
    id: 1,
    title: 'Long Event',
    start: new Date(2015, 3, 7),
    end: new Date(2015, 3, 10),
  },

  {
    id: 2,
    title: 'DTS STARTS',
    start: new Date(2016, 2, 13, 0, 0, 0),
    end: new Date(2016, 2, 20, 0, 0, 0),
  },

  {
    id: 3,
    title: 'DTS ENDS',
    start: new Date(2016, 10, 6, 0, 0, 0),
    end: new Date(2016, 10, 13, 0, 0, 0),
  },

  {
    id: 4,
    title: 'Some Event',
    start: new Date(2015, 3, 9, 0, 0, 0),
    end: new Date(2015, 3, 10, 0, 0, 0),
  },
  {
    id: 5,
    title: 'Conference',
    start: new Date(2015, 3, 11),
    end: new Date(2015, 3, 13),
    desc: 'Big conference for important people',
  },
  {
    id: 6,
    title: 'Meeting',
    start: new Date(2015, 3, 12, 10, 30, 0, 0),
    end: new Date(2015, 3, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting',
  },
  {
    id: 7,
    title: 'Lunch',
    start: new Date(2015, 3, 12, 12, 0, 0, 0),
    end: new Date(2015, 3, 12, 13, 0, 0, 0),
    desc: 'Power lunch',
  },
  {
    id: 8,
    title: 'Meeting',
    start: new Date(2015, 3, 12, 14, 0, 0, 0),
    end: new Date(2015, 3, 12, 15, 0, 0, 0),
  },
  {
    id: 9,
    title: 'Happy Hour',
    start: new Date(2015, 3, 12, 17, 0, 0, 0),
    end: new Date(2015, 3, 12, 17, 30, 0, 0),
    desc: 'Most important meal of the day',
  },
  {
    id: 10,
    title: 'Dinner',
    start: new Date(2015, 3, 12, 20, 0, 0, 0),
    end: new Date(2015, 3, 12, 21, 0, 0, 0),
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2015, 3, 13, 7, 0, 0),
    end: new Date(2015, 3, 13, 10, 30, 0),
  },
  {
    id: 12,
    title: 'Late Night Event',
    start: new Date(2015, 3, 17, 19, 30, 0),
    end: new Date(2015, 3, 18, 2, 0, 0),
  },
  {
    id: 12.5,
    title: 'Late Same Night Event',
    start: new Date(2015, 3, 17, 19, 30, 0),
    end: new Date(2015, 3, 17, 23, 30, 0),
  },
  {
    id: 13,
    title: 'Multi-day Event',
    start: new Date(2015, 3, 20, 19, 30, 0),
    end: new Date(2015, 3, 22, 2, 0, 0),
  },
  {
    id: 14,
    title: 'Today',
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 15,
    title: 'Point in Time Event',
    start: now,
    end: now,
  },
  {
    id: 16,
    title: 'Video Record',
    start: new Date(2015, 3, 14, 15, 30, 0),
    end: new Date(2015, 3, 14, 19, 0, 0),
  },
  {
    id: 17,
    title: 'Dutch Song Producing',
    start: new Date(2015, 3, 14, 16, 30, 0),
    end: new Date(2015, 3, 14, 20, 0, 0),
  },
  {
    id: 18,
    title: 'Itaewon Halloween Meeting',
    start: new Date(2015, 3, 14, 16, 30, 0),
    end: new Date(2015, 3, 14, 17, 30, 0),
  },
  {
    id: 19,
    title: 'Online Coding Test',
    start: new Date(2015, 3, 14, 17, 30, 0),
    end: new Date(2015, 3, 14, 20, 30, 0),
  },
  {
    id: 20,
    title: 'An overlapped Event',
    start: new Date(2015, 3, 14, 17, 0, 0),
    end: new Date(2015, 3, 14, 18, 30, 0),
  },
  {
    id: 21,
    title: 'Phone Interview',
    start: new Date(2015, 3, 14, 17, 0, 0),
    end: new Date(2015, 3, 14, 18, 30, 0),
  },
  {
    id: 22,
    title: 'Cooking Class',
    start: new Date(2015, 3, 14, 17, 30, 0),
    end: new Date(2015, 3, 14, 19, 0, 0),
  },
  {
    id: 23,
    title: 'Go to the gym',
    start: new Date(2015, 3, 14, 18, 30, 0),
    end: new Date(2015, 3, 14, 20, 0, 0),
  },
]

export const dataEvent = [
  {title : 'Meeting', total: 6, status: true},{title : 'Learning', total: 6, status: true},{title : 'Webinar', total: 6, status: false}
];

export const dataProjek = [
  {title : 'Bisnis Projek',webinar: 1, meeting: 6, status: true},
  {title : 'Marketing Projek',webinar: 0, meeting: 3, status: false},
  {title : 'Sales Projek',webinar: 8, meeting: 0, status: false},
  {title : 'Team Projek',webinar: 0, meeting: 6, status: false}
];

export const dataToDo = [
  // {title: 'Judul LIst To DO 1',type : 'Personal',name: 'Alvin', description: 'With easy access to Broadband and DSL the number of people using the Internet has skyrocket in recent years', status: true},
  // {title: 'Judul LIst To DO 2',type : 'System',name: 'Yoan', description: 'With easy access to Broadband and DSL the number of people using the Internet has skyrocket in recent years.', status: false},
];

export const headerTabble = [
  // {title : 'Nama Meeting', width: null, status: true},
  {title : 'Moderator', width: null, status: true},
  {title : 'Status', width: null, status: true},
  {title : 'Waktu', width: null, status: true},
  {title : 'Tanggal', width: null, status: true},
  {title : 'Peserta', width: null, status: true},
  // {title : 'File Project', width: null, status: true},
];

export const bodyTabble = [
  {title : 'Andi',pembicara: 'Vitoria Hart', status: 'Close', waktu: '10:00 - 12:00', tanggal: '2020-09-04', peserta: 27, lampiran: null},
  {title : 'Josep Sinatupulu',pembicara: 'Vitoria Hart', status: 'Open', waktu: null, tanggal: null, peserta: null, lampiran: null},
  {title : 'Anggun Srikandi Ayu',pembicara: 'Vitoria Hart', status: 'Open', waktu: null, tanggal: null, peserta: null, lampiran: null},
  {title : 'Jejep',pembicara: 'Vitoria Hart', status: 'Open', waktu: null, tanggal: null, peserta: null, lampiran: null},
];
export const headerFiles = [
  // {title : 'Date', width: null, status: true},
  // {title : 'By', width: null, status: true},
  // {title : 'Size', width: null, status: true},
  {title : '', width: null, status: true},
];
export const dataFiles = [
  {name : 'Folder ABC',date: '2020-09-09', by: 'Alvin', size: '13MB'},
];

export const bodyTabbleWebinar = [
];

// export const tasks = [
//   {
//     id: 1,
//     label: "Make some noise",
//     user:
//       '<a href="https://www.google.com/search?q=John+Doe" target="_blank" style="color:#0077c0;">John Doe</a>',
//     start: getDate(-24 * 5),
//     duration: 5 * 24 * 60 * 60 * 1000,
//     progress: 85,
//     type: "project"
//   },
//   {
//     id: 2,
//     label: "With great power comes great responsibility",
//     user:
//       '<a href="https://www.google.com/search?q=Peter+Parker" target="_blank" style="color:#0077c0;">Peter Parker</a>',
//     parentId: 1,
//     start: getDate(-24 * 4),
//     duration: 4 * 24 * 60 * 60 * 1000,
//     progress: 50,
//     type: "milestone",
//     style: {
//       base: {
//         fill: "#1EBC61",
//         stroke: "#0EAC51"
//       }
//       /*'tree-row-bar': {
//             fill: '#1EBC61',
//             stroke: '#0EAC51'
//           },
//           'tree-row-bar-polygon': {
//             stroke: '#0EAC51'
//           }*/
//     }
//   },
//   {
//     id: 3,
//     label: "Courage is being scared to death, but saddling up anyway.",
//     user:
//       '<a href="https://www.google.com/search?q=John+Wayne" target="_blank" style="color:#0077c0;">John Wayne</a>',
//     parentId: 2,
//     start: getDate(-24 * 3),
//     duration: 2 * 24 * 60 * 60 * 1000,
//     progress: 100,
//     type: "task"
//   },
//   {
//     id: 4,
//     label: "Put that toy AWAY!",
//     user:
//       '<a href="https://www.google.com/search?q=Clark+Kent" target="_blank" style="color:#0077c0;">Clark Kent</a>',
//     start: getDate(-24 * 2),
//     duration: 2 * 24 * 60 * 60 * 1000,
//     progress: 50,
//     type: "task",
//     dependentOn: [3]
//   },
//   {
//     id: 5,
//     label:
//       "One billion, gajillion, fafillion... shabadylu...mil...shabady......uh, Yen.",
//     user:
//       '<a href="https://www.google.com/search?q=Austin+Powers" target="_blank" style="color:#0077c0;">Austin Powers</a>',
//     parentId: 4,
//     start: getDate(0),
//     duration: 2 * 24 * 60 * 60 * 1000,
//     progress: 10,
//     type: "milestone",
//     style: {
//       base: {
//         fill: "#0287D0",
//         stroke: "#0077C0"
//       }
//     }
//   },
//   {
//     id: 6,
//     label: "Butch Mario and the Luigi Kid",
//     user:
//       '<a href="https://www.google.com/search?q=Mario+Bros" target="_blank" style="color:#0077c0;">Mario Bros</a>',
//     parentId: 5,
//     start: getDate(24),
//     duration: 1 * 24 * 60 * 60 * 1000,
//     progress: 50,
//     type: "task",
//     style: {
//       base: {
//         fill: "#8E44AD",
//         stroke: "#7E349D"
//       }
//     }
//   },
//   {
//     id: 7,
//     label: "Devon, the old man wanted me, it was his dying request",
//     user:
//       '<a href="https://www.google.com/search?q=Knight+Rider" target="_blank" style="color:#0077c0;">Knight Rider</a>',
//     parentId: 2,
//     dependentOn: [6],
//     start: getDate(24 * 2),
//     duration: 4 * 60 * 60 * 1000,
//     progress: 20,
//     type: "task"
//   },
//   {
//     id: 8,
//     label: "Hey, Baby! Anybody ever tell you I have beautiful eyes?",
//     user:
//       '<a href="https://www.google.com/search?q=Johhny+Bravo" target="_blank" style="color:#0077c0;">Johhny Bravo</a>',
//     parentId: 7,
//     dependentOn: [7],
//     start: getDate(24 * 3),
//     duration: 1 * 24 * 60 * 60 * 1000,
//     progress: 0,
//     type: "task"
//   },
//   {
//     id: 9,
//     label:
//       "This better be important, woman. You are interrupting my very delicate calculations.",
//     user:
//       '<a href="https://www.google.com/search?q=Dexter\'s+Laboratory" target="_blank" style="color:#0077c0;">Dexter\'s Laboratory</a>',
//     parentId: 8,
//     dependentOn: [8, 7],
//     start: getDate(24 * 4),
//     duration: 4 * 60 * 60 * 1000,
//     progress: 20,
//     type: "task",
//     style: {
//       base: {
//         fill: "#8E44AD",
//         stroke: "#7E349D"
//       }
//     }
//   },
//   {
//     id: 10,
//     label: "current task",
//     user: (
//       <a
//         href="https://www.google.com/search?q=Johnattan+Owens"
//         target="_blank"
//         style={{ color: "#0077c0" }}
//       >
//         Johnattan Owens
//       </a>
//     ),
//     start: getDate(24 * 5),
//     duration: 24 * 60 * 60 * 1000,
//     progress: 0,
//     type: "task"
//   }
// ];
 
// export const options = {
//   title: {
//     label: "Your project title as html (link or whatever...)",
//     html: false
//   },
//   times: {
//     timeZoom: 10,
//     firstTime: dayjs("2020/03/10").valueOf()
//   },
//   row: { height: 16 },
//   taskList: {
//     columns: [
//       {
//         id: 1,
//         label: "ID",
//         value: "id",
//         width: 40
//       },
//       {
//         id: 2,
//         label: "Description",
//         value: "label",
//         width: 200,
//         expander: true
//       },
//       {
//         id: 3,
//         label: "Assigned to",
//         value: "user",
//         width: 130,
//         html: true
//       },
//       {
//         id: 4,
//         label: "Start",
//         value: task => dayjs(task.start).format("YYYY-MM-DD"),
//         width: 78
//       },
//       {
//         id: 5,
//         label: "Type",
//         value: "type",
//         width: 68
//       },
//       {
//         id: 6,
//         label: "%",
//         value: "progress",
//         width: 35,
//         style: {
//           "task-list-header-label": {
//             textAlign: "center",
//             width: "100%"
//           },
//           "task-list-item-value-container": {
//             textAlign: "center"
//           }
//         }
//       }
//     ]
//   }
// }


export const dataBar = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgb(255, 99, 132)', //red
        'rgb(54, 162, 235)', //blue
        'rgb(75, 192, 192)', //green
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
}

export const dataRadar = {
  labels: [] /* [
    'Eating',
    'Drinking',
    'Sleeping',
    'Designing',
    'Coding',
    'Cycling',
    'Running',
  ], */,
  datasets: [
    {
      label: 'user activity',
      backgroundColor: 'rgba(179,181,198,0.2)',
      borderColor: 'rgba(179,181,198,1)',
      pointBackgroundColor: 'rgba(179,181,198,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(179,181,198,1)',
      data: [], // [65, 59, 90, 81, 56, 55, 40],
    },
  ],
};

export const dataUser = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgb(255, 99, 132)', //red
        'rgb(54, 162, 235)', //blue
        'rgb(75, 192, 192)', //green
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
}

export const dataPie = {
  labels: ['Blue', 'Yellow', 'Green'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgb(255, 99, 132)', //red
        'rgb(54, 162, 235)', //blue
        'rgb(75, 192, 192)', //green
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
}
