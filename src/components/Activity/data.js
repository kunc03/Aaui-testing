export const dataBar = {
    labels: ['Director Office', 'Product', 'Data & Research', 'Sales & Marketing', 'IT'],
    datasets: [
      {
        label: '6 Role',
        backgroundColor: 'rgb(16, 135, 255)',
        borderColor: 'rgb(16, 135, 255)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(33, 115, 197)',
        hoverBorderColor: 'rgba(23, 86, 150)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

 export const dataSpeaker = {
    labels: ['User A', 'User B', 'User C', 'User D', 'User E', 'User F', 'Other User', 'Item B'],
    datasets: [
      {
        label: 'User B talks the most ',
        backgroundColor: 'rgb(16, 135, 255)',
        borderColor: 'rgb(16, 135, 255)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(33, 115, 197)',
        hoverBorderColor: 'rgba(23, 86, 150)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

 export const dataUser = {
    labels: ['item 1', 'item 2', 'item 3', 'item 4', 'item 5'],
    datasets: [
      {
        label: '6 +10% vs previous period',
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
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

  export const dataPie = {
	labels: [
		'Red',
		'Blue',
		'Yellow'
	],
	datasets: [{
		data: [300, 50, 100],
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		]
	}]
};