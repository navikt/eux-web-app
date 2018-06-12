import React from 'react';
import PT from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';

import Forside from './sider/forside';
import Vedlegg from './sider/vedlegg';
import OpprettSak from './sider/opprettsak';

const Routing = ({ location }) => (
  <Switch location={location}>
    <Route exact path="/" component={Forside} />
    <Route exact path="/vedlegg" component={Vedlegg} />
    <Route exact path="/opprett" component={OpprettSak} />
  </Switch>
);

Routing.propTypes = {
  location: PT.object.isRequired,
};

export default withRouter(Routing);
