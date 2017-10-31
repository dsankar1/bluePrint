import React from "react";

const SideNav = (props) => (
    <div>
        <div class="sidenav">
            <li class="nav-item"><a class="nav-link"><i class="fa fa-user-circle fa-lg" aria-hidden="true"></i></a></li>
            <a href="index.html active">Home</a>
            <a href="#">Projects</a>
        </div>
        <div class="main">
            <h2>Home page</h2>
            <p>This sidenav is always shown.</p>
        </div>
        <div>
            {props.children}
        </div>
    </div>
);

export default SideNav;