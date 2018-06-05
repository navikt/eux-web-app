import React, { Component } from 'react';
// import PT from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import * as Skjema from '../skjema/';
import * as Nav from '../../utils/navFrontend';
import * as Api from '../../services/api';
// import * as MPT from '../../proptypes';

class Vedlegg extends Component {
  overstyrSubmit = event => {
    console.log(event.target);
    event.preventDefault();
    // const { sendVedlegg } = this.props;
  };

  render() {
    return (
      <div className="vedlegg">
        <Nav.Container fluid>
          <form onSubmit={this.overstyrSubmit}>
            <Nav.Row>
              <Nav.Column xs="4">
                <Nav.Panel className="vedlegg__skjema">
                  <Nav.Fieldset legend="Vedleggs informasjon">
                    <Skjema.Input feltNavn="journalpostID" label="JournalpostID" />
                    <Skjema.Input feltNavn="dokumentID" label="DokumentID" />
                    <Skjema.Input feltNavn="saksnummer" label="RINA Saksnummer" />
                  </Nav.Fieldset>
                  <div className="vedlegg__submmit">
                    <Nav.Knapp onClick={this.sendVedlegg}>Send Vedlegg</Nav.Knapp>
                  </div>
                </Nav.Panel>
              </Nav.Column>
            </Nav.Row>
          </form>
        </Nav.Container>
      </div>
    );
  }
}
const form = {
  form: 'vedlegg',
  enableReinitialize: true,
  destroyOnUnmount: true,
  onSubmit: () => {},
};

const mapStateToProps = () => ({
  initalValues: {
    journalpostID: '',
    dokumentID: '',
    saksnummer: '',
  },
});
const mapDispatchToProps = () => ({
  send: data => Api.Vedlegg.send(data),
});
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(form)(Vedlegg));
