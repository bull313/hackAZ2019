import React, {Component} from 'react';
import './css/Widget.css';
import {Bar} from 'react-chartjs-2';

/* Class Widget is going to be the boxed areas for each graph.*/
class Widget extends Component{

//Need to call super(props) to get values passed in from Senddata.js
  constructor(props){
    super(props);
  }
<<<<<<< HEAD
  render(){
    //using a temporary empty object for the charts data.
    var dat = {}
    //checking to see what type of graph we need to execute.
    if(this.props.type == 'Bar'){
=======

  render() {
    var dat = {};

    if(this.props.type == 'Bar') {
>>>>>>> f194d082bc72566791fd66941f476ba074139790
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
<<<<<<< HEAD
    
    return(
=======

    return (
>>>>>>> f194d082bc72566791fd66941f476ba074139790
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
