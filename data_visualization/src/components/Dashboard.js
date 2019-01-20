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
      eproducts: [],
      iproducts: []
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

      <div style={{marginLeft: '20%', marginRight:'20%'}}>
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
  data={this.state.eproducts}
  columns={ this.state.ethernet.columns }
  search
>
  {
    props => (

      <div style={{marginLeft: '20%', marginRight:'20%'}}>
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
}</div>
      );
    }
    }

    const mapStateToProps = store => ({
      currentTab: store.pageChange.currentTab
    });


    export default connect(mapStateToProps, null)(Dashboard);
