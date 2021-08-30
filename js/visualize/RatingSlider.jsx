import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles({
  root: {
    width: 'max-content'
  },
  slider: {
    width: 340
  },
  input: {
    width: 70
  }
});

const isValid = function (value) {
  return value[0] !== "" && value[1] !== "";
};

const RatingSlider = ({ lower, upper, step, defaultValue, callback }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(defaultValue);

  const cleanValue = function (value) {
    const newValue = [];
    if (value[0] === "") {
      newValue.push(lower);
    } else {
      newValue.push(value[0]);
    }
    if (value[1] === "") {
      newValue.push(upper);
    } else {
      newValue.push(value[1]);
    }
    return newValue;
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    callback(newValue);
  };

  const handleInputChangeLower = (event) => {
    const val = Number(event.target.value);
    if (!isNaN(val)) {
      const newValue = [event.target.value === "" ? "" : val, value[1]];
      setValue(newValue);
      callback(newValue);
    }
  };
  const handleInputChangeUpper = (event) => {
    const val = Number(event.target.value);
    if (!isNaN(val)) {
      const newValue = [value[0], event.target.value === "" ? "" : val];
      setValue(newValue);
      callback(newValue);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Input
            className={classes.input}
            value={value[0]}
            margin="dense"
            onChange={handleInputChangeLower}
            inputProps={{
              min: lower,
              max: value[1] - step,
              step: step,
              type: "number"
            }}
          />
        </Grid>
        <Grid item xs>
          <Slider
            className={classes.slider}
            value={isValid(value) ? value : cleanValue(value)}
            onChange={handleSliderChange}
            min={lower}
            max={upper}
            step={step}
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={value[1]}
            margin="dense"
            onChange={handleInputChangeUpper}
            inputProps={{
              min: value[0] + step,
              max: upper,
              step: step,
              type: "number"
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

RatingSlider.defaultProps = {
  lower: 500,
  upper: 3000,
  step: 50,
  defaultValue: [900, 1300],
  callback: () => {}
}

export default RatingSlider;