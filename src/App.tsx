import React from 'react';
import './App.css';
import './styles/global.scss'
import Home from './components/Home';
import Converter from './components/Converter';
import Summary from './components/Summary';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
      <Router>
          <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/converter" component={Converter} />
              <Route path="/summary" component={Summary} />
          </Switch>
      </Router>
  );
}

export default App;
