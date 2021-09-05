import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        width: 'max-content',
        padding: 10
    },
    numbering: {
        width: 35,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    move: {
        width: 60,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const Visualize = ({ startingPly, visualizeMoves }) => {
    const classes = useStyles();

    const visualizeMovesPrefix = (startingPly % 2 === 0) ? [] : ["..."];
    const visualizeMovesFixed = visualizeMovesPrefix.concat(visualizeMoves);
    const visualizeMovesPairs = [];
    for (let i = 0; i < visualizeMovesFixed.length; i += 2) {
        if (i === visualizeMovesPairs.length - 1) {
            visualizeMovesPairs.push([visualizeMovesFixed[i], ""]);
        } else {
            visualizeMovesPairs.push([visualizeMovesFixed[i], visualizeMovesFixed[i+1]]);
        }
    }

    return (
        <div className={classes.root}>
            Visualize:
            {visualizeMovesPairs.map((e, i) => {
                return (
                    <div key={i} style={{display: 'flex'}}>
                        <div className={classes.numbering}>{Math.floor(startingPly / 2) + 1 + i}.</div>
                        <div className={classes.move}>{e[0]}</div>
                        <div className={classes.move}>{e[1] ? e[1] : ""}</div>
                    </div>
                )
            })}
        </div>
    );
}

export default Visualize;