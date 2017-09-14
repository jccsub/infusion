import React from 'react';
import FlatButton from 'material-ui/FlatButton';

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    //https://stackoverflow.com/a/36406525
    this.showLock= this.showLock.bind(this);
  }

  // ...
  showLock() {
    this.props.lock.show();
  }

  render() {
    if (!this.idToken) {
      return (
      <div className="login-box">        
        <a href="#" onClick={this.showLock}>Sign In</a>
        <FlatButton>Hello World</FlatButton>
      </div>);
    } else {
      return (
        <div className="login-box">
          Logged In!
        </div>);
        
    }
  }
}