import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RestaurantMenu from "./components/RestaurantMenu";
import { ChakraProvider } from '@chakra-ui/react';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
        <Route path="/:restaurantId" element={<RestaurantMenu />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
