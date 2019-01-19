import React, {Component} from 'react';
import './css/Widget.css';
import {Bar} from 'react-chartjs-2';

class Widget extends Component{

  constructor(props){
    super(props);
  }

  render() {
    var dat = {};

    if(this.props.type == 'Bar') {
       dat = {
        chartData: {
          labels: this.props.labels,
          datasets: [{
            label: this.props.title,
            data: this.props.data,
            backgroundColor:[
              'rgb(205, 94, 94)',
              'rgb(71, 162, 195)',
              'rgb(71, 195, 121)'
            ]
          }]

        }
      }
    }

    return (
      <div class='outershell'>
        {this.props.type == 'Bar' &&
        <Bar data={dat.chartData} options={{
          maintainAspectRatio: false,
          title:{
            display: true,
            text: 'Number of Unique Source MAC Addresses',
            fontSize: 25
          },
          legend:{
            display: false
          },
          scales: {
                yAxes : [{
                    ticks : {
                        suggestedMax : 5,
                        suggestedMin : 0
                    }
                }]
            }
        }}/>
      }
      </div>
    );
  }
}

export default Widget;
