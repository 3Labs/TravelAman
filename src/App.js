import logo from './logo.svg';
import './App.css';

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button } from "@progress/kendo-react-buttons";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div className="col-xs-12 example-col">
          <p>Travel Aman</p>
          {/* <Button icon="calendar">KendoReact Font Icon</Button>
          <Button iconClass="fa fa-calendar fa-fw">Font Awesome Icon</Button> */}
          <Button imageUrl="https://demos.telerik.com/kendo-ui/content/shared/icons/sports/snowboarding.png"
                  // onClick={ window.open("http://localhost:3000")}    
          >      
          </Button>
        </div>
        
      </header>
    </div>
  );
}

export default App;
