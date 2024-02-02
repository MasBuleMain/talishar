import Player from 'interface/Player';
import styles from './ExperimentalTurnWidget.module.css';
import classNames from 'classnames';
import { getGameInfo, submitButton } from 'features/game/GameSlice';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import useSetting from 'hooks/useSetting';
import { MANUAL_MODE } from 'features/options/constants';
import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/Hooks';
import { RootState } from 'app/Store';
import { DEFAULT_SHORTCUTS, PROCESS_INPUT } from 'appConstants';
import useShortcut from 'hooks/useShortcut';
import useSound from 'use-sound';
import passTurnSound from 'sounds/prioritySound.wav';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { shallowEqual } from 'react-redux';

export default function ExperimentalTurnWidget() {
  const [heightRatio, setHeightRatio] = useState(1);

  const canPassPhase = useAppSelector(
    (state: RootState) => state.game.canPassPhase
  );

  const widgetBackground = classNames(styles.widgetBackground, {
    [styles.myTurn]: canPassPhase,
    [styles.ourTurn]: !canPassPhase
  });

  return (
    <div className={styles.widgetContainer}>
      <ActionPointDisplay isPlayer={false} />
      <LifeDisplay isPlayer={false} />
      <PassTurnDisplay />
      <ActionPointDisplay isPlayer />
      <LifeDisplay isPlayer />
    </div>
  );
}

function LifeDisplay(props: Player) {
  const life = useAppSelector((state: RootState) =>
    props.isPlayer ? state.game.playerOne.Life : state.game.playerTwo.Life
  );
  const isManualMode = useSetting({ settingName: MANUAL_MODE })?.value === '1';

  return (
    <div className={styles.life}>
      <div>{life}</div>
      {isManualMode && <ManualModeLife isPlayer={props.isPlayer} />}
    </div>
  );
}

const ManualModeLife = ({ isPlayer }: { isPlayer: Boolean }) => {
  const dispatch = useAppDispatch();
  const onAddResourceClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      submitButton({
        button: {
          mode: isPlayer
            ? PROCESS_INPUT.ADD_1_HP_SELF
            : PROCESS_INPUT.ADD_1_HP_OPPOENNT
        }
      })
    );
  };
  const onSubtractResourceClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      submitButton({
        button: {
          mode: isPlayer
            ? PROCESS_INPUT.SUBTRACT_1_HP_SELF
            : PROCESS_INPUT.SUBTRACT_1_HP_OPPONENT
        }
      })
    );
  };
  return (
    <div className={styles.manualMode}>
      <button className={styles.drawButton} onClick={onAddResourceClick}>
        <AiOutlinePlus />
      </button>
      <button className={styles.drawButton} onClick={onSubtractResourceClick}>
        <AiOutlineMinus />
      </button>
    </div>
  );
};

export function ActionPointDisplay(props: Player) {
  const APAvailable = useAppSelector((state: RootState) =>
    Math.max(
      state.game.playerOne.ActionPoints ?? 0,
      state.game.playerTwo.ActionPoints ?? 0
    )
  );
  const amIActivePlayer = useAppSelector(
    (state: RootState) => state.game.amIActivePlayer
  );
  const gameInfo = useAppSelector(getGameInfo, shallowEqual);
  const isManualMode = useSetting({ settingName: MANUAL_MODE })?.value === '1';

  const showAPDisplay =
    (amIActivePlayer && props.isPlayer) || gameInfo.playerID === 3;

  return (
    <>
      <AnimatePresence>
        {showAPDisplay ? (
          <motion.div
            className={classNames(styles.actionPointDisplay, {
              [styles.actionPointsPlayer]: props.isPlayer,
              [styles.actionPointsOpponent]: !props.isPlayer
            })}
            initial={{ y: props.isPlayer ? -50 : 50 }}
            animate={{ y: 0 }}
          >
            <div
              className={styles.actionPointCounter}
            >{`${APAvailable} AP`}</div>
            {isManualMode && <ManualMode />}
          </motion.div>
        ) : (
          <div></div>
        )}
      </AnimatePresence>
    </>
  );
}

