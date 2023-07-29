import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'app/Store';
import { createRoot } from 'react-dom/client';
import PlayerHandCard from './PlayerHandCard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <Provider store={store}>
      <PlayerHandCard
        card={{ cardNumber: 'WTR001' }}
        addCardToPlayedCards={() => {}}
      />
    </Provider>
  );
});

it('renders a card', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <Provider store={store}>
      <PlayerHandCard
        card={{ cardNumber: 'WTR001' }}
        addCardToPlayedCards={() => {}}
      />
    </Provider>
  );
});
