import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Admin from './pages/admin';
import Login from './pages/login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}> </Route>
          <Route path='//*' element={<Admin/>}> </Route>
          <Route path="*" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
