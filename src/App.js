import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import logo from './logo.svg';
import './App.css';
import ProTip from './ProTip';
import MatrixForm from './MatrixForm';

function App() {
  return (
    <Container id="app-container">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Forward Kinematics Calculator
        </Typography>
        <MatrixForm />
      </Box>
    </Container>
  );
}

function Hello() {
  const [count, setCount] = useState([0,0,0,0]);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}

export default App;
