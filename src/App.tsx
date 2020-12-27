import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import React from "react";
// import useWebSocket, { ReadyState } from 'react-use-websocket';
import Superagent from "superagent";

const useStyles = makeStyles((theme: any) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  leftControl: {
    display: "flex",
    minHeight: theme.spacing(5),
    alignItems: "center",
  },
  rightControl: {
    display: "flex",
    minHeight: theme.spacing(5),
    alignItems: "center",
    justifyContent: "flex-end",
  },
  leftControlGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: theme.spacing(20),
  },
  rightControlGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    minHeight: theme.spacing(15),
  },
  statusPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  android: {
    fontSize: theme.spacing(17),
    color: "purple",
  },
}));

function App() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    switch: false,
  });

  console.log("RENDER", state);

  const handleSetState = (value: boolean) => {
    return async () => {
      let newState = { ...state, switch: value };
      setState(newState);
      await Superagent.post(
        "https://stage.us-west-2.fusebit.io/v1/run/sub-ed9d9341ea356841/tomek/pi/switch"
      ).send({ state: state.switch });
    };
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12}>
        <Switch
          color="primary"
          checked={state.switch}
          onChange={handleSetState(!state.switch)}
        />
      </Grid>
    </Grid>
  );
}

export default App;
