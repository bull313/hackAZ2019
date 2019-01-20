import React, {Component} from 'react';
import './css/Header.css';
import changePage from '../containers/changePage';
import {connect} from 'react-redux';
import logo from './images/Sniphy.png';

class Header extends Component {

  constructor(props){
    super(props);
    this.changeHome = this.changeHome.bind(this);
    this.changeDash = this.changeDash.bind(this);
    //console.log(this.props.store);
  }

  changeHome(e){
    e.preventDefault();
    this.props.dispatch({type: 'CHANGE_PAGE', payload:'Home'});

  }

  changeDash(e){
    e.preventDefault();
    this.props.dispatch({type:'CHANGE_PAGE', payload: 'View'});

  console.log(this.props.page.page);
  }
  render(){

    return(
      <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" id='brand' onClick={this.changeHome} style={{color:'white'}}><img src={logo} style={{width: 100, height: 25}}/></a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" onClick={this.changeHome} style={{color:'white'}}>Home<span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/" onClick={this.changeDash} style={{color:'white'}}>View Packets</a>
            </li>
            </ul>
        </div>
      </nav>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  page: store.pageChange
});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
