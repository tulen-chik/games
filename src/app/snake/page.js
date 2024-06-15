"use client"
import React, { useState, useEffect } from 'react';
import styles from "./page.module.css"

const getRandomCoordinates = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
    let y =  Math.floor((Math.random()*(max-min+1)+min)/2)*2;
    return [x,y]
}

const initialState = {
    food: getRandomCoordinates(),
    speed: 200,
    direction: 'RIGHT',
    snakeDots: [
        [0,0],
        [2,0]
    ]
}

const Page = () => {
    const [state, setState] = useState(initialState);
    const [nextDirection, setNextDirection] = useState(null);

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    useEffect(() => {
        checkIfOutOfBorders();
        checkIfCollapsed();
        checkIfEat();
    }, [state]);

    useEffect(() => {
        const interval = setInterval(moveSnake, state.speed);
        return () => clearInterval(interval);
    }, [state.speed]);


    const onKeyDown = (e) => {
        e = e || window.event;
        let direction = state.direction;
        switch (e.keyCode) {
            case 38:
                direction = 'UP';
                break;
            case 40:
                direction = 'DOWN';
                break;
            case 37:
                direction = 'LEFT';
                break;
            case 39:
                direction = 'RIGHT';
                break;
        }
        setState(prevState => ({...prevState, direction}));
    }

    const moveSnake = () => {
        setState(prevState => {
            let dots = [...prevState.snakeDots];
            let head = dots[dots.length - 1];
            let direction = nextDirection || prevState.direction;

            switch (direction) {
                case 'RIGHT':
                    head = [head[0] + 2, head[1]];
                    break;
                case 'LEFT':
                    head = [head[0] - 2, head[1]];
                    break;
                case 'DOWN':
                    head = [head[0], head[1] + 2];
                    break;
                case 'UP':
                    head = [head[0], head[1] - 2];
                    break;
            }
            dots.push(head);
            dots.shift();
            return {...prevState, snakeDots: dots, direction};
        });
    }

    const checkIfOutOfBorders = () => {
        let head = state.snakeDots[state.snakeDots.length - 1];
        if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
            gameOver();
        }
    }

    const checkIfCollapsed = () => {
        let snake = [...state.snakeDots];
        let head = snake[snake.length - 1];
        snake.pop();
        snake.forEach(dot => {
            if (head[0] === dot[0] && head[1] === dot[1]) {
                gameOver();
            }
        })
    }

    const checkIfEat = () => {
        let head = state.snakeDots[state.snakeDots.length - 1].toString();
        let food = state.food.toString();
        if (head === food) {
            setState(prevState => ({...prevState, food: getRandomCoordinates()}));
            enlargeSnake();
            increaseSpeed();
        }
    }

    const enlargeSnake = () => {
        let newSnake = [...state.snakeDots];
        // Add a new dot at the end of the snake
        newSnake.push([]);
        setState(prevState => ({...prevState, snakeDots: newSnake}));
    }

    const increaseSpeed = () => {
        if (state.speed > 10) {
            setState({...state, speed: state.speed - 10});
        }
    }

    const gameOver = () => {
        alert(`Game Over. Snake length is ${state.snakeDots.length}`);
        setState(initialState);
    }

    const renderSnake = () => {
        return (
            state.snakeDots.map((dot, i) => {
                const style = {
                    left: `${dot[0]}%`,
                    top: `${dot[1]}%`
                }
                return (
                    <div className={styles.snake_dot} key={i} style={style}></div>
                )
            })
        )
    }

    const renderFood = () => {
        const style = {
            left: `${state.food[0]}%`,
            top: `${state.food[1]}%`
        }
        return (
            <div className={styles.food_dot} style={style}></div>
        )
    }

    return (
        <div className={styles.game_area}>
            {renderSnake()}
            {renderFood()}
        </div>
    );

}

export default Page;
