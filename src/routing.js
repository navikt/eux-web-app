import React from 'react';
import PT from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';

import Forside from './sider/forside';

const Routing = ({ location }) => (
  <Switch location={location}>
    <Route exact path="/" component={Forside} />
  </Switch>
);

Routing.propTypes = {
  location: PT.object.isRequired,
};

export default withRouter(Routing);
