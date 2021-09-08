import { BrowserRouter, Switch, Route } from "react-router-dom";

import routes from "./";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map(({ component: Component, ...route }) => (
          <Route
            exact
            key={route.path}
            {...route}
            render={props => {
              return <Component {...props} />;
            }}
          />
        ))}
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
