// react
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
// components
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import SideNav from "./components/SideNav";
import PrivateRoute from "./components/PrivateRoute";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        valid: false
      }
    }
    this.updateUser = this.updateUser.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
  }

  updateUser(user) {
    this.setState({user: {
      valid: false,
      ...user
    }});
  }

  isLoggedIn() {
    return this.state.user.valid;
  }

  render() {
    console.log(this.state);
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" render={() => (
              this.isLoggedIn() ? (<Redirect to="/landing" />) : <LoginPage updateToken={this.updateUser} />
            )} />

            <PrivateRoute path="/landing" component={LandingPage} user={this.state.user}/>

            <Route render={() => (<div>Page Not Found</div>)} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