const ManualMode = () => {
  const dispatch = useAppDispatch();
  const onAddResourceClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      submitButton({
        button: {
          mode: PROCESS_INPUT.ADD_ACTION_POINT
        }
      })
    );
  };
  const onSubtractResourceClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      submitButton({
        button: {
          mode: PROCESS_INPUT.SUBTRACT_ACTION_POINT
        }
      })
    );
  };
  return (
    <div className={styles.manualMode}>
      <button className={styles.drawButton} onClick={onAddResourceClick}>
        <AiOutlinePlus />
      </button>
      <button className={styles.drawButton} onClick={onSubtractResourceClick}>
        <AiOutlineMinus />
      </button>
    </div>
  );
};

export function PassTurnDisplay() {
  const canPassPhase = useAppSelector(
    (state: RootState) => state.game.canPassPhase
  );
  const hasPriority = useAppSelector(
    (state: RootState) => state.game.hasPriority
  );
  const frameNumber = useAppSelector(
    (state: RootState) => state.game.gameDynamicInfo.lastUpdate
  );
  const [showAreYouSureModal, setShowAreYouSureModal] =
    useState<boolean>(false);
  const [canPassController, setCanPassController] = useState<boolean>(false);
  const [playPassTurnSound] = useSound(passTurnSound);
  const preventPassPrompt = useAppSelector(
    (state: RootState) => state.game.preventPassPrompt
  );

  const dispatch = useAppDispatch();

  useMemo(() => {
    if (hasPriority) {
      playPassTurnSound();
    }
  }, [frameNumber]);

  useEffect(() => {
    let link = document.getElementById('favicon') as HTMLLinkElement;
    if (hasPriority && link) {
      link.href = '/images/priorityGreen.ico';
    } else if (link) {
      link.href = '/images/priorityGrey.ico';
    }
  }, [hasPriority]);

  const onPassTurn = () => {
    if (preventPassPrompt && !showAreYouSureModal) {
      setShowAreYouSureModal(true);
    } else {
      dispatch(submitButton({ button: { mode: PROCESS_INPUT.PASS } }));
    }
    setCanPassController(true);
  };

  useShortcut(DEFAULT_SHORTCUTS.PASS_TURN, onPassTurn);

  const clickYes = (e: any) => {
    e.preventDefault();
    console.log('yes!');
    setShowAreYouSureModal(false);
    dispatch(submitButton({ button: { mode: PROCESS_INPUT.PASS } }));
  };

  const clickNo = (e: any) => {
    e.preventDefault();
    console.log('no!');
    setShowAreYouSureModal(false);
  };

  if (canPassPhase === undefined) {
    return (
      <div
        className={classNames(styles.passTurnDisplay, styles.passTurnInactive)}
      ></div>
    );
  }

  if (canPassPhase === true) {
    return (
      <>
        <div
          className={classNames(styles.passTurnDisplay, styles.passTurnActive)}
          onClick={onPassTurn}
        >
          <div className={styles.passText}>PASS</div>
          <div className={styles.subThing}>[spacebar]</div>
        </div>
        {showAreYouSureModal &&
          createPortal(
            <>
              <dialog open={showAreYouSureModal} className={styles.modal}>
                <article>
                  <header>{preventPassPrompt}</header>
                  <button onClick={clickYes}>YES</button>
                  <button onClick={clickNo}>NO</button>
                </article>
              </dialog>
            </>,
            document.body
          )}
      </>
    );
  }

  if (canPassPhase === false) {
    return (
      <div
        className={classNames(styles.passTurnDisplay, styles.passTurnInactive)}
      >
        WAIT
      </div>
    );
  }

  return null;
}
