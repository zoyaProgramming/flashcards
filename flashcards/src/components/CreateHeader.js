import CenterMenu from "./CenterMenu";
import FlashcardMenu from './AddFlashcardMenu'
import {LoginForm} from "./userMenu/LoginForm"
import { SignupForm } from "./userMenu/SignupForm";
import { useState } from "react";
import { loadSetHandler } from "../functions/serverEventHandlers";


export default function CreateHeader({userDispatch, dataDispatch, user, data}) {
  const [isLoginFormOpen, setLoginFormOpen] = useState(false)
  const [isSignupFormOpen, setSignupFormOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  if(user.user){
    return(
      <>
      <h1>{user.user}</h1>
      <header className='header--navbar'> 
        <div className="div--navbar">
          <h1 className="h1--navbar">Flashcards</h1>
          <button className = 'bttn--navbar' onClick={() =>{
            loadSetHandler(dataDispatch)
           setIsOpen(!isOpen)
           }
            }>select set</button>
        </div>
      </header>
      <CenterMenu isOpen={isOpen} setIsOpen={setIsOpen} data={data} dataDispatch={dataDispatch}></CenterMenu>
    </>
    )
  } else if(user.loading) {
    return (
      <header className='header--navbar'> 
        <div className="div--navbar">
          <h1 className="h1--navbar">Flashcards</h1>
          <h1 className="h1--navbar">Logging in...</h1>
        </div>
      </header>
    )
  } else if(user.error) {
    return(
        <>
          <header className='header--navbar'>
            <div className="div--navbar">
              <h1 className="h1--navbar">Flashcards</h1>
              <h1 className = "error--navbar">Errors:</h1>
              <p>{user.error}</p>
            </div>
          </header>
          <CenterMenu isOpen={isOpen} setIsOpen={setIsOpen}></CenterMenu>
        </>
    )
  }
  else {
    return(
      <>
      <h1>{user.user}</h1>
        <header className='header--navbar'> 
          <div className="div--navbar">
            <h1 className="h1--navbar">Flashcards</h1>
            {isLoginFormOpen?<LoginForm setLoginFormOpen={setLoginFormOpen} userDispatch={userDispatch}></LoginForm>
            :null}
            {isSignupFormOpen?<SignupForm setSignupFormOpen = {setSignupFormOpen} userDispatch={userDispatch}> </SignupForm>
            :null}
            <button className = 'bttn--navbar' onClick={() =>{
              loadSetHandler(dataDispatch)
              setIsOpen(!isOpen)
              
              }}>flascards</button>
            <button className= 'bttn--navbar' onClick={() => {setLoginFormOpen(true)}}>login</button>
            <button className = 'form__bttn--signup' onClick={()=>{setSignupFormOpen(true)}}>sign up</button>
          </div>
        </header>
        <CenterMenu isOpen={isOpen} setIsOpen={setIsOpen} data={data} dataDispatch={dataDispatch}></CenterMenu>
        <FlashcardMenu></FlashcardMenu>
      </>
    );
  }
}
