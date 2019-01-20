import React, {Component} from 'react';
import './css/Dashboard.css';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table.min.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import '../../node_modules/react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import {connect} from 'react-redux';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      ethernet: {
        columns: [
          {
            dataField: 'SRC_MAC',
            text: 'Source MAC'
          },
          {
            dataField: 'DST_MAC',
            text: 'Destination MAC'
          }, {
            dataField: 'ETH_PROTOCOL',
            text: 'Ethernet Protocol',

          },
          {
            dataField: 'TIMESTAMP',
            text: 'Timestamp'
          }
        ],

      },
      ip:
      {
        columns: [
          {
            dataField: 'CHECKSUM',
            text: 'Checksum'
          },
          {
            dataField: 'DST_ADDR',
            text: 'Destination Address'
          },
          {
            dataField: 'FRAG_OFFSET',
            text: 'Fragment Offset'
          },
          {
            dataField: 'IDENTIFICATION',
            text: 'Identification'
          },
          {
            dataField: 'PROTOCOL',
            text: 'Protocol'
          },
          {
            dataField: 'SRC_ADDR',
            text: 'Source Address'
          },
          {
            dataField: 'TIMESTAMP',
            text: 'Timestamp'
          },
          {
            dataField: 'TOS',
            text: 'Type of Service'
          },
          {
            dataField: 'TOTAL_LENGTH',
            text: 'Total Length'
          },
          {
            dataField: 'TTL',
            text: 'Time to Live'
          },
          {
            dataField: 'VERSION',
            text: 'Version'
          }
        ]
      },
      tcp:
      {
        columns:[
          {
            dataField: 'ACK_NUM',
            text: 'Acknowledgement Number'
          },
          {
            dataField: 'CHECKSUM',
            text: 'Checksum'
          },
          {
            dataField: 'DST_ADDR',
            text: 'Destination Address'
          },
          {
            dataField: 'OFFSET_RESERVED',
            text: 'Offset Reserved'
          },
          {
            dataField: 'SEQ_NUM',
            text: 'Sequence Number'
          },
          {
            dataField: 'SRC_PORT',
            text: 'Source Port'
          },
          {
            dataField: 'TCP_FLAG',
            text: 'TCP Flag'
          },
          {
            dataField: 'TIMESTAMP',
            text: 'Timestamp'
          },
          {
            dataField: 'URGENT_PTR',
            text: 'Urgent Pointer'
          },
          {
            dataField: 'WINDOW_SIZE',
            text: 'Windown Size'
          }
        ]
      },
      eproducts: [],
      iproducts: [],
      tproducts: []
    };
    const {SearchBar} = Search;
    this.changeE = this.changeE.bind(this);
    this.changeI = this.changeI.bind(this);
    this.changeT = this.changeT.bind(this);
  }

  changeE(e){
    e.preventDefault();
    this.props.dispatch({type: 'CHANGE_TAB', payload: 'Ethernet'});
  }

  changeI(e){
    e.preventDefault();
    this.props.dispatch({type: 'CHANGE_TAB', payload: 'IP'});
  }

  changeT(e){
    e.preventDefault();
    this.props.dispatch({type: 'CHANGE_TAB', payload: 'TCP'});
  }
  componentDidMount(){
    let app = this.props.db.database().ref('/ethernet');
    app.on('value', snapshot => {
      var val = snapshot.val();
      var buffer = [];

      for (let item in val) {
        buffer.push({
          DST_MAC:      val[item].DST_MAC,
          SRC_MAC:      val[item].SRC_MAC,
          ETH_PROTOCOL: val[item].ETH_PROTOCOL,
          TIMESTAMP:         val[item].TIMESTAMP,

        });
      }

      this.setState({eproducts: buffer});

  });


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
          TIMESTAMP:             val[item].TIMESTAMP
      });
    }
    this.setState({iproducts:buffer});
  });

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
    this.setState({tproducts:buffer});
  });

}

  render() {

    console.log(this.state.eproducts);
    const {SearchBar} = Search;
    const columns = [{
      dataField: 'id',
      text: 'Product ID'
    }, {
      dataField: 'name',
      text: 'Product Name'
    }, {
      dataField: 'price',
      text: 'Product Price'
    }];


    return (
<div>
{this.props.currentTab == 'Ethernet' &&
<ToolkitProvider
  keyField="id"
  data={this.state.eproducts}
  columns={ this.state.ethernet.columns }
  search
>
  {
    props => (

      <div style={{marginLeft: '5%', marginRight:'5%'}}>
        <h3 style={{float: 'left', fontWeight:'bold'}}>Ethernet</h3>
        <button style={{float: 'right', width: 80}} onClick= {this.changeE}>Ethernet</button>
        <button style={{float: 'right', width: 80}} onClick={this.changeI}>IP</button>
        <button style={{float: 'right', width: 80}} onClick={this.changeT}>TCP</button>
        <SearchBar { ...props.searchProps } />
        <hr />
        <BootstrapTable
          { ...props.baseProps }

        />
      </div>
    )
  }
</ToolkitProvider>
||

this.props.currentTab == 'IP' &&
<ToolkitProvider
  keyField="id"
  data={this.state.iproducts}
  columns={ this.state.ip.columns }
  search
>
  {
    props => (

      <div style={{marginLeft: '5%', marginRight:'5%'}}>
        <h3 style={{float: 'left', fontWeight:'bold'}}>IP</h3>
        <button style={{float: 'right', width: 80}} onClick= {this.changeE}>Ethernet</button>
        <button style={{float: 'right', width: 80}} onClick={this.changeI}>IP</button>
        <button style={{float: 'right', width: 80}} onClick={this.changeT}>TCP</button>
        <SearchBar { ...props.searchProps } />
        <hr />
        <BootstrapTable
          { ...props.baseProps }

        />
      </div>
    )
  }
</ToolkitProvider>
||

this.props.currentTab == 'TCP' &&
<ToolkitProvider
  keyField="id"
  data={this.state.tproducts}
  columns={ this.state.tcp.columns }
  search
>
  {
    props => (

      <div style={{marginLeft: '5%', marginRight:'5%'}}>
        <h3 style={{float: 'left', fontWeight:'bold'}}>TCP</h3>
        <button style={{float: 'right', width: 80}} onClick= {this.changeE}>Ethernet</button>
        <button style={{float: 'right', width: 80}} onClick={this.changeI}>IP</button>
        <button style={{float: 'right', width: 80}} onClick={this.changeT}>TCP</button>
        <SearchBar { ...props.searchProps } />
        <hr />
        <BootstrapTable
          { ...props.baseProps }

        />
      </div>
    )
  }
</ToolkitProvider>

}</div>
      );
    }
    }

    const mapStateToProps = store => ({
      currentTab: store.pageChange.currentTab
    });


    export default connect(mapStateToProps, null)(Dashboard);
