// react
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
// components
import LoginPage from "./components/LoginPage";
import ProjectsPage from "./components/ProjectsPage";
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
            <Route path="/login" render={() => (
              this.isLoggedIn() ? (<Redirect to="/projects" />) : <LoginPage updateToken={this.updateUser} />
            )} />
            <Route path="/" render={() => (<SideNav user={this.state.user}/>)}>
              <PrivateRoute path="projects" component={ProjectsPage} user={this.state.user}/>
              <Route render={() => (<div>Page Not Found</div>)} />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
