import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import RatingSlider from './RatingSlider.jsx';
import PliesSlider from './PliesSlider.jsx';
import ThemeSelect from './ThemeSelect.jsx';

const useStyles = makeStyles({
    root: {
        width: 'max-content',
        padding: 10
    },
    paramHeader: {
        fontSize: 20
    },
    paramContainer: {
        padding: '0 0 10px 0'
    }
});

const PuzzleParams = ({ defaultPlies, defaultRating, callback }) => {
    const classes = useStyles();
    
    const [state, setState] = React.useState({
        ratingRange: defaultRating,
        pliesBackward: defaultPlies,
        themes: [],
        themesOperator: "or"
    });
    
    React.useEffect(() => {
        callback(state);
      }, [state]);

    const ratingCallback = (newRange) => {
        setState(prevState => {return {...prevState, ratingRange: newRange}});
    };

    const pliesCallback = (newPlies) => {
        setState(prevState => {return {...prevState, pliesBackward: newPlies}});
    };

    const themesCallback = (newThemes, newThemesOperator) => {
        setState(prevState => {
            return {...prevState, themes: newThemes, themesOperator: newThemesOperator}
        });
    };

    return (
        <div className={classes.root}>
            <div className={classes.paramContainer}>
                <div className={classes.paramHeader}>Puzzle Rating:</div>
                <RatingSlider callback={ratingCallback} defaultValue={defaultRating} />
            </div>
            <div className={classes.paramContainer}>
                <div className={classes.paramHeader}>Plies to Visualize:</div>
                <PliesSlider callback={pliesCallback} defaultValue={defaultPlies} />
            </div>
            <div className={classes.paramContainer}>
                <div className={classes.paramHeader}>Theme:</div>
                <ThemeSelect callback={themesCallback} />
            </div>
        </div>
    )
}

PuzzleParams.defaultProps = {
    defaultRating: [900, 1300],
    defaultPlies: 2,
    callback: (e) => {},
};

export default PuzzleParams;