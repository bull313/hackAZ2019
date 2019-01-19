import React, {Component} from 'react';

class Senddata extends Component {
  constructor(props){
    super(props);
    this.state = {
      message: ''
    };
    console.log(props);
    const dab = this.props.db.database().ref('/messages');
    dab.push({
      message: 'suck it'
    });
  }

  componentDidMount(){
    const app = this.props.db.database().ref('/messages');
    app.on('value', snapshot => {console.log(snapshot.val())});
  }
  render(){
    return (
      <div>
        MessageList Component
      </div>
    )
  }
}

export default Senddata;
