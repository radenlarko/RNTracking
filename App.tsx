/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Navigation from './src/navigation';
import ContextProvider from './src/store/MainContext';

function App(): JSX.Element {
  return (
    <ContextProvider>
      <Navigation />
    </ContextProvider>
  );
}

export default App;
