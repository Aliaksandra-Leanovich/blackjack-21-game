import { useEffect, useState } from "react";
import "../../App.css";
import { cardsApi } from "../../services/CardsService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getDeckId, getUserBudget, getUserPoints } from "../../store/selectors";
import { fetchDeckId } from "../../store/slices/deckIdSlice";
import { unsetUserHand } from "../../store/slices/userSlices";
import { ICard } from "../../store/types";
import { BetForm } from "../BetForm";
import { Button } from "../Button";
import { setDealersHand, setDealersPoints } from "./dealersPoints";
import { PlayerHand } from "../PlayerHand";
import { GameStatus } from "./types";

export const Game = () => {
  const dispatch = useAppDispatch();

  const pointsPlayer = useAppSelector(getUserPoints);
  const { deckId } = useAppSelector(getDeckId);
  const budget = useAppSelector(getUserBudget);

  const [countDealer, setCountDealer] = useState(0);
  const [cardsForPlayer, setCardsForPlayer] = useState<ICard[]>([]);
  const [winner, setWinner] = useState<"dealer" | "player" | "tie" | null>(
    null
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.notstarted
  );

  // const setDealersHand = async (initialScore: number = 0): Promise<number> => {
  //   const card: ICard[] = await cardsApi.getNewCard(deckId, 1);
  //   const cardScore = getCardScore(card[0]);

  //   const actualScore = initialScore + cardScore;

  //   if (actualScore < 21) {
  //     return setDealersHand(actualScore);
  //   }

  //   return actualScore;
  // };

  useEffect(() => {
    dispatch(fetchDeckId());
  }, [pointsPlayer, dispatch, gameStatus]);

  const onStartSubmit = () => {
    setWinner(null);
    setCountDealer(0);
    setGameStatus(GameStatus.start);
    dispatch(unsetUserHand());
    setCardsForPlayer([]);
  };

  const onFirstSubmit = async () => {
    setGameStatus(GameStatus.inprogress);
    setCardsForPlayer(await cardsApi.getNewCard(deckId, 2));
  };

  const onSubmit = async () => {
    setCardsForPlayer(await cardsApi.getNewCard(deckId, 1));
  };

  const onStopSubmit = async () => {
    setGameStatus(GameStatus.finished);

    setCountDealer(await setDealersPoints(deckId));

    setStopGame();
  };

  const setStopGame = () => {
    if (pointsPlayer < 21) {
      if (countDealer < 21) {
        if (pointsPlayer < countDealer) {
          setWinner("dealer");
        } else {
          setWinner("player");
        }
      } else {
        setWinner("player");
      }
    }
    if (pointsPlayer > 21) {
      if (countDealer > 21) {
        if (countDealer < pointsPlayer) {
          setWinner("dealer");
        } else if (countDealer > pointsPlayer) {
          setWinner("player");
        }
      } else {
        setWinner("dealer");
      }
    }
    if (pointsPlayer === 21) {
      setWinner("player");
      if (countDealer === 21) {
        setWinner("tie");
      }
    }

    return " ";
  };

  return (
    <div>
      <div>
        {gameStatus === "finished" ? (
          <p>The winner is... {winner}</p>
        ) : (
          <p>Good luck!</p>
        )}
      </div>
      <div
        className={
          gameStatus === "notstarted" || gameStatus === "finished"
            ? "block-start"
            : "block-start-hidden"
        }
      >
        {budget < 0 ? (
          <>
            <p>sorry, you dont have money left</p>
          </>
        ) : (
          <>
            <Button type="submit" handleClick={onStartSubmit}>
              START NEW GAME
            </Button>
          </>
        )}
      </div>
      <div
        className={
          gameStatus === "start" ? "block-start" : "block-start-hidden "
        }
      >
        <BetForm
          winner={winner}
          onFirstSubmit={onFirstSubmit}
          gameStatus={gameStatus}
        />
      </div>
      <div
        className={
          gameStatus === "inprogress" ? "block-start" : "block-start-hidden "
        }
      >
        <Button
          type="submit"
          handleClick={onSubmit}
          disabled={
            gameStatus === "notstarted" || gameStatus === "finished"
              ? true
              : false
          }
        >
          New Card
        </Button>
        <Button
          type="submit"
          handleClick={onStopSubmit}
          disabled={
            gameStatus === "notstarted" || gameStatus === "finished"
              ? true
              : false
          }
        >
          Stop
        </Button>

        <p>Player's points: {pointsPlayer}</p>
      </div>

      <PlayerHand cards={cardsForPlayer} />
      <div>
        {gameStatus === "finished" && countDealer > 0 ? (
          <div>
            <p>Dealer's points: {countDealer}</p>
            <p>Player's points: {pointsPlayer}</p>
          </div>
        ) : (
          " "
        )}
      </div>
    </div>
  );
};
