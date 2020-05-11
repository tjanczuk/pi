import Grid from "@material-ui/core/Grid";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import { makeStyles } from "@material-ui/core/styles";
import Fab from '@material-ui/core/Fab'; 
import Icon from '@material-ui/core/Icon'; 
import React from 'react';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const useStyles = makeStyles((theme: any) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  leftControl: {
    display: 'flex',
    minHeight: theme.spacing(5),
    alignItems: 'center',
  },
  rightControl: {
    display: 'flex',
    minHeight: theme.spacing(5),
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftControlGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: theme.spacing(20)
  },
  rightControlGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minHeight: theme.spacing(15)
  },
  statusPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  android: {
    fontSize: theme.spacing(17),
    color: 'purple'
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

  const handleSetState = (params: ('lf' | 'lb' | 'rf' | 'rb' | 'led')[], value: boolean) => {
    return () => {
      let newState = { ...state };
      params.forEach(p => newState[p] = value);
      setState(newState);
      if (ReadyState.OPEN === readyState) {
        try {
          sendJsonMessage(newState);
        }
        catch (_) {}
      }
    }
  }

  const handleConnect = () => {
    window.location.href = '/';
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12} className={classes.rightControl}>
        <Fab color="primary"
          disabled={readyState !== ReadyState.OPEN}
          onTouchStart={handleSetState(['lf','rf'], true)} 
          onMouseDown={handleSetState(['lf','rf'], true)} 
          onTouchEnd={handleSetState(['lf','rf'], false)} 
          onMouseUp={handleSetState(['lf','rf'], false)} 
        >
          <PublishIcon />
        </Fab>
      </Grid>
      <Grid item xs={3} className={classes.leftControlGroup}>
        <Grid item xs={12} className={classes.leftControl}>
          <Fab color="primary" 
            disabled={readyState !== ReadyState.OPEN}
            onTouchStart={handleSetState(['lf'], true)} 
            onMouseDown={handleSetState(['lf'], true)}
            onTouchEnd={handleSetState(['lf'], false)} 
            onMouseUp={handleSetState(['lf'], false)}
          >
            <ArrowUpwardIcon />
          </Fab>
        </Grid>
        <Grid item xs={12} className={classes.leftControl}>
          <Fab color="primary"
            disabled={readyState !== ReadyState.OPEN}
            onTouchStart={handleSetState(['lb'], true)} 
            onMouseDown={handleSetState(['lb'], true)}
            onTouchEnd={handleSetState(['lb'], false)} 
            onMouseUp={handleSetState(['lb'], false)}
          >
            <ArrowDownwardIcon />
          </Fab>
        </Grid>
      </Grid>
      <Grid item xs={6} className={classes.statusPanel}>
        {readyState === ReadyState.CONNECTING && <CircularProgress size={72}/>}
        {readyState === ReadyState.OPEN && (
          <React.Fragment>
            <Fab disabled={true}>
              {state.lf && <ArrowUpwardIcon />}
              {state.lb && <ArrowDownwardIcon />}
            </Fab>
            <Icon className={classes.android}>adb</Icon>
            <Fab disabled={true}>
              {state.rf && <ArrowUpwardIcon />}
              {state.rb && <ArrowDownwardIcon />}
            </Fab>
          </React.Fragment>
        )}
        {(readyState === ReadyState.CLOSED || readyState === ReadyState.CLOSING) && (
          <Button variant="contained" color="primary" size="large" onClick={handleConnect}>Connect</Button>
        )}
      </Grid>
      <Grid item xs={3} className={classes.rightControlGroup}>
        <Grid item xs={12} className={classes.rightControl}>
          <Fab color="primary"
            disabled={readyState !== ReadyState.OPEN}
            onTouchStart={handleSetState(['rf'], true)} 
            onMouseDown={handleSetState(['rf'], true)}
            onTouchEnd={handleSetState(['rf'], false)} 
            onMouseUp={handleSetState(['rf'], false)}
          >
            <ArrowUpwardIcon />
          </Fab>
        </Grid>
        <Grid item xs={12} className={classes.rightControl}>
          <Fab color="primary"
            disabled={readyState !== ReadyState.OPEN}
            onTouchStart={handleSetState(['rb'], true)} 
            onMouseDown={handleSetState(['rb'], true)}
            onTouchEnd={handleSetState(['rb'], false)} 
            onMouseUp={handleSetState(['rb'], false)}
          >
            <ArrowDownwardIcon />
          </Fab>
        </Grid>
      </Grid>
      <Grid item xs={6} className={classes.leftControl}>
        <Switch
          disabled={readyState !== ReadyState.OPEN}
          color="primary"
          checked={state.led}
          onChange={handleSetState(['led'], !state.led)}
        />
      </Grid>
      <Grid item xs={6} className={classes.rightControl}>
        <Fab color="primary"
          disabled={readyState !== ReadyState.OPEN}
          onTouchStart={handleSetState(['lb','rb'], true)} 
          onMouseDown={handleSetState(['lb','rb'], true)} 
          onTouchEnd={handleSetState(['lb','rb'], false)} 
          onMouseUp={handleSetState(['lb','rb'], false)} 
        >
          <GetAppIcon />
        </Fab>
      </Grid>
      <Grid item xs={12}>
        Connection status: {connectionStatus}<br></br>
        {lastJsonMessage && typeof lastJsonMessage.message === 'string' && (
          <span>Message from robot: {lastJsonMessage.message}</span>
        )}
      </Grid>
    </Grid>
  );
}

export default App;
