import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import './MatrixForm.css';
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '20ch',
    },
  },
}));

const math = require('mathjs');

export default function MatrixForm() {
  const blankRow = {theta: 0, alpha: 0, r: 0, d: 0};
  const blankHMI = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,1]];
  const [rowState, setRowState] = useState([{...blankRow}, ]);
  const [hmiState, setHmiState] = useState([[...blankHMI], ]);
  const [resultMatrix, setResultMatrix] = useState([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);

  const handleRowChange = (e) => {
    const updatedRows = [...rowState];
    updatedRows[e.target.dataset.idx][e.target.className] = e.target.value;
    setRowState(updatedRows);
  }

  const addRow = () => {
    setRowState([...rowState, {...blankRow}])
  }

  const computeHMI = () => {
    const newHmiState = [];
    console.log(rowState);
    rowState.forEach(function (get_row) {
      const row = {...get_row};
      console.log(row);
      const theta = parseFloat(row.theta);
      const alpha = parseFloat(row.alpha);
      const r = parseFloat(row.r);
      const d = parseFloat(row.d);
      const newResultMatrix = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,1]];
      newResultMatrix[0][0] = Math.sin(theta);
      newResultMatrix[0][1] = Math.sin(theta) * Math.cos(alpha) * -1;
      newResultMatrix[0][2] = Math.sin(theta) * Math.sin(alpha);
      newResultMatrix[0][3] = r * Math.cos(theta);
      newResultMatrix[1][0] = Math.sin(theta);
      newResultMatrix[1][1] = Math.cos(theta) * Math.cos(alpha);
      newResultMatrix[1][2] = Math.cos(theta) * Math.cos(alpha) * -1;
      newResultMatrix[1][3] = r * Math.sin(theta);
      newResultMatrix[2][1] = Math.sin(alpha);
      newResultMatrix[2][2] = Math.cos(alpha);
      newResultMatrix[2][3] = d;
      newHmiState.push(newResultMatrix);
    });
    setHmiState(newHmiState);
  }

  const computeKinChainHMI = () => {
    computeHMI();
    setResultMatrix([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
    console.log(hmiState);
    var oldResultMatrix = _.cloneDeep(resultMatrix);
    hmiState.forEach(function (get_hmi) {
      oldResultMatrix = math.multiply(oldResultMatrix, get_hmi);
    });
    console.log(oldResultMatrix);
    setResultMatrix(oldResultMatrix);
    console.log(resultMatrix);
  }

  const removeRow = () => {
    const newRowState = [...rowState];
    if (newRowState.length > 1) {
      newRowState.pop();
    }
    setRowState(newRowState);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  }
  const classes = useStyles();
  return (
    <div id="matrix-form">
    <form className={classes.root} noValidate autoComplete="off" >
      <Button variant="contained" value="Add New Row" onClick={addRow}>
        Add New Row
      </Button>
      <Button variant="contained" value="Remove Last Row" onClick={removeRow}>
        Remove Last Row
        </Button>
      <Button variant="contained" value="Compute HMI" onClick={computeHMI}>
        Compute HMI
        </Button>
      <Button variant="contained" onClick={computeKinChainHMI}>
      Compute Kin. Chain HMI
      </Button>
      <Grid container spacing={1} direction="row">
      <Grid item xs={1}>
          <label><em>T</em></label>
        </Grid>
        <Grid item xs={1}>
          <label><em>&Theta;</em></label>
        </Grid>
        <Grid item xs={1}>
          <label><em>&alpha;</em></label>
        </Grid>
        <Grid item xs={1}>
          <label><em>r</em></label>
        </Grid>
        <Grid item xs={1}>
          <label><em>d</em></label>
        </Grid>
      </Grid>
      {rowState.map((val, idx) => {
        const rowThetaId = `theta-${idx}`;
        const rowAlphaId = `alpha-${idx}`;
        const rowRId = `r-${idx}`;
        const rowDId = `d-${idx}`;
        return (
          <div key={`row-${idx}`} className="grid-rows">
            <Grid container spacing={1} direction="row">
              <Grid item>
                <label id="transform-label">{`Transform: ${idx}`}</label>
              </Grid>
              <Grid item xs={1}>
                <input required id={rowThetaId} className="theta" name={rowThetaId}
                 onChange={handleRowChange} value={rowState[idx].theta} data-idx={idx}/>
             </Grid>
             <Grid item xs={1}>
                <input required id={rowAlphaId} className="alpha" name={rowAlphaId}
                 onChange={handleRowChange} value={rowState[idx].alpha} data-idx={idx}/>
             </Grid>
             <Grid item xs={1}>
                <input required id={rowRId} className="r" name={rowRId}
                 onChange={handleRowChange} value={rowState[idx].r} data-idx={idx}/>
             </Grid>
             <Grid item xs={1}>
                <input required id={rowDId} className="d" name={rowDId}
                 onChange={handleRowChange} value={rowState[idx].d} data-idx={idx}/>
             </Grid>
            </Grid>
          </div>
        )
      })}
      {hmiState.map((val, idx) => {
        return (
        <div>
          <br/>
          <Grid container direction="column">
            <Grid container direction="row" spacing={3}>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][0][0]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][0][1]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][0][2]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][0][3]}</Paper>
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={3}>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][1][0]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][1][1]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][1][2]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][1][3]}</Paper>
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={3}>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][2][0]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][2][1]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][2][2]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][2][3]}</Paper>
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={3}>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][3][0]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][3][1]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][3][2]}</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>{hmiState[idx][3][3]}</Paper>
              </Grid>
            </Grid>
          </Grid>
        </div>
      )
      })}
    </form>
    </div>
  );
}

