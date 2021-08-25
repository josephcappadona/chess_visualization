import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { puzzleThemes } from './puzzleThemes.jsx'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        width: 'max-content'
    },
    dropdownSearch: {
        width: 450,
    },
    buttonGroupContainer: {
        marginLeft: 10
    },
    buttonGroup: {
        height: 30
    }
});

const ThemeSelect = ({ callback }) => {
    const classes = useStyles();
    const [values, setValues] = React.useState([]);
    const [operator, setOperator] = React.useState("or");

    const onOptionChange = (e, themes) => {
        setValues(themes.map(e => e.value));
    };

    const onOperatorChange = (e, newVal) => {
        setOperator(newVal);
    };

    React.useEffect(() => {
        callback(values, operator)
    }, [values, operator]);

    return (
        <div className={classes.root}>
            <div className={classes.dropdownSearch}>
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    size="small"
                    onChange={onOptionChange}
                    options={puzzleThemes}
                    groupBy={option => option.group}
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
            <div className={classes.buttonGroupContainer}>
                   <ToggleButtonGroup
                            className={classes.buttonGroup}
                            value={operator}
                            size="small"
                            exclusive
                            onChange={onOperatorChange}>
                        <ToggleButton value="or">OR</ToggleButton>
                        <ToggleButton value="and">AND</ToggleButton>
                    </ToggleButtonGroup>
            </div>
        </div>
    );
}

ThemeSelect.defaultProps = {
  callback: (a, b) => {}
}

export default ThemeSelect;