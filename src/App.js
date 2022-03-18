import React, {  useState } from "react";

import {
  Route,
  Switch,
  Redirect,
  BrowserRouter
} from "react-router-dom";



import AdminLayout from "layouts/Admin.js";
import LoginLayout from "layouts/Login.js";

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

        const setAuth = boolean => {
            setIsAuthenticated(boolean);
        };

        return (
            <BrowserRouter>
                <Switch>
                    <Switch>
                        <Route path="/" exact render={
                            (props) => 
                            !isAuthenticated ?
                            (
                                <LoginLayout {...props} setAuth={setAuth} />
                            ) :
                            (
                                <Redirect to="/admin" />
                            )} 
                        />

                        <Route path="/admin" render={
                            (props) => isAuthenticated ? 
                            ( <AdminLayout {...props} setAuth={setAuth} />) : 
                            (
                                <Redirect to="/" />
                            )
                            } />
                    </Switch>
                </Switch>
            </BrowserRouter>
        );
}

export default App;