// react
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// bootstrap
import "./Bootstrap/dist/css/bootstrap.min.css";
import "./Bootstrap/dist/js/bootstrap.min.js";

// components
import Login from "./components/Login";
import Nav from "./components/Nav";
import Projects from "./components/Projects";
import ProjectDetails from "./components/ProjectDetails";
import NotFound from "./components/NotFound";
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
    return (
        <div>
          <Switch>
            <Route exact path="/login" render={ () => (this.isLoggedIn() ? (<Redirect to="/projects" />) : <Login updateUser={ this.updateUser } />) } />
            <Nav firstname={ this.state.user.firstname } lastname={ this.state.user.lastname } updateUser={ this.updateUser }>
              <Switch>
                <PrivateRoute exact path="/projects" component={ Projects } user={ this.state.user }/>
                <PrivateRoute exact path="/projects/:id" component={ ProjectDetails } user={ this.state.user }/>
                <PrivateRoute component={ NotFound } user={ this.state.user }/>
              </Switch>
            </Nav>
          </Switch>
        </div>
    );
  }
}

export default App;
