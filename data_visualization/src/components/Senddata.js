import React, {Component} from 'react';
import Button from 'react-bootstrap/lib/Button';
import 'react-widgets/dist/css/react-widgets.css';
import DropdownList from 'react-widgets/lib/DropdownList';
import Widget from './Widget';

class Senddata extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:[]
    };
    this.refreshHandler = this.refreshHandler.bind(this);
    //console.log(props);
  }

  refreshHandler(){
    console.log(this.state.data);
  }
  componentDidMount(){
    const app = this.props.db.database().ref('/messages');
    app.on('value', snapshot => {
      var list = snapshot.val();
      var newList = []
      //console.log(list);
      for (let item in list){
        newList.push({
          src: list[item].message.src,
          dest: list[item].message.dest,
          Eth: list[item].message.Eth
        });
      }
      //console.log(newList);
      this.setState({data: newList});
    });

    //console.log(this.state.date);
  }
  render(){

    return (
      <div>
        MessageList Component
        <Button style={{display: 'block'}} bsSize="large" onClick={this.refreshHandler}>
          Print Data
        </Button >
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
