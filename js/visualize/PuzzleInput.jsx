import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles({
    root: {
        width: 'max-content',
        padding: 10,
        minHeight: 180
    },
    numberingContainer: {
        width: 35,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    moveContainer: {
        width: 70,
        height: 40,
        marginLeft: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    moveInput: {
        fontSize: 18,
        height: 40,
        padding: 0,
        textAlign: 'center'
    },
    solutionButtonContainer: {
        paddingTop: 15
    },
    solutionButton: {
        padding: '3px 7px',
        fontSize: 14
    }
});

const textInputStyle = {
    textAlign: 'center',
    paddingLeft: 5,
    paddingRight: 5
};

const PuzzleInput = ({ puzzleID, puzzlePly, puzzleMoves }) => {
    const classes = useStyles();

    const playerMove = (puzzlePly % 2 === 0) ? "white" : "black";
    const puzzleMovesPrefix = (puzzlePly % 2 === 0) ? [] : ["..."];
    const puzzleMovesFixed = puzzleMovesPrefix.concat(puzzleMoves);
    const puzzleMovesPairs = [];
    for (let i = 0; i < puzzleMovesFixed.length; i += 2) {
        if (i === puzzleMovesPairs.length - 1) {
            puzzleMovesPairs.push([puzzleMovesFixed[i], ""]);
        } else {
            puzzleMovesPairs.push([puzzleMovesFixed[i], puzzleMovesFixed[i+1]]);
        }
    }

    const [state, setState] = React.useState({
        inputMoves: Array(Math.ceil(puzzleMoves.length / 2)).fill(""),
        inputMovesCorrect: Array(Math.ceil(puzzleMoves.length / 2)).fill(false)
    });

    const {inputMoves, inputMovesCorrect} = state;

    React.useEffect(() => {
        setState(prevState => {
            return {
                inputMoves: Array(Math.ceil(puzzleMoves.length / 2)).fill(""),
                inputMovesCorrect: Array(Math.ceil(puzzleMoves.length / 2)).fill(false)
            }
        })
    }, [puzzleID])

    const showSolution = () => {
        setState(prevState => {
            return {
                inputMoves: inputMoves.map((e, i) => {return puzzleMoves[2*i]}),
                inputMovesCorrect: Array(Math.ceil(puzzleMoves.length / 2)).fill(true),
            }
        })
    };

    return (
        <div className={classes.root}>
            Puzzle Moves:
            {puzzleMovesPairs.map((e, i) => {
                const checkMove = (move) => {
                    const newVal = move === puzzleMoves[2*i];
                    const newInputMovesCorrect = state.inputMovesCorrect.map(
                        (val, j) => {return i === j ? newVal : val}
                    );
                    return newInputMovesCorrect;
                };
                const onInputChange = (e) => {
                    const newVal = e.target.value;
                    const newInputMoves = state.inputMoves.map(
                        (val, j) => {return i === j ? newVal : val}
                    );
                    setState(prevState => {
                        return {
                            ...prevState,
                            inputMoves: newInputMoves,
                            inputMovesCorrect: checkMove(newVal)
                        }
                    });
                    console.log(newVal);
                };
                const textInput = (
                    <TextField
                        key={puzzleID + i}
                        inputProps={{ style: textInputStyle }}
                        variant="outlined"
                        size="small"
                        value={inputMoves[i] || ""}
                        onChange={onInputChange}
                        disabled={inputMovesCorrect[i]} />
                );
                return (
                    <div key={i} style={{display: 'flex'}}>
                        <div className={classes.numberingContainer}>
                                {Math.floor(puzzlePly / 2) + 1 + i}.
                        </div>
                        <div className={classes.moveContainer}>
                                {playerMove === "black" ?
                                    ((i === 0 || inputMovesCorrect[i-1]) ? e[0] : "???") :
                                    textInput}
                            
                        </div>
                        <div className={classes.moveContainer}>
                                {playerMove === "white" ?
                                    (e[1] ? (inputMovesCorrect[i] ? e[1] : "???") : "") :
                                    textInput}
                        </div>
                    </div>
                )
            })}
            <div className={classes.solutionButtonContainer}>
                <div hidden={inputMovesCorrect[inputMovesCorrect.length-1]}>
                    <Button
                        className={classes.solutionButton}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={showSolution}>
                            Show Solution
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PuzzleInput;