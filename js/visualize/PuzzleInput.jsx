import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const useStyles = makeStyles({
    root: {
        width: 'max-content',
        padding: 10,
        minHeight: 180
    },
    numbering: {
        width: 35,
        height: 35
    },
    move: {
        width: 70,
        height: 35,
        textAlign: 'center'
    },
    moveInput: {
        height: 35,
        padding: 0,
        textAlign: 'center',
        fontSize: 18
    },
    solutionButtonContainer: {
        paddingTop: 15
    },
    solutionButton: {
        padding: '3px 7px',
        fontSize: 16
    }
});

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
                return (
                    <div key={i} style={{display: 'flex'}}>
                        <div className={classes.numbering}>
                            {Math.floor(puzzlePly / 2) + 1 + i}.
                        </div>
                        <div className={classes.move}>
                            {playerMove === "black" ?
                             ((i === 0 || inputMovesCorrect[i-1]) ? e[0] : "???") :
                             <Form.Control
                                key={puzzleID + i}
                                className={classes.moveInput}
                                value={inputMoves[i] || ""}
                                onChange={onInputChange}
                                disabled={inputMovesCorrect[i]} />}
                        </div>
                        <div>
                            {playerMove === "white" ?
                             (e[1] ? 
                                <div className={classes.move}>
                                    {(inputMovesCorrect[i] ? e[1] : "???")}
                                </div> : "") :
                             <div className={classes.move}>
                                 <Form.Control
                                     key={puzzleID + i}
                                     className={classes.moveInput}
                                     value={inputMoves[i] || ""}
                                     onChange={onInputChange}
                                     disabled={inputMovesCorrect[i]} />
                             </div>}
                        </div>
                    </div>
                )
            })}
            <div className={classes.solutionButtonContainer}>
                <Button
                    className={classes.solutionButton}
                    variant="secondary"
                    hidden={inputMovesCorrect[inputMovesCorrect.length-1]}
                    onClick={showSolution}>
                        Show Solution
                </Button>
            </div>
        </div>
    );
}

export default PuzzleInput;