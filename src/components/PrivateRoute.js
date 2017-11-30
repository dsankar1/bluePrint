import React from "react";
import {Route, Redirect} from "react-router-dom";

function PrivateRoute({ component: Component, user, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => user.valid
                ? <Component user={user} {...props} />
                : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />}
        />
    )
}

export default PrivateRoute;