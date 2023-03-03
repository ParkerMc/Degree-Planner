import React from 'react';
import styled from '@emotion/styled'
import logo from './logo.svg';
import './App.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { decrement, increment } from './features/transcript/transcriptSlice';

function App() {
  const count = useAppSelector((state) => state.transcript.value)
  const dispatch = useAppDispatch()

  const NumberBox = styled.p`
  display: flex;
  `

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <NumberBox>
          {count}
          <span>
            <button onClick={() => dispatch(increment())}>+</button>
            <button onClick={() => dispatch(decrement())}>-</button>
          </span>
        </NumberBox>
        <input type="number"></input>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
