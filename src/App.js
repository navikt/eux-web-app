import React, {Component} from 'react';
import './App.scss';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      caseType: '',
      user: '',
      counterParty: ''
    };

    this.handleChangeCaseType = this.handleChangeCaseType.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangeCounterParty = this.handleChangeCounterParty.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('Case type: ' + this.state.caseType + ', user: ' + this.state.user
      + ', counterParty: ' + this.state.counterParty);
    event.preventDefault();
  }

  handleChangeCaseType(event) {
    this.setState({caseType: event.target.value});
  }

  handleChangeUser(event) {
    this.setState({user: event.target.value});
  }

  handleChangeCounterParty(event) {
    this.setState({counterParty: event.target.value});
  }

  render() {
    return (

      <form>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">EUX-web-app</h1>
          </header>
        </div>
        <div>
          <label>Sakstype:</label>
          <input type="text" value={this.state.caseType}
                 onChange={this.handleChangeCaseType}/>
        </div>
        <div>
          <label>User:</label>
          <input type="text" value={this.state.user}
                 onChange={this.handleChangeUser}/>
        </div>
        <div>
          <label>Counterparty:</label>
          <input type="text" value={this.state.counterParty}
                 onChange={this.handleChangeCounterParty}/>
        </div>
        <div>
          <input type="submit" value="Submit" onClick={this.handleSubmit}/>
        </div>
      </form>
    );
  }
}

export default App;
