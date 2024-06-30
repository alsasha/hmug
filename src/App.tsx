import React, {useEffect, useState} from 'react';
import './App.css';
import './styles/global.scss'
import Home from './components/Home';
import Converter from './components/Converter';
import Summary from './components/Summary';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {CurrenciesValuesType} from "./types/types";
import convertCurrency from "./services/services";

function App() {
    const [currenciesValues, setCurrenciesValues] = useState<CurrenciesValuesType>({})

    const fetchConversion = async (amount = 1, fromCurrency = 'USD', toCurrency = 'EUR') => {
        try {
            const result = await convertCurrency(amount, fromCurrency, toCurrency);
            // @ts-ignore
            setCurrenciesValues((prev) => ({...prev, [fromCurrency]: result.rates }))
            console.log('Converted Amount:', result.convertedAmount);
            console.log('Exchange Rate:', result.rate);
            return result
        } catch (error) {
            console.error(error);
            return error
        }
    };

    useEffect(() => {
        // todo add errors handle
        fetchConversion();
    }, []);

    return (
      <Router>
          <Switch>
              <Route exact path="/" >
                  <Home
                      currenciesValues={currenciesValues}
                      setCurrenciesValues={setCurrenciesValues}
                  />
              </Route>
              <Route path="/converter">
                  <Converter
                      currenciesValues={currenciesValues}
                      setCurrenciesValues={setCurrenciesValues}
                      // @ts-ignore
                      fetchConversion={fetchConversion}
                  />
              </Route>
              <Route path="/summary" component={Summary} />
          </Switch>
      </Router>
  );
}

export default App;
