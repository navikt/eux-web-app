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

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('Case type: ' + this.state.caseType);
    event.preventDefault();
  }

  render() {
    return (

      <form>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">EUX-web-app</h1>
          </header>
          <p className="App-intro">
            Nei, altså ... prøver å få til en Ract-app da...
          </p>
        </div>
        <div>
          <label>Sakstype:</label>
          <input type="text" value={this.state.value}/>
        </div>
        <div>
          <label>User:</label>
          <input type="text" value={this.state.user}/>
        </div>
        <div>
          <label>Counterparty:</label>
          <input type="text" value={this.state.counterParty}/>
        </div>
        <div>
          <input type="submit" value="Submit" onClick={this.handleSubmit}/>
        </div>
      </form>
    );
  }
}

export default App;
