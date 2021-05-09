import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import './App.css';

const socket = io.connect('http://localhost:4000',
{
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

function App() {

    const [state, setState] = useState("");
    const [equations, setEquation] = useState([]);

    useEffect(() => {
      socket.on("calculate", (equation) => {
        setEquation([...equations, equation])
      })
    })

    const onTextChange = (e) => {
      setState(e.target.value)
    }

    const onEquationSubmit = (e) => {
      e.preventDefault();
      const equation = state;
      socket.emit("calculate", equation)
      setState("");
    }

    const renderEquations = () => {
      return equations.map((equation, index) => (
        <div key={index}>
          {equation}
        </div>
      ))
    }

    return (
      <div className="App">
        <form onSubmit={onEquationSubmit}>
          <input
            type="text"
            name="equation"
            onChange={e => onTextChange(e)}
            value={state}
            label="Calculate"
          />
          <button>Calculate</button>
        </form>
        <div className="render-equations">
          <h1>Equation Log</h1>
          {renderEquations()}
        </div>
      </div>
    );
  }

export default App;
