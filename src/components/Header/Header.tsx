import React from 'react';
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import NEESSILogo from 'resources/images/nEESSI';
import * as MPT from '../../proptypes/';
import { saksbehandlerSelectors } from '../../ducks/saksbehandler/';
import './Header.css';

const Header = (props: any) => {
  const { saksbehandler: { navn } } = props;
  const { t } = useTranslation()
  return (
    <header className="topplinje">
      <div className="topplinje__brand">
        <Link to="/" className='ml-2 mr-2'>
          <NEESSILogo/>
        </Link>
        <div className="brand__skillelinje" />
        <div className="brand__tittel"><span>{t('ui:app-name')}</span></div>
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
