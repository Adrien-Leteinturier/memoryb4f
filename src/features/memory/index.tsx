import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Card from "../../components/card";
import Timer from "../../components/timer";
import Comment from "../../components/commentaire";
import randomArray from "../../utils/randomArray";
import { revertCard, selectRevertCards, statusGame, cardPairs, selectPairCards, reset } from "./memorySlice";
import { Data } from "./data";
import styles from './memory.module.css';
import { GameStatus } from "../../app/types";

const Memory = () => {
  const dispatch = useAppDispatch();
  const [DataMemory, setDataMemory] = useState(Data);
  const [comment, setComment] = useState(false);
  const revertCards = useAppSelector(selectRevertCards);
  const pairCards = useAppSelector(selectPairCards);
  let currentCardId;

  function onCardClick(card) {
    currentCardId = card.id;
    dispatch(revertCard(currentCardId));
  };

  useEffect(() => {
    setDataMemory(randomArray(Data));
  }, []);

  useEffect(() => {
    if (revertCards.length === 2) {
      dispatch(statusGame(GameStatus.NotStarted));
      if (!revertCards[0].startsWith(revertCards[1].slice(0, -1))) {
        setTimeout(() => {
          dispatch(revertCard(revertCards[0]));
          dispatch(revertCard(revertCards[1]));
          dispatch(statusGame(GameStatus.started));
        }, 800);
      } else {
        dispatch(cardPairs(revertCards[0]));
        dispatch(cardPairs(revertCard[1]));
        dispatch(revertCard(revertCards[0]));
        dispatch(revertCard(revertCard[1]));
        dispatch(statusGame(GameStatus.started));
      }
    }
  }, [revertCards.length]);

  useEffect(() => {
    if (pairCards.length === 16) {
      setTimeout(() => {
        onGameFinished();
      }, 800);
    }
  }, [pairCards.length]);

  const onGameFinished = () => {
    dispatch(statusGame(GameStatus.Ended));
    setComment(true);
  };

  const restart = () => {
    console.log('RESTART')
    dispatch(reset());
    setDataMemory(randomArray(Data));
    setComment(false);
  };

  return (
    <div>
      <h1 style={{ color: 'white'}}> B4F - MEMORY</h1>
      <Timer
        progress={!GameStatus.started}
        onFinished={onGameFinished}
      />

      <Comment
        victory={pairCards.length === 16}
        closePopup={restart}
        popup={comment}
      />

      <div className={styles.container}>
        <div className={styles.grill}>
          {DataMemory.map((res, id) => {
            return (
              <Card
                card={res}
                hidden={revertCards.includes(res.id) || pairCards.includes(res.id)}
                onChildClick={onCardClick}
                key={id}
              />
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Memory;
