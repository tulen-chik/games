"use client"
import React, { useState } from 'react';
import styles from './WinningScreen.module.css';

const WinningScreen = ({isOpen, setIsOpen, children}) => {
    const closeModal = () => {
        setIsOpen(false);
    }

    return (
        isOpen ?
            (<div className={styles.overlay}>
                <div className={styles.modal}>
                    {children}
                    <button onClick={closeModal}>Close Modal</button>
                </div>
            </div>) : (<div></div>)
    );
};

export default WinningScreen;
