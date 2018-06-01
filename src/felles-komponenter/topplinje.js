import React from 'react';
import { Link } from 'react-router-dom';

import * as navLogo from '../resources/images/nav.svg';

import './topplinje.css';

function Topplinje() {
  return (
    <header className="topplinje">
      <div className="topplinje__brand">
        <Link to="/" alt="NAV, lenke hovedsiden">
          <img
            className="brand__logo"
            src={navLogo}
            alt="To personer på NAV kontor"
          />
        </Link>
        <div className="brand__skillelinje" />
        <div className="brand__tittel"><span>EUX</span></div>
      </div>
      <div className="topplinje__saksbehandler">
        <div className="saksbehandler__navn">TODO Navn</div>
      </div>
    </header>
  );
}

export default Topplinje;
