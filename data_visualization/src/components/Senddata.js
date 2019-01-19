import React, {Component} from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import Widget from './Widget';
import Dashboard from './Dashboard';
import Header from './Header';
import { getFrequencyData, sortDataByProp, filterData } from "./../data/data.js";
class Senddata extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:[]
    };
    this.refreshHandler = this.refreshHandler.bind(this);
    //console.log(props);
    /*var dab = this.props.db.database().ref('ip');
    dab.push({

        VERSION: '1',
        TOS: '1',
        TOTAL_LENGTH: '1',
        IDENTIFICATION: '1',
        FRAG_OFFSET: '1',
        TTL: '2',
        PROTOCOL: '1',
        CHECKSUM: '1',
        SRC_ADDR: '1',
        DST_ADDR: '1',
        TIME: '2'
    });
    dab = this.props.db.database().ref('tcp');
    dab.push({

      SRC_PORT: '1',
      DST_PORT: '1',
      SEQ_NUM: '1',
      ACK_NUM: '1',
      OFFSET_RESERVED: '1',
      TCP_FLAG: '2',
      WINDOW_SIZE: '1',
      CHECKSUM: '1',
      URGENT_PTR: '1'

    });*/
  }

  refreshHandler(){
    console.log(this.state.data);
  }
  componentDidMount(){
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
      console.log(getFrequencyData(newList, "DST_MAC"));
      this.setState({data: newList});
    });

    //console.log(this.state.date);
  }
  render(){

    return (
      <div>
        <Header/>
        <Dashboard/>
        <Widget/>
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
