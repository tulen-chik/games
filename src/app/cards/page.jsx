"use client"
import React, {useCallback, useState} from 'react';
import styles from "./page.module.css"
import Image from "next/image";
import WinningScreen from "../../components/WinningScreen";

let cards = [
    "8a.png",
    "10k.png",
    "acea.png",
    "aceheart.png",
    "joker.png",
    "kingk.png",
    "queen_heart.png"
]

const Page = () => {
    const [card, setCard] = useState(cards.concat(cards).sort(() => Math.random() - 0.5));
    const [chosen, setChosen] = useState(null);
    const [chosenIndex, setChosenIndex] = useState(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [opened, setOpened] = useState(Array(card.length).fill(false));
    const [permanent, setPermanent] = useState(Array(card.length).fill(false));
    const [win, setWin] = useState(false)

    const cardHandler = useCallback((index) => {
        if (!permanent[index] && !isFlipping) {
            const newOpened = [...opened];
            newOpened[index] = true;
            setOpened(newOpened);
            if (chosen === card[index]) {
                const newPermanent = [...permanent];
                newPermanent[chosenIndex] = true;
                newPermanent[index] = true;
                setPermanent(newPermanent);
                setChosen(null);
                setChosenIndex(null);
                if (newPermanent.every(val => val === true)) {
                    setWin(true)
                }
            } else {
                if (chosenIndex !== null) {
                    setIsFlipping(true);
                    setTimeout(() => {
                        newOpened[chosenIndex] = false;
                        newOpened[index] = false;
                        setOpened(newOpened);
                        setIsFlipping(false);
                        setChosen(null);
                        setChosenIndex(null);
                    }, 1000);
                } else {
                    setChosen(card[index]);
                    setChosenIndex(index);
                }
            }
        }
    }, [chosen, chosenIndex, isFlipping, opened, permanent]);

    return (
        <div className={styles.main_inside}>
            <WinningScreen isOpen={win} setIsOpen={setWin}>you won</WinningScreen>
            <div className={styles.main}>
                {
                    card.map((car, index) => (
                        <Image key={index} onClick={() => cardHandler(index)} src={opened[index] ? "/" + car : "/back.png"} alt={"card"} width={100} height={200}/>
                    ))
                }
            </div>
        </div>
    );
};

export default Page;