import React, {Component} from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import Widget from './Widget';
import Dashboard from './Dashboard';
import Header from './Header';
import {getFrequencyData} from './../compute/calc.js';
class Senddata extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      dt: []
    };
    this.autoUpdate = this.autoUpdate.bind(this);
    this.autoUpdate();
  }

  autoUpdate(){
    //connecting to ethernet branch of database
    const app = this.props.db.database().ref('/ethernet');
    //pulling data from the database
    app.on('value', snapshot => {
      var list = snapshot.val();
      var newList = []
      //console.log(list);
      //for loop to put into temp array
      for (let item in list){
        newList.push({
          DST_MAC: list[item].DST_MAC,
          SRC_MAC: list[item].SRC_MAC,
          ETH_PROTOCOL: list[item].ETH_PROTOCOL
        });
      }
      //console.log(newList);
      //saving data to local state
      this.setState({data: newList});
      var eth_count = getFrequencyData(newList, 'SRC_MAC');
      //console.log(getFrequencyData(newList, 'SRC_MAC'));
      this.setState({dt:[eth_count]});
      console.log(eth_count);
    });

    //console.log(this.state.date);
  }
  componentDidMount(){
      console.log(this.state.dt);
  }
  render(){

    return (
      <div>
        <Header/>

        <Widget type='Bar' title='Number of Unique Source MAC Addresses' /*data={this.state.dt}*/
        labels={['Ethernet', 'IP', 'TCP']}/>
        <Widget/>
        <Widget/>
        <Widget/>
        <Widget/>
        <Widget/>
      </div>
    )
  }
}

export default Senddata;
