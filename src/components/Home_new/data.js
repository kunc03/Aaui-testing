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
  {title : 'Pembicara', width: null, status: true},
  {title : 'Status', width: null, status: true},
  {title : 'Waktu', width: null, status: true},
  {title : 'Tanggal', width: null, status: true},
  {title : 'Peserta', width: null, status: true},
  {title : 'Tampilan', width: null, status: true},
];

export const bodyTabble = [
  {title : 'Andi',pembicara: 'Vitoria Hart', status: true, waktu: null, tanggal: null, peserta: null, tampilan: null},
  {title : 'Josep Sinatupulu',pembicara: 'Vitoria Hart', status: true, waktu: null, tanggal: null, peserta: null, tampilan: null},
  {title : 'Anggun Srikandi Ayu',pembicara: 'Vitoria Hart', status: true, waktu: null, tanggal: null, peserta: null, tampilan: null},
  {title : 'Jejep',pembicara: 'Vitoria Hart', status: true, waktu: null, tanggal: null, peserta: null, tampilan: null},
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