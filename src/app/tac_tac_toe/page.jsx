"use client"
import { useState, useEffect } from 'react';
import React from 'react';
import styles from "./page.module.css"
import WinningScreen from "@/components/WinningScreen";

const Page = () => {
    const [board, setBoard] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState("")
    const [win, setWin] = useState(false)

    useEffect(() => {
        if (currentPlayer === 'O') {
            computerMove();
        }
    }, [currentPlayer]);

    const placeMark = (x, y) => {
        if (board[x][y] === null) {
            setBoard(prevBoard => {
                const newBoard = [...prevBoard];
                newBoard[x][y] = currentPlayer;
                return newBoard;
            });
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
    };

    const computerMove = () => {
        let bestMove = minimax(board, 0, true);
        try {
            setWinner("")
            setCurrentPlayer("X")
            placeMark(bestMove.cell[0], bestMove.cell[1]);
        } catch {
            if (checkWin() === "X") {
                setWinner("первый игрок победил")
                setWin(true)
            }
            else {
                setWinner("второй игрок победил")
                setWin(true)
            }
            setBoard(Array(3).fill(null).map(() => Array(3).fill(null)))
        }

    };


    const checkWin = () => {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] !== null && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
                return board[i][0];
            }
            if (board[0][i] !== null && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
                return board[0][i];
            }
        }
        if (board[0][0] !== null && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            return board[0][0];
        }
        if (board[0][2] !== null && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            return board[0][2];
        }
        return null;
    };

    function getEmptyCells(board) {
        let cells = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!board[i][j]) {
                    cells.push([i, j]);
                }
            }
        }
        return cells;
    }

    function isTerminal(board) {
        return checkWin(board) || board.every(row => row.every(cell => cell));
    }

    function minimax(board, depth, maximizingPlayer) {
        if (isTerminal(board)) {
            let winner = checkWin(board);
            if (winner === 'X') return { score: 10 - depth };
            else if (winner === 'O') return { score: depth - 10 };
            else return { score: 0 };
        }

        if (maximizingPlayer) {
            let maxEval = { score: -Infinity };
            let cells = getEmptyCells(board);
            for (let cell of cells) {
                let newBoard = JSON.parse(JSON.stringify(board));
                newBoard[cell[0]][cell[1]] = 'X';
                let eval_value = minimax(newBoard, depth + 1, false);
                if (eval_value.score > maxEval.score) {
                    maxEval = eval_value;
                    maxEval.cell = cell;
                }
            }
            return maxEval;
        } else {
            let minEval = { score: Infinity };
            let cells = getEmptyCells(board);
            for (let cell of cells) {
                let newBoard = JSON.parse(JSON.stringify(board));
                newBoard[cell[0]][cell[1]] = 'O';
                let eval_value = minimax(newBoard, depth + 1, true);
                if (eval_value.score < minEval.score) {
                    minEval = eval_value;
                    minEval.cell = cell;
                }
            }
            return minEval;
        }
    }

    return (
        <div>
            <div className={styles.main}>
                {
                    board.map((row, indexRow) => {
                        return (<div key={indexRow} className={styles.row}>
                            {
                                row.map((column, indexColumn) => {
                                    return (<div key={indexColumn} onClick={() => placeMark(indexRow, indexColumn)}
                                                 className={styles.cell}>
                                        {column}
                                    </div>)
                                })
                            }
                        </div>)
                    })
                }
                <WinningScreen setIsOpen={setWin} isOpen={win}>{winner}</WinningScreen>
            </div>
        </div>
    );
};

export default Page;