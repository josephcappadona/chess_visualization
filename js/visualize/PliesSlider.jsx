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
    width: 350
  },
  input: {
    width: 70
  }
});

const isValid = function (value) {
  return value !== "";
};

const PliesSlider = ({ lower, upper, step, defaultValue, callback }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(defaultValue);

  const cleanValue = function (value) {
      return value[0] !== "" ? value : defaultValue;
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    callback(newValue);
  };

  const handleInputChange = (event) => {
    const val = Number(event.target.value);
    if (!isNaN(val)) {
      const newValue = event.target.value !== "" ? val : "";
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
            value={value}
            margin="dense"
            onChange={handleInputChange}
            inputProps={{
              min: lower,
              max: upper,
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
      </Grid>
    </div>
  );
}

PliesSlider.defaultProps = {
  lower: 1,
  upper: 15,
  step: 1,
  defaultValue: 2,
  callback: (e) => {}
}

export default PliesSlider;