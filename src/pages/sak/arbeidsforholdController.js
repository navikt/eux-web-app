import React, { Component } from 'react';

import PT from 'prop-types';
import * as MPT from '../../proptypes';
import Ui from 'eessi-pensjon-ui'
import * as Api from '../../services/api';
import Arbeidsforhold from './arbeidsforhold';

class ArbeidsforholdController extends Component {
  state = {
    arbeidsforhold: [],
  };

  hentArbeidsforhold = async () => {
    const { fnr } = this.props;
    const arbeidsforhold = await Api.Arbeidsforhold.hent(fnr);
    this.setState({ arbeidsforhold });
  };

  render() {
    const { arbeidsforhold } = this.state;
    return (
      <div className="arbeidsforhold">
        <Ui.Nav.Row>
          <Ui.Nav.Column xs="3">
            <strong>AA Registeret</strong><br />Arbeidsforhold/Arbeidsgivere
          </Ui.Nav.Column>
          <Ui.Nav.Column xs="2">
            <Ui.Nav.Knapp onClick={this.hentArbeidsforhold}>Søk</Ui.Nav.Knapp>
          </Ui.Nav.Column>
        </Ui.Nav.Row>
        <Ui.Nav.Row>
          &nbsp;
        </Ui.Nav.Row>
        {arbeidsforhold.length > 0 && <Arbeidsforhold arbeidsforhold={arbeidsforhold} />}
      </div>
    );
  }
}
ArbeidsforholdController.propTypes = {
  fnr: PT.string,
  arbeidsforhold: MPT.Arbeidsforhold,
};
ArbeidsforholdController.defaultProps = {
  fnr: '',
  arbeidsforhold: [],
};

export default ArbeidsforholdController;
