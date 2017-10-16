import React from 'react';
import axios from 'axios';
import firebase from 'firebase';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.userFirstName,
      lastName: this.props.userLastName,
      email: this.props.userEmail,
      password1: '',
      password2: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword1 = this.onChangePassword1.bind(this);
    this.onChangePassword2 = this.onChangePassword2.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  onChangeFirstName(e) {
    this.setState({ firstName: e.target.value });
  }
  onChangeLastName(e) {
    this.setState({ lastName: e.target.value });
  }
  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  onChangePassword1(e) {
    this.setState({ password1: e.target.value });
  }
  onChangePassword2(e) {
    this.setState({ password2: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.updateUser;
    this.setState({
      firstName: form.firstName.value || this.state.firstName,
      lastName: form.lastName.value || this.state.lastName,
      email: form.email.value || this.state.email,
    }, () => this.updateUser());
    // clear the form for the next input
    form.firstName.value = '';
    form.lastName.value = '';
    form.email.value = '';
  }
  updateUser() {
    firebase.auth().currentUser.updateEmail(this.state.email)
      .then(win => console.log('Firebase updated', win))
      .catch(err => alert(err));
    axios.put('api/updateUser/', {
      userId: this.props.userId,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
    })
      .then((data) => {
        console.log('User has been updated!');
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handlePasswordSubmit(e) {
    e.preventDefault();
    if (this.state.password1 === this.state.password2) {
      this.updatePassword();
    } else alert('Passwords do not match');
  }
  updatePassword() {
    firebase.auth().currentUser.updatePassword(this.state.password1)
      .then(win => console.log('Password Updated', win))
      .catch(err => alert(err));
  }
  render() {
    const userName = `${this.props.userFirstName} ${this.props.userLastName}`;
    return (
      <div className="user-profile">
        <h3>Hello, {userName}!</h3>
        <br />
        <strong>Update Your Info:</strong><br />
        <form name="updateUser" onSubmit={this.handleSubmit}>
          <label htmlFor="firstName">
            First Name:
            <input type="text" name="firstName" placeholder={this.state.firstName} onChange={this.onChangeFirstName} />
          </label>
          <br />
          <label htmlFor="firstName">
            Last Name:
            <input type="text" name="lastName" placeholder={this.state.lastName} onChange={this.onChangeLastName} />
          </label>
          <br />
          <label htmlFor="email">
            Email:
            <input type="text" name="email" placeholder={this.state.email} onChange={this.onChangeEmail} />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <br />
        <b>Change Password</b>
        <form name="changePassword" onSubmit={this.handlePasswordSubmit}>
          New Password:
          <input type="password" placeholder="********" onChange={this.onChangePassword1} />
          <br />
          Verify Password:
          <input type="password" placeholder="********" onChange={this.onChangePassword2} />
          <br />
          <input type="submit" value="Change Password" />
        </form>
      </div>
    );
  }
}

export default Profile;