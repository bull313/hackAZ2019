import React, {Component} from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import Widget from './Widget';
import Dashboard from './Dashboard';
import Header from './Header';
import { getFrequencyData, sortDataByProp, filterData } from './../data/data.js';

/*
  Handles receiving data from Firebase
*/
class Senddata extends Component {

  /* Construct the state object to hold fetched data */
  constructor(props) {
    super(props);

    this.state = {
      uniqueMACAddresses: {
        ethernet: 0,
        ip: 0,
        tcp: 0
      },

      ipAddresses: {},
      tcpPorts: {},
      
    };
  }

  componentDidMount() {
    let app = null; /* Firebase data fetch reference */

    /* Get the ethernet data */
    app = this.props.db.database().ref('/ethernet');
    app.on('value', snapshot => {
      var val = snapshot.val(); /* Holds the newly fetched data   */
      var buffer = [];          /* Holds the data to put in state */

      for (let item in val) {
        buffer.push({
          DST_MAC: val[item].DST_MAC,
          SRC_MAC: val[item].SRC_MAC,
          ETH_PROTOCOL: val[item].ETH_PROTOCOL
        });
      }

      let freqTable = getFrequencyData(buffer, "SRC_MAC");
      let uniqueAddresses = [];
      for (let addr in freqTable) {
        uniqueAddresses.push(addr);
      }

      let uniqueMACAddresses = { ...this.state.uniqueMACAddresses };
      uniqueMACAddresses.ethernet = uniqueAddresses.length;
      this.setState({ uniqueMACAddresses });
    });

    /* Get the ip data */
    app = this.props.db.database().ref('/ip');
    app.on('value', snapshot => {
      var val = snapshot.val(); /* Holds the newly fetched data   */
      var buffer = [];          /* Holds the data to put in state */

      for (let item in val) {
        buffer.push({
            VERSION:          val[item].VERSION,
            TOS:              val[item].TOS,
            TOTAL_LENGTH:     val[item].TOTAL_LENGTH,
            IDENTIFICATION:   val[item].IDENTIFICATION,
            FRAG_OFFSET:      val[item].FRAG_OFFSET,
            TTL:              val[item].TTL,
            PROTOCOL:         val[item].PROTOCOL,
            CHECKSUM:         val[item].CHECKSUM,
            SRC_ADDR:         val[item].SRC_ADDR,
            DST_ADDR:         val[item].DST_ADDR,
            TIME:             val[item].TIME
        });
      }

      let freqTable = getFrequencyData(buffer, "SRC_ADDR");

      let uniqueAddresses = [];
      for (let addr in freqTable) {
        uniqueAddresses.push(addr);
      }

      let uniqueMACAddresses = { ...this.state.uniqueMACAddresses };
      uniqueMACAddresses.ip = uniqueAddresses.length;
      this.setState({ uniqueMACAddresses });

      let ipAddresses = { ...this.state.ipAddresses };
      for (let addr in freqTable) {
        ipAddresses[addr] = freqTable[addr];
      }
      this.setState({ ipAddresses });
    });

    /* Get the tcp data */
    app = this.props.db.database().ref('/tcp');
    app.on('value', snapshot => {
      var val = snapshot.val(); /* Holds the newly fetched data   */
      var buffer = [];          /* Holds the data to put in state */

      for (let item in val) {
        buffer.push({
          SRC_PORT:         val[item].SRC_PORT,
          DIST_PORT:        val[item].DIST_PORT,
          SEQ_NUM:          val[item].SEQ_NUM,
          ACK_NUM:          val[item].ACK_NUM,
          OFFSET_RESERVED:  val[item].OFFSET_RESERVED,
          TCP_FLAG:         val[item].TCP_FLAG,
          WINDOW_SIZE:      val[item].WINDOW_SIZE,
          CHECKSUM:         val[item].CHECKSUM,
          URGENT_PTR:       val[item].URGENT_PTR,
        });
      }

      let freqTable = getFrequencyData(buffer, "SRC_PORT");
      let uniqueAddresses = [];
      for (let addr in freqTable) {
        uniqueAddresses.push(addr);
      }

      let uniqueMACAddresses = { ...this.state.uniqueMACAddresses };
      uniqueMACAddresses.tcp = uniqueAddresses.length;
      this.setState({ uniqueMACAddresses });

      let tcpPorts = { ...this.state.tcpPorts };
      for (let addr in freqTable) {
        tcpPorts[addr] = freqTable[addr];
      }
      this.setState({ tcpPorts });
    });
  }

  componentDidUpdate(){
    console.log("Senddata did update");
    console.log(this.state);
  }

  /* Render the UI components */
  render(){
    return (
      <div>
        <Header/>

        <Widget type='Bar' title='Number of Unique Source MAC Addresses'
        labels={Object.keys(this.state.uniqueMACAddresses)} data={Object.values(this.state.uniqueMACAddresses)} />

        <Widget type='Bar' title='IP Addresses and Their Frequencies'
        labels={Object.keys(this.state.ipAddresses)} data={Object.values(this.state.ipAddresses)} />

        <Widget type='Bar' title='TCP Port and Their Frequencies'
        labels={Object.keys(this.state.tcpPorts)} data={Object.values(this.state.tcpPorts)} />

        <Widget type='Line' title='Network Usage'
        labels={Object.keys(this.state.tcpPorts)} data={Object.values(this.state.tcpPorts)} />
      </div>
    )
  }
}

export default Senddata;
