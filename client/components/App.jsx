import React from 'react';
import Home from './Home.jsx'
import LoggedIn from './LoggedIn.jsx'

/*
export default class App extends React.Component {
  render() {
    return (
     <div style={{textAlign: 'center'}}>
        <h1>Hello World</h1>
      </div>);
  }
}
*/


export default class App extends React.Component {  
  componentWillMount() {
    this.lock = new Auth0Lock('S6sQrCTLielOrel4tOHFFOYV8hYm1L8N', 'jccsub.auth0.com');
    // Set the state with a property that has the token
    this.setState({idToken: this.getIdToken()})    
  }  

  createLock() {
    this.lock = new Auth0Lock(this.props.clientId, this.props.domain);    
  }

  getIdToken() {
    // First, check if there is already a JWT in local storage
    var idToken = localStorage.getItem('id_token');
    var authHash = this.lock.parseHash(window.location.hash);
    // If there is no JWT in local storage and there is one in the URL hash,
    // save it in local storage
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token
        localStorage.setItem('id_token', authHash.id_token);
      }
      if (authHash.error) {
        // Handle any error conditions
        console.log("Error signing in", authHash);
      }
    }
    return idToken;
  }  

  render() {
    if (this.state.idToken) {
      //return (<LoggedIn lock={this.lock} idToken={this.state.idToken} />);
      return (<Home lock={this.lock} idToken={this.state.idToken}/>);
    } else {
      return (<Home lock={this.lock} />);
    }
  }

}
