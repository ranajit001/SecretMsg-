import { Menu, X,Home,ListOrdered } from 'lucide-react';
import {useNavigate} from 'react-router-dom'

import './Navbar.css'


export const Navbar = ({isOpen,setIsOpen}) => {

    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className='navbar'>

            <div className='hemberger' onClick={toggleMenu}>
                {isOpen ? <X size={40} /> : <Menu size={40} />}
            </div>

            <div>
                <h1><span style={{color:"#FF9F00"}}>Secret</span> <span style={{color:'#309898'}}>Whisper</span></h1>
            </div>
             

            <ul className={`sidebar ${isOpen ? 'open' : ''}`}>
                    <li onClick={()=> navigate('/')}>🏠Home</li>
                    <li>😋New funs are comming soon...💖</li>
            </ul>

            
        </nav>
    );
};
