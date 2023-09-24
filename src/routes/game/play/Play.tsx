import { Board } from '../components/board/Board';
import './Play.css';
import LeftColumn from '../components/leftColumn/LeftColumn';
import RightColumn from '../components/rightColumn/RightColumn';
import HandZone from '../components/zones/handZone/HandZone';
import PlayerHand from '../components/zones/playerHand/PlayerHand';
import OptionsMenu from '../components/elements/optionsMenu/OptionsMenu';
import EventsHandler from '../components/elements/eventsHandler/EventsHandler';
import PlayerInputPopUp from '../components/elements/playerInputPopUp/PlayerInputPopUp';
import CardPortal from '../components/elements/cardPortal/CardPortal';
import ChatCardDetail from '../components/elements/chatCardDetail/ChatCardDetail';
import CardListZone from '../components/zones/cardListZone/CardListZone';
import ChainLinkSummaryContainer from '../components/elements/chainLinkSummary/ChainLinkSummary';
import ActiveLayersZone from '../components/zones/activeLayersZone/ActiveLayersZone';
import ExperimentalGameStateHandler from 'app/ExperimentalGameStateHandler';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import useWindowDimensions from 'hooks/useWindowDimensions';
import useShowChatMobile from 'hooks/useShowChatMobile';

function Play() {
  const [cookies, setCookie, removeCookie] = useCookies([
    'experimental',
    'cardSize'
  ]);

  const [width, height] = useWindowDimensions();
  const isPortrait = height > width;
  
  const showChatMobile = useShowChatMobile();

  useEffect(() => {
    if (cookies.cardSize) {
      document.documentElement.style.setProperty(
        '--card-scale',
        cookies.cardSize
      );
    } else {
      document.documentElement.style.setProperty('--card-scale', '1');
    }
  }, [cookies.cardSize]);

  return (
    <div className="centering">
      <div className="app" key="app">
        <ChatCardDetail />
        <LeftColumn />
        <div className="gameZone">
          <HandZone isPlayer={false} />
          <Board />
          <ChainLinkSummaryContainer />
          <HandZone isPlayer />
          {!showChatMobile && <PlayerHand />}
        </div>
      {!isPortrait && <RightColumn />}
      </div>
      {isPortrait && <RightColumn />}
      <CardListZone />
      <ActiveLayersZone />
      <OptionsMenu />
      <PlayerInputPopUp />
      <CardPortal />
      <ExperimentalGameStateHandler />
      <EventsHandler />
    </div>
  );
}

export default Play;
