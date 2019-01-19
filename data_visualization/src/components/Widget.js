import React, {Component} from 'react';
import './css/Widget.css';
import {Bar, Line} from 'react-chartjs-2';


class Widget extends Component{

  constructor(props){
    super(props);
  }
  render(){
    //using a temporary empty object for the charts data.

    var dat = {}
    //checking to see what type of graph we need to execute.
    switch(this.props.type){
      case 'Bar':
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
                 break;
      case 'Line':
                  dat = {
                   chartData: {
                     labels: this.props.labels,
                     datasets: [{
                       label: this.props.title,
                       data: this.props.data,
                       backgroundColor:[
                         'rgb(205, 94, 94)'
                       ]
                     }]

                   }
                 }
                 break;
      default:
                break;
    }
    /*if(this.props.type == 'Bar'){
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
    }*/

    return(
      <div class='outershell'>
        { this.props.type == 'Bar' &&
        <Bar data={dat.chartData} options={{
          maintainAspectRatio: false,
          title:{
            display: true,
            text: this.props.title,
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
      {this.props.type == 'Line' &&
        <Line data={dat.chartData} options={{
          maintainAspectRatio: false,
          title:{
            display: true,
            text: this.props.title,
            fontSize: 25
          },
          legend:{
            display: false
          }
        }}/>
      }
      </div>
    );
  }
}

export default Widget;
