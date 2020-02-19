import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import NEESSILogo from 'resources/images/nEESSI';
import './Header.css';
import * as MPT from '../../proptypes/';

import { saksbehandlerSelectors } from '../../ducks/saksbehandler/';

const Header = (props: any) => {
  const { saksbehandler: { navn } } = props;
  console.log('werweewr')
  return (
    <header className="topplinje">
      <div className="topplinje__brand">
        <Link to="/">
          <NEESSILogo/>
        </Link>
        <div className="brand__skillelinje" />
        <div className="brand__tittel"><span>{process.env.REACT_APP_NAME}</span></div>
      </div>
      <div className="topplinje__saksbehandler">
        <div className="saksbehandler__navn">{navn}</div>
      </div>
    </header>
  );
};

Header.propTypes = {
  saksbehandler: MPT.Saksbehandler.isRequired,
};

const mapStateToProps = (state: any) => ({
  saksbehandler: saksbehandlerSelectors.SaksbehandlerSelector(state),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
