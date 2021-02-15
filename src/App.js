import React from "react";
import "./style.css";

import Calendar from "./components/Calendar";
import Day from "./components/Day";

import { Switch, Route, Link, Redirect } from "react-router-dom";

export default function App() {
  return (
    <div className="App">
      <header>
        <div id="logo">
          <span>
            <strong>React Calendar Implementation</strong>
          </span>
        </div>
      </header>
      <main>
        <Switch>
          <Route exact path="/" component={Calendar} />
          <Route exact path="/day/:id" component={Day} />
        </Switch>
      </main>
    </div>
  );
}
