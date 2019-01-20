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
      /* Store the unique source MAC addresses from each object type */
      uniqueMACAddresses: {
        ethernet: 0,
        ip: 0,
        tcp: 0
      },

      ipAddresses: {},  /* Store all unique IP source addresses and the number of occurences  */
      tcpPorts: {},     /* Store all unique TCP source addresses and the number of occurences */

      /* Store each object in order by time (for each object type) */
      dataChronological: {}
    };
  }

  componentDidMount() {
    let app = null; /* Firebase data fetch reference */

    /* Create a blank chronological dates object */
    const ELAPSED_SECONDS = 420; /* Get packets since the last X seconds */
    const INTERVAL = 1; /* Interval to count packets at */
    let currentDate = new Date();
    let pastDate = new Date();
    pastDate.setSeconds(currentDate.getSeconds() - ELAPSED_SECONDS);

    let dataChronological = { ...this.state.dataChronological };
    for (let i = INTERVAL; i < INTERVAL * ELAPSED_SECONDS; ++i)
      dataChronological[i] = 0;

    this.setState({ dataChronological });

    /* Get the ethernet data */
    app = this.props.db.database().ref('/ethernet');
    app.on('value', snapshot => {
      var val = snapshot.val(); /* Holds the newly fetched data   */
      var buffer = [];          /* Holds the data to put in state */

      for (let item in val) {
        buffer.push({
          DST_MAC:      val[item].DST_MAC,
          SRC_MAC:      val[item].SRC_MAC,
          ETH_PROTOCOL: val[item].ETH_PROTOCOL,
          TIME:         val[item].TIMESTAMP
        });
      }

      /* Get all source addresses and their frequencies */
      let freqTable = getFrequencyData(buffer, "SRC_MAC");

      /* Store the number of addresses in each state */
      let uniqueMACAddresses = { ...this.state.uniqueMACAddresses };
      uniqueMACAddresses.ethernet = Object.keys(freqTable).length;
      this.setState({ uniqueMACAddresses });

      /* Sort the ethernet objects by time */
      let sortedData = sortDataByProp(buffer, (a, b) => { return a.TIME - b.TIME });

      /* Get the number of packets at each timestamp */
      let dataChronological = { ...this.state.dataChronological };

      let timestamps = [];
      for (let item in sortedData) {
        timestamps.push(Math.abs(parseFloat(sortedData[item].TIME) - (pastDate.getTime() / 1000)));
      }

      for (let i = 0; i < timestamps.length; ++i) {
        if (timestamps[i] < 0 || timestamps[i] > INTERVAL * ELAPSED_SECONDS) continue;

        if (timestamps[i] % INTERVAL == 0) {
          let idx = timestamps[i] / INTERVAL;
          if (!dataChronological[idx])
            dataChronological[idx] = 0;
          ++dataChronological[idx];
        }
        else {
          let idx = Math.floor(timestamps[i] / INTERVAL) + 1;
          if (!dataChronological[idx])
            dataChronological[idx] = 0;
          ++dataChronological[idx];
        }
      }

      /* Store the packet counts into state */
      this.setState({ dataChronological });
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
            TIME:             val[item].TIMESTAMP
        });
      }

      /* Get all source addresses and their frequencies */
      let freqTable = getFrequencyData(buffer, "SRC_ADDR");

      /* Store the number of addresses in each state */
      let uniqueMACAddresses = { ...this.state.uniqueMACAddresses };
      uniqueMACAddresses.ip = Object.keys(freqTable).length;
      this.setState({ uniqueMACAddresses });

      /* Copy frequency table data into the state */
      let ipAddresses = { ...this.state.ipAddresses };
      for (let addr in freqTable) {
        ipAddresses[addr] = freqTable[addr];
      }
      this.setState({ ipAddresses });

      /* Sort the IP objects by time */
      let sortedData = sortDataByProp(buffer, (a, b) => { return a.TIME - b.TIME });

      /* Get the number of packets at each timestamp */
      let dataChronological = { ...this.state.dataChronological };

      let timestamps = [];
      for (let item in sortedData) timestamps.push(parseFloat(sortedData[item].TIME));

      for (let i = 0; i < timestamps.length; ++i) {
        if (timestamps[i] < 0 || timestamps[i] > INTERVAL * ELAPSED_SECONDS) continue;

        if (timestamps[i] % INTERVAL == 0) {
          let idx = timestamps[i] / INTERVAL;
          if (!dataChronological[idx])
            dataChronological[idx] = 0;
          ++dataChronological[idx];
        }
        else {
          let idx = Math.floor(timestamps[i] / INTERVAL) + 1;
          if (!dataChronological[idx])
            dataChronological[idx] = 0;
          ++dataChronological[idx];
        }
      }

      /* Store the packet counts into state */
      this.setState({ dataChronological });
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
          TIME:             val[item].TIMESTAMP
        });
      }

      /* Get all source addresses and their frequencies */
      let freqTable = getFrequencyData(buffer, "SRC_PORT");

      /* Store the number of addresses in each state */
      let uniqueMACAddresses = { ...this.state.uniqueMACAddresses };
      uniqueMACAddresses.tcp = Object.keys(freqTable).length;
      this.setState({ uniqueMACAddresses });

      /* Copy frequency table data into the state */
      let tcpPorts = { ...this.state.tcpPorts };
      for (let addr in freqTable) {
        tcpPorts[addr] = freqTable[addr];
      }
      this.setState({ tcpPorts });

      /* Sort the TCP objects by time */
      let sortedData = sortDataByProp(buffer, (a, b) => { return a.TIME - b.TIME });

      /* Get the number of packets at each timestamp */
      let dataChronological = { ...this.state.dataChronological };

      let timestamps = [];
      for (let item in sortedData) timestamps.push(parseFloat(sortedData[item].TIME));

      for (let i = 0; i < timestamps.length; ++i) {
        if (timestamps[i] < 0 || timestamps[i] > INTERVAL * ELAPSED_SECONDS) continue;

        if (timestamps[i] % INTERVAL == 0) {
          let idx = timestamps[i] / INTERVAL;
          if (!dataChronological[idx])
            dataChronological[idx] = 0;
          ++dataChronological[idx];
        }
        else {
          let idx = Math.floor(timestamps[i] / INTERVAL) + 1;
          if (!dataChronological[idx])
            dataChronological[idx] = 0;
          ++dataChronological[idx];
        }

      }

      /* Store the packet counts into state */
      this.setState({ dataChronological });
    });
  }

  componentDidUpdate(){
    console.log(this.state);
  }

  /* Render the UI components */
  render(){
    return (
      <div>

        <Widget type='Bar' title='Number of Unique Source MAC Addresses'
        labels={Object.keys(this.state.uniqueMACAddresses)} data={Object.values(this.state.uniqueMACAddresses)} />

        <Widget type='Bar' title='IP Addresses and Their Frequencies'
        labels={Object.keys(this.state.ipAddresses)} data={Object.values(this.state.ipAddresses)} />

        <Widget type='Bar' title='TCP Port and Their Frequencies'
        labels={Object.keys(this.state.tcpPorts)} data={Object.values(this.state.tcpPorts)} />

        <Widget type='Line' title='Packet Occurences by Time Frame'
        labels={Object.keys(this.state.dataChronological)} data={Object.values(this.state.dataChronological)} />

      </div>
    )
  }
}

export default Senddata;
