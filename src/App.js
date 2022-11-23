import React from "react";
//import ReactDOM from "react-dom/client";
import "./App.css";
import { evaluate  } from "mathjs";

class App extends React.Component {
  state = {
    buttonData: [
      ["zero", 0],
      ["one", 1],
      ["two", 2],
      ["three", 3],
      ["four", 4],
      ["five", 5],
      ["six", 6],
      ["seven", 7],
      ["eight", 8],
      ["nine", 9],
      ["decimal", "."],
      ["clear", "AC"],
      ["equals", "="],
      ["add", "+"],
      ["minus", "-"],
      ["mult", "*"],
      ["divide", "/"],
    ],
    button:[],
    display:"",
    output: 0,
    // controls: [if an expression is complete, zero can be entered, decimal can be entered ]
    controls: [true, true, true]
  };
  constructor(props) {
    super(props);

    let button = [];
    for (let i = 0; i < this.state.buttonData.length; i++) {
      const d = this.state.buttonData[i];
      button.push(
        <input type="button" key={d[0]} id={d[0]} onClick={this.handleClick} value= {d[1]}/>
      );
    }
    this.state.button = button;
  }

  operatorParse = str => {
    return str.replace(/([+\-*/])([+\-*/])/g, (match, p1, p2) => {
      if(p1 === "-" && p2 === "-") {
        return "-(-1)*";
      } else {
        return p2;
      }
    });
  };

  handleClick = (event) => {
    const val = event.target.value;
    //console.log(typeof(val), val);
    let displayStr = this.state.display;
    let outputNum = this.state.output;
    let [complete, zeroC, decimalC] = this.state.controls;
    if (val === "AC") {
      displayStr = ""; outputNum= 0; 
      [complete, zeroC, decimalC] = [true, true, true]; 
    } else if (val === "=") {
      outputNum = evaluate(this.operatorParse(displayStr)); 
      [complete, zeroC, decimalC] = [true, true, true];
    } else {
      if(val.match(/^[1-9]/)) {    
        displayStr = complete? val:displayStr+ val;
        zeroC = true;
      } else if (val === "0") {
        if (complete) {
          displayStr = val;
          zeroC = false;
        } else {
          if (zeroC) {
            if (!displayStr.at(-1).match(/[0-9.]/)) zeroC = false;
            displayStr += val;      
          } 
        }
      } else if (val === "."){
        if (complete) {
          displayStr = val;         
        } else if (decimalC) {
          displayStr += val;
        }
        decimalC = false;
        zeroC = true;
      } else  {  // val ==== one of + - * / 
        if(complete) {
          if (outputNum) {
            displayStr = outputNum + val; 
          } else {
            if (val === "-") {
              displayStr = val;
            }
          }
        } else {
          const lastStr = displayStr.at(-1);
          if (lastStr.match(/[0-9.]/)) {
            displayStr += val;
          } 
          // last two charactors are one of + - * /
          else if (displayStr.length >= 2 && displayStr.at(-2).match(/[+\-*/]/)) { 
            displayStr = displayStr.slice(0,-2) + val;
          } else { // only the lastStr is one of + - * /
              displayStr += val;
          }
        }
        [zeroC, decimalC] = [true, true];
      }
      complete = false;
    }
    this.setState({display:displayStr, output: outputNum, controls: [complete, zeroC, decimalC]});
  };

  render() {
    return (
      <div id="calculator">
        <div className="screen">
          <div id="display">{this.state.display}</div>
          <div className="output">{this.state.output}</div>
        </div>
        <div className="clickables"> {this.state.button}</div>
      </div>
    );
  }
}

export default App;
