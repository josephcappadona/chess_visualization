import '../../css/visualize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from "@material-ui/core/styles";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import PuzzleParams from './PuzzleParams.jsx';
import Visualize from './Visualize.jsx';
import PuzzleInput from './PuzzleInput.jsx';
import { isEmpty, format, formatTimeControl } from './utils.jsx';

import Chessground from 'react-chessground'
import 'react-chessground/dist/styles/chessground.css'

const axios = require('axios').default;
const HOST = 'https://' + window.location.host;

const useStyles = makeStyles({
    root: {
        display: 'flex',
        width: 'max-content',
        margin: '40px auto',
        flexWrap: 'wrap-reverse'
    },


    leftHalf: {
        paddingLeft: 10,
        margin: '0 auto'
    },

    board: {
        margin: '0 30px 30px 0'
    },
    underBoard: {
        fontSize: 20,
        width: 500
    },
    topLine: {
        display: 'flex',
        paddingBottom: 10
    },
    gameURL: {},
    rating: {
        marginLeft: 'auto'
    },
    matchInfo: {
        fontSize: 15
    },
    openingInfo: {
        fontSize: 15,
        wordBreak: 'break-all'
    },


    rightHalfContainer: {
    },
    rightHalf: {
        paddingLeft: 10,
    },
    
    paramsContainer: {
        display: 'flex',
        minHeight: 300
    },
    params: {
        width: 'max-content'
    },
    buttonContainer: {
        display: 'flex',
        padding: '0 0 0 10px'
    },
    loadPuzzleButton: {
        fontSize: 18
    },
    buttonAdjacent: {
        margin: 'auto 10px'
    },

    vizAndMoveContainer: {
        display: 'flex',
        width: 560
    },
    vizAndMove: {
        display: 'flex',
        width: 'max-content',
        margin: 'auto',
        fontSize: 20
    },

    vizContainer: {
        padding: 20
    },
    viz: {
        width: 'max-content',
        margin: '0 auto'
    },

    puzzleContainer: {
        padding: 20
    },
    puzzle: {
        width: 230,
        margin: '0 auto'
    },

});

function App(props) {
    const classes = useStyles();

    const [state, setState] = React.useState({
        puzzleParams: {
            ratingRange: [900, 1300],
            pliesBackward: 1
        },
        curPuzzle: {},
        prevPuzzles: [],
        puzzleLoading: false,
        responseMessage: ""
    });

    const {
        puzzleParams,
        curPuzzle,
        prevPuzzles,
        puzzleLoading,
        responseMessage
    } = state;

    const puzzleParamsCallback = (newParams) => {
        setState(prevState => {return {...prevState, puzzleParams: newParams}});
        console.log(newParams);
    };

    const loadPuzzles = () => {
        setState(prevState => {return { ...prevState, puzzleLoading: true }});
    };

    React.useEffect(() => {
        if (puzzleLoading) {
            const json = JSON.stringify({ ...puzzleParams, prevPuzzles });
            console.log(json);
            const params = {
                headers: {'Content-Type': 'application/json'}
            };
            axios.post(HOST + '/api/puzzles', json, params)
                .then(response => {
                    console.log('response.data', response.data);
                    const message = response.data.message;
                    if (response.data.puzzles.length > 0) {
                        const newPuzzle = response.data.puzzles[0];
                        setState(prevState => {
                            return {
                                ...prevState,
                                curPuzzle: newPuzzle,
                                prevPuzzles: [...prevPuzzles, newPuzzle.puzzleId],
                                puzzleLoading: false,
                                responseMessage: message
                            };
                        });
                    } else {
                        setState(prevState => {
                            return {
                                ...prevState,
                                curPuzzle: {},
                                puzzleLoading: false,
                                responseMessage: message
                            };
                        });
                    }
            });
        }
    }, [puzzleLoading]);

    
    return (
        <div id="vizRoot" className={classes.root}>

            <div className={classes.leftHalf}>

                <div className={classes.board}>
                    <Chessground
                        fen={
                            isEmpty(curPuzzle) ?
                            "8/8/8/8/8/8/8/8 w - - 0 1" :
                            curPuzzle.startingFEN
                        }
                        viewOnly={true}
                        orientation={
                            isEmpty(curPuzzle) 
                                || curPuzzle.puzzlePly % 2 === 0 ?
                            'white' : 'black'
                        }
                        width={500}
                        height={500}
                    />
                </div>
                
                {!isEmpty(curPuzzle) ?
                    <div className={classes.underBoard}>
                        <div className={classes.topLine}>
                            <div>{ curPuzzle.puzzleURL }</div>
                            <div className={classes.rating}>{ "Rating: " + curPuzzle.rating }</div>
                        </div>
                        <div className={classes.matchInfo}>
                            { format("[%s] %s (%s) vs %s (%s)", 
                                     [formatTimeControl(curPuzzle.headers.TimeControl),
                                      curPuzzle.headers.White,
                                      curPuzzle.headers.WhiteElo,
                                      curPuzzle.headers.Black,
                                      curPuzzle.headers.BlackElo]) }</div>
                        <div className={classes.openingInfo}>
                            { format("%s: %s", 
                                     [curPuzzle.headers.ECO,
                                      curPuzzle.headers.Opening]) }</div>
                    </div> : ""}
            </div>
            

            <div className={classes.rightHalfContainer}>
                <div className={classes.rightHalf}>
                    <div className={classes.paramsContainer}>
                        <div className={classes.params}>
                            <PuzzleParams callback={puzzleParamsCallback} />
                            <div className={classes.buttonContainer}>
                                <Button
                                    className={classes.loadPuzzleButton}
                                    onClick={loadPuzzles}
                                    disabled={puzzleLoading}>Load Puzzle</Button>
                                <div className={classes.buttonAdjacent}>
                                    {puzzleLoading ?
                                        <Spinner animation="border"/> :
                                        <div>{responseMessage}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.vizAndMoveContainer}>
                        <div className={classes.vizAndMove}>
                            <div className={classes.vizContainer}>
                                <div className={classes.viz}>
                                    { !isEmpty(curPuzzle) ?
                                        <Visualize
                                            startingPly={curPuzzle.startingPly}
                                            visualizeMoves={curPuzzle.visualizeMoves}
                                        /> : ""}
                                </div>
                            </div>
                            <div className={classes.puzzleContainer}>
                                <div className={classes.puzzle}>
                                    { !isEmpty(curPuzzle) ?
                                        <PuzzleInput
                                            puzzleID={curPuzzle.puzzleId}
                                            puzzlePly={curPuzzle.puzzlePly}
                                            puzzleMoves={curPuzzle.puzzleMoves}
                                        /> : ""}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
