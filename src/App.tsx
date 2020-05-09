import Grid from "@material-ui/core/Grid";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import { makeStyles } from "@material-ui/core/styles";
import Fab from '@material-ui/core/Fab'; 
import React from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const useStyles = makeStyles((theme: any) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    // backgroundColor: 'blue'
  },
  leftControl: {
    display: 'flex',
    minHeight: theme.spacing(5),
    alignItems: 'center',
    // background: 'red'
  },
  rightControl: {
    display: 'flex',
    minHeight: theme.spacing(5),
    alignItems: 'center',
    justifyContent: 'flex-end',
    // background: 'red'
  }
}));

function App() {
  const classes = useStyles();
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket(`ws://raspberrypi/api/ws`);
  const [state, setState] = React.useState({
    lf: false,
    lb: false,
    rf: false,
    rb: false,
    led: false,
  });

  const connectionStatus: any = {
    [ReadyState.CONNECTING as unknown as string]: 'Connecting',
    [ReadyState.OPEN as unknown as string]: 'Open',
    [ReadyState.CLOSING as unknown as string]: 'Closing',
    [ReadyState.CLOSED as unknown as string]: 'Closed',
  }[readyState];

  console.log('RENDER', readyState, lastJsonMessage, state);

  const handleSetState = (param: 'lf' | 'lb' | 'rf' | 'rb' | 'led', value: boolean) => {
    return () => {
      let newState = { ...state };
      newState[param] = value;
      setState(newState);
      if (ReadyState.OPEN === readyState) {
        try {
          sendJsonMessage(newState);
        }
        catch (_) {}
      }
    }
  }

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12} className={classes.rightControl}>
        <Fab color="primary"
          onTouchStart={() => { handleSetState('lf', true); handleSetState('rf', true); }} 
          onMouseDown={() => { handleSetState('lf', true); handleSetState('rf', true); }} 
          onTouchEnd={() => { handleSetState('lf', false); handleSetState('rf', false); }} 
          onMouseUp={() => { handleSetState('lf', false); handleSetState('rf', false); }} 
        >
          <PublishIcon />
        </Fab>
      </Grid>
      <Grid item xs={6} className={classes.leftControl}>
        <Fab color="primary" 
          onTouchStart={handleSetState('lf', true)} 
          onMouseDown={handleSetState('lf', true)}
          onTouchEnd={handleSetState('lf', false)} 
          onMouseUp={handleSetState('lf', false)}
        >
          <ArrowUpwardIcon />
        </Fab>
      </Grid>
      <Grid item xs={6} className={classes.rightControl}>
        <Fab color="primary"
          onTouchStart={handleSetState('rf', true)} 
          onMouseDown={handleSetState('rf', true)}
          onTouchEnd={handleSetState('rf', false)} 
          onMouseUp={handleSetState('rf', false)}
        >
          <ArrowUpwardIcon />
        </Fab>
      </Grid>
      <Grid item xs={6} className={classes.leftControl}>
        <Fab color="primary"
          onTouchStart={handleSetState('lb', true)} 
          onMouseDown={handleSetState('lb', true)}
          onTouchEnd={handleSetState('lb', false)} 
          onMouseUp={handleSetState('lb', false)}
        >
          <ArrowDownwardIcon />
        </Fab>
      </Grid>
      <Grid item xs={6} className={classes.rightControl}>
        <Fab color="primary"
          onTouchStart={handleSetState('rb', true)} 
          onMouseDown={handleSetState('rb', true)}
          onTouchEnd={handleSetState('rb', false)} 
          onMouseUp={handleSetState('rb', false)}
        >
          <ArrowDownwardIcon />
        </Fab>
      </Grid>
      <Grid item xs={12} className={classes.rightControl}>
        <Fab color="primary"
          onTouchStart={() => { handleSetState('lb', true); handleSetState('rb', true); }} 
          onMouseDown={() => { handleSetState('lb', true); handleSetState('rb', true); }} 
          onTouchEnd={() => { handleSetState('lb', false); handleSetState('rb', false); }} 
          onMouseUp={() => { handleSetState('lb', false); handleSetState('rb', false); }} 
        >
          <GetAppIcon />
        </Fab>
      </Grid>
      <Grid item xs={12}>
        Connection status: {connectionStatus} {readyState}
      </Grid>
    </Grid>
  );
}

export default App;
