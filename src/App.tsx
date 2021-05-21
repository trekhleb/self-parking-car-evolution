import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Layout from './components/shared/Layout';
import HomeScreen from './components/screens/HomeScreen';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <HomeScreen />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
