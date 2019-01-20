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
                  //console.log(this.props.data);
                  //console.log(this.props.labels[0]);
                  let newData = [0];
                  let graphData =[0];
                  var hours = this.props.labels[0] % 3600;
                  var minutes = (this.props.labels[0] % 3600) / 60;
                  var seconds = this.props.labels[0] %60;
                  hours = hours % 24;
                  let time = hours + ' ' + minutes + ' ' + seconds;
                  console.log(hours);
                  //newData.push(this.props.labels[1] - this.props.labels[0]);
                  console.log(newData);
                  for(let i = 1; i < this.props.labels.length; i++){
                    newData.push(this.props.labels[i] - this.props.labels[i-1])
                  }
                  console.log(newData);
                  for(let i = 1; i < newData.length; i++){
                    graphData.push(newData[i] + graphData[i-1]);
                  }
                  dat = {
                   chartData: {
                     labels: graphData,
                     datasets: [{
                       label: this.props.title,
                       data: this.props.data,
                       backgroundColor:[
                         'rgb(205, 94, 94)'
                       ],
                       pointBackgroundColor: 'rgb(0, 195, 121)'
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
          },
          scales: {
                yAxes : [{
                    ticks : {
                        suggestedMax : 10,
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
