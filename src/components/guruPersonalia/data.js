export const dataBar = {
  labels: [], // ['Director Office', 'Product', 'Data & Research', 'Sales & Marketing', 'IT'],
  datasets: [
    {
      label: 'role activity',
      backgroundColor: 'rgb(16, 135, 255)',
      borderColor: 'rgb(16, 135, 255)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(33, 115, 197)',
      hoverBorderColor: 'rgba(23, 86, 150)',
      data: [], // [65, 59, 80, 81, 56, 55, 40]
    },
  ],
};

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
  labels: [], // ['item 1', 'item 2', 'item 3', 'item 4', 'item 5'],
  datasets: [
    {
      label: 'user activity',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [], // [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};

export const dataPie = {
  labels: [], // ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      data: [], // [300, 50, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    },
  ],
};
