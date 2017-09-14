import React from 'react';

export default class LoggedIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: null
    };    
  }

  componentDidMount() {
    // The token is passed down from the App component 
    // and used to retrieve the profile
    this.props.lock.getProfile(this.props.idToken, function (err, profile) {
      if (err) {
        console.log("Error loading the Profile", err);
        return;
      }
      this.setState({profile: profile});
    }.bind(this));
  }

  render() {
    if (this.state.profile) {
      return (
        <div>
        <img src={this.state.profile.picture} />
        <h2>Welcome {this.state.profile.nickname}</h2>
        </div>
      );
    } else {
      return (
        <div className="loading">Loading profile</div>
      );
    }
  }
};
