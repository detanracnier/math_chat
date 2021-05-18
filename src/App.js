import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io.connect('wss://math-chat-plus.herokuapp.com',
  {
    withCredentials: true,
    autoConnect: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });


function App() {

  const [state, setState] = useState({ left: "", operator: "", right: "", answer: "" });
  const [equations, setEquations] = useState([]);

  socket.on('connect', () => {
    console.log("Socket connected");
  })
  socket.on('disconnect', () => {
    console.log("Socket disconnect");
  })
  socket.on('connect_error', (err) => {
    console.log("Socket connect_error");
    console.log(err);
  })
  socket.on('reconnect_error', (err) => {
    console.log("Socket reconnect_error");
    console.log(err);
  })

  useEffect(() => {
    socket.on("calculate", (equations) => {
      setEquations(equations);
    })
  })

  useEffect(()=>{
    socket.emit("initialize");
  },[])

  const handleButtonClick = (e) => {
    const type = e.target.name;
    if (type === "number") {
      if(state.answer){
        setState({left: e.target.value, operator: "", right: "", answer: ""});
      } else if (state.operator) {
        setState({ ...state, right: state.right + e.target.value });
      } else {
        setState({ ...state, left: state.left + e.target.value });
      }
    }
    if (type === "operator") {
      if (state.left) {
        setState({ ...state, operator: e.target.value })
      }
    }
  }

  const handleClear = () => {
    setState({ left: "", operator: "", right: "", answer: "" });
  }

  const handleSubmit = (e) => {
    const equation = state;
    let answer = "";
    switch (equation.operator) {
      case "+":
        answer = parseFloat(equation.left) + parseFloat(equation.right);
        break;
      case "-":
        answer = parseFloat(equation.left) - parseFloat(equation.right);
        break;
      case "x":
        answer = parseFloat(equation.left) * parseFloat(equation.right);
        break;
      case "÷":
        answer = parseFloat(equation.left) / parseFloat(equation.right);
        break;
      default:
    }
    setState({...state, answer: answer});
    const equationStr = String(equation.left) + equation.operator + String(equation.right) + "=" + String(answer);
    socket.emit("calculate", equationStr)
  }

  const renderEquations = () => {
    let equationsTrim = equations.slice(Math.max(equations.length-10, 0));
    return equationsTrim.map((equation, index) => (
      <div key={index}>
        {equation}
      </div>
    ))
  }

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="container bg-secondary">
              <div className="row pt-2">
                <div className="col bg-light rounded">
                  {state.left}{state.operator}{state.right}{state.answer ? "="+state.answer : ""}</div>
                <button className="col-3 calculatorButton rounded" onClick={handleClear}>clear</button>
              </div>
              <div onClick={handleButtonClick}>
                <div className="row">
                  <button className="col calculatorButton rounded" name="number" value="7">7</button>
                  <button className="col calculatorButton rounded" name="number" value="8">8</button>
                  <button className="col calculatorButton rounded" name="number" value="9">9</button>
                  <button className="col calculatorButton rounded" disabled={state.operator} name="operator" value="÷">÷</button>
                </div>
                <div className="row">
                  <button className="col calculatorButton rounded" name="number" value="4">4</button>
                  <button className="col calculatorButton rounded" name="number" value="5">5</button>
                  <button className="col calculatorButton rounded" name="number" value="6">6</button>
                  <button className="col calculatorButton rounded" disabled={state.operator} name="operator" value="x">x</button>
                </div>
                <div className="row">
                  <button className="col calculatorButton rounded" name="number" value="1">1</button>
                  <button className="col calculatorButton rounded" name="number" value="2">2</button>
                  <button className="col calculatorButton rounded" name="number" value="3">3</button>
                  <button className="col calculatorButton rounded" disabled={state.operator} name="operator" value="-">-</button>
                </div>
                <div className="row pb-2">
                  <button className="col calculatorButton rounded" name="number" value="0">0</button>
                  <button className="col calculatorButton rounded" name="number" value=".">.</button>
                  <button className="col calculatorButton rounded" disabled={!state.right} onClick={handleSubmit}>=</button>
                  <button className="col calculatorButton rounded" disabled={state.operator} name="operator" value="+">+</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="render-equations">
              <h1>Equation Log</h1>
              {renderEquations()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
