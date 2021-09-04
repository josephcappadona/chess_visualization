import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { openings } from './openings.jsx'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        width: 'max-content'
    },
    dropdownSearch: {
        width: 435,
    },
    buttonGroupContainer: {
        marginLeft: 10
    },
    buttonGroup: {
        height: 30
    }
});

const OpeningSelect = ({ callback }) => {
    const classes = useStyles();
    const [values, setValues] = React.useState([]);

    const onOptionChange = (e, vals) => {
        setValues(vals.map(e => e.value));
    };

    React.useEffect(() => {
        callback(values)
    }, [values]);

    return (
        <div className={classes.root}>
            <div className={classes.dropdownSearch}>
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    size="small"
                    onChange={onOptionChange}
                    options={openings}
                    getOptionLabel={(option) => option.label}
                    defaultValue={[]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                        />
                    )}
                />
            </div>
        </div>
    );
}

OpeningSelect.defaultProps = {
  callback: (a, b) => {}
}

export default OpeningSelect;