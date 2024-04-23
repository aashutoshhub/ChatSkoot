import { Button } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './Pages/Chat';
import Home from './Pages/Home';
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <div className='App'>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/chat' element={<Chat />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
