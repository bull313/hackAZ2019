import React, {Component} from 'react';
import './css/Widget.css';
import {Bar} from 'react-chartjs-2';

class Widget extends Component{

  constructor(props){
    super(props);
    if(this.props.type == 'Bar'){
      this.state = {
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
  }
  render(){
    return(
      <div class='outershell'>
        {this.props.type == 'Bar' &&
        <Bar data={this.state.chartData} options={{
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
                        max : 100,
                        min : 50
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
