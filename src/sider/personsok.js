import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, change } from 'redux-form';
import PT from 'prop-types';

import * as MPT from '../proptypes/';
import * as Nav from '../utils/navFrontend';
import { PersonerOperations, PersonerSelectors } from '../ducks/personer';

class PersonSok extends Component {
  componentWillMount() {
    this.setState({ sokeStreng: '' });
  }
  vedSokSubmit = form => {
    const { lagreSokeStreng, handleSubmit, hentPerson } = this.props;
    const { sokeStreng } = this.state;
    lagreSokeStreng(sokeStreng);
    if (sokeStreng.length === 11) {
      hentPerson(sokeStreng);
    }
    handleSubmit(form);
  };
  vedEndretSokeFelt = event => {
    const sokeStreng = event.target.value;
    this.setState({ sokeStreng });
  };
  render() {
    const { person } = this.props;
    return (
      <Nav.Panel>
        <form className="personsok" onSubmit={this.vedSokSubmit}>
          <Nav.Input
            label="Søk på fødsels- eller d-nummer"
            className="personsok__input"
            bredde="XL"
            onChange={this.vedEndretSokeFelt}
            ref={this.state.sokeStreng}
          />
          <Nav.Knapp className="personsok__knapp">SØK</Nav.Knapp>
        </form>
        <h3>ARE{JSON.stringify(person)}BARE</h3>
      </Nav.Panel>
    );
  }
}
PersonSok.propTypes = {
  person: MPT.Person,
  handleSubmit: PT.func.isRequired,
  lagreSokeStreng: PT.func.isRequired,
  hentPerson: PT.isRequired,
};
PersonSok.defaultProps = {
  person: {},
};

const mapStateToProps = state => ({
  person: PersonerSelectors.personSelector(state),
});
const mapDispatchToProps = dispatch => ({
  lagreSokeStreng: verdi => dispatch(change('sokEtterPerson', 'sokeStreng', verdi)),
  hentPerson: fnr => dispatch(PersonerOperations.hent(fnr)),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'sokEtterPerson',
  initalValues: { sokeFelt: '' },
  onSubmit: () => {},
})(PersonSok));
