import React from "react";
import {NavLink} from "react-router-dom"
import "../Bootstrap/dist/css/bootstrap.css";
import "../css/SideNav.css";
var profilePicture = require("../res/blueprint_user_generic.png");

const SideNav = (props) => (
    <div>
        <div class="sidenav">
            <NavLink activeClassName="active" to="/profile">
                <div class="profile">
                    <img src={profilePicture} alt="Profile" width="120" style={{margin: 10 + "px"}}/>
                    <div>{props.firstname + " " + props.lastname}</div>
                </div>
            </NavLink>
            <hr/>
            <NavLink activeClassName="active" to="/projects"><span class="glyphicon glyphicon-folder-close"></span> Projects</NavLink>
            <NavLink activeClassName="active" to="/settings"><span class="glyphicon glyphicon-cog"></span> Settings</NavLink>
            <NavLink activeClassName="active" to="/login"><span class="glyphicon glyphicon-log-out"></span> Logout</NavLink>
            <hr/>
        </div>
        <div class="main">
            {props.children}
        </div>
    </div>
);

export default SideNav;