import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from "@material-ui/core/styles";

const axios = require('axios').default;
const HOST = 'http://' + window.location.host;

const useStyles = makeStyles({
    root: { },
});

function App(props) {
    const classes = useStyles();

    const [state, setState] = React.useState({ });

    const { } = state;

    return (
        <div className={classes.root}>
            Homepage
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
