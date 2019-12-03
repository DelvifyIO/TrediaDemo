import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from '../routes';

class DefaultLayout extends Component {

    render() {
        return (
            <div className="app">
                <div className="app-body">
                    <main className="main">
                        <Switch>
                            {routes.map((route, idx) => {
                                return route.component ? (
                                    <Route
                                        key={idx}
                                        path={route.path}
                                        exact={route.exact}
                                        name={route.name}
                                        render={props => (
                                            <route.component {...props} />
                                        )} />
                                ) : (null);
                            })}
                            <Redirect from="/" to="/" />
                        </Switch>
                    </main>
                </div>
            </div>
        );
    }
}

export default DefaultLayout;
