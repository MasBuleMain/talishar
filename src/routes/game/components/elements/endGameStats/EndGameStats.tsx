import { Card } from 'features/Card';
import { number } from 'yup';
import { Effect } from '../effects/Effects';
import EndGameMenuOptions from '../endGameMenuOptions/EndGameMenuOptions';
import styles from './EndGameStats.module.css';

export interface EndGameData {
  deckID?: string;
  firstPlayer?: number;
  gameID?: string;
  result?: number;
  turns?: number;
  cardResults: CardResult[];
  turnResults: Map<string, TurnResult>;
  roguelikeGameID?: string;
  endingHealth?: number;
}

export interface CardResult {
  cardId: string;
  blocked: number;
  pitched: number;
  played: number;
  cardName: string;
  pitchValue: number;
}

export interface TurnResult {
  cardsBlocked: number;
  cardsLeft: number;
  cardsPitched: number;
  cardsUsed: number;
  damageDealt: number;
  damageTaken: number;
  resourcesUsed: number;
}

const EndGameStats = (data: EndGameData) => {
  return (
    <div className={styles.cardListContents} data-testid="test-stats">
      <EndGameMenuOptions />
      <div>
        <h2>Card Play Stats</h2>
        <table className={styles.cardTable}>
          <thead>
            <tr>
              <th>Card ID</th>
              <th>Card Name</th>
              <th>Times Played</th>
              <th>Times Blocked</th>
              <th>Times Pitched</th>
            </tr>
          </thead>
          <tbody>
            {!!data.cardResults &&
              data.cardResults?.map((result, ix) => {
                const card: Card = { cardNumber: result.cardId };
                let cardStyle = '';
                switch (result.pitchValue) {
                  case 1:
                    cardStyle = styles.onePitch;
                    break;
                  case 2:
                    cardStyle = styles.twoPitch;
                    break;
                  case 3:
                    cardStyle = styles.threePitch;
                    break;
                  default:
                }
                return (
                  <tr key={`cardList${ix}`}>
                    <td className={styles.card}>
                      <Effect card={card} />
                    </td>
                    <td className={cardStyle}>{result.cardName}</td>
                    <td className={styles.played}>{result.played}</td>
                    <td className={styles.blocked}>{result.blocked}</td>
                    <td className={styles.pitched}>{result.pitched}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Stuff</h2>
        <div>TODO: Add more stuff here</div>
        <div>
          <small>Collision point you're the best</small>
        </div>
      </div>
      <div>
        <h2>Turn Stats</h2>
        <table className={styles.cardTable}>
          <thead>
            <tr>
              <th>Turn Number</th>
              <th>Cards Played</th>
              <th>Cards Blocked</th>
              <th>Cards Pitched</th>
              <th>Resources Used</th>
              <th>Cards Left</th>
              <th>Damage Dealt</th>
              <th>Damage Taken</th>
            </tr>
          </thead>
          <tbody>
            {!!data.turnResults &&
              Object.keys(data.turnResults).map((key, ix) => {
                return (
                  <tr key={`turnList${ix}`}>
                    <td className={styles.turnNo}>{ix + 1}</td>
                    <td className={styles.played}>
                      {/* @ts-ignore */}
                      {data.turnResults[key]?.cardsUsed}
                    </td>
                    <td className={styles.blocked}>
                      {/* @ts-ignore */}
                      {data.turnResults[key]?.cardsBlocked}
                    </td>
                    <td className={styles.pitched}>
                      {/* @ts-ignore */}
                      {data.turnResults[key]?.cardsPitched}
                    </td>
                    <td className={styles.pitched}>
                      {/* @ts-ignore */}
                      {data.turnResults[key]?.resourcesUsed}
                    </td>
                    <td className={styles.pitched}>
                      {/* @ts-ignore */}
                      {data.turnResults[key]?.cardsLeft}
                    </td>
                    <td className={styles.pitched}>
                      {/* @ts-ignore */}
                      {data.turnResults[key]?.damageDealt}
                    </td>
                    <td className={styles.pitched}>
                      {/* @ts-ignore */}
                      {data.turnResults[key]?.damageTaken}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EndGameStats;
