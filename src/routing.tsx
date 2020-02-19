import React from 'react';
import PT from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';

import UkjentSide from './pages/ukjentSide';

import Pages from './pages';

const Routing = ({ location }: any) => (
  <Switch location={location}>
    <Route exact path="/" component={Pages.Forside} />
    <Route exact path="/vedlegg" component={Pages.Vedlegg} />
    <Route exact path="/opprett" component={Pages.OpprettSak} />
    <Route component={UkjentSide} />
  </Switch>
);

Routing.propTypes = {
  location: PT.object.isRequired,
};

export default withRouter(Routing);
