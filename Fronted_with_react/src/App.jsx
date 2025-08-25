import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Navbar } from './Components/Navbar'

import { HomePage } from "./Pages/HomePage";
import { SendMessage } from './Components/SendMsg';
import { Footer } from './Components/Footer';
import { useState } from 'react';


function App() {
      const [isOpen, setIsOpen] = useState(false);


  return (
    <>
<BrowserRouter> 
<Navbar isOpen={isOpen} setIsOpen={setIsOpen}/>
  <Routes>
    <Route path='/' element={ <HomePage setIsOpen={setIsOpen}/>}/>
     <Route path='/whisper/:id' element={ <SendMessage/>}/>
  </Routes>
      <Footer/>
</BrowserRouter>

    </>
  )
}

export default App
