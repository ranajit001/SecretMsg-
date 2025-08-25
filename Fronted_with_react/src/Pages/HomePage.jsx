import { Navbar } from "../Components/Navbar"
import { Body } from "../Components/Body"



import './HomePage.css'
export const HomePage = ({setIsOpen})=>{

  


    return(
    <div className="homePage">
    {/* <Navbar isOpen={isOpen} setIsOpen={setIsOpen}/> */}
    <Body setIsOpen={setIsOpen}/>

    </div>
    )
}