import React from 'react';
import {Redirect, Route,Switch} from 'react-router-dom';
import View from '../demo/view'
import Welcome from '../pages/login/welcome'
import Container from '../container/'
import ShowPicture from '../components/showpicture'
class BasicRoute extends React.Component
{
    render()
    {
        const BasicRoute=(
          <main>
          {console.log(localStorage.getItem('auth'))}
                <Switch>
                    <Route  path="/" component={Container}/>
                    {/* <Route  exact path="/" component={Welcome}/> */}
                    {/* <PrivateRoute   path="/yunstore" component={Container}/> */}
                    <Route exact path="/logout" component={Welcome}/>
                   

                    <Route component={()=>{return <h1>404</h1>}}/>
                </Switch>
                </main>
        );
        return BasicRoute;
    }
}


function PrivateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          localStorage.getItem('auth') ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
export default BasicRoute;