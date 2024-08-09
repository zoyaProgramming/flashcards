import ViewSets from "./ViewSets";
import FlashcardMenu from './AddFlashcardMenu'
import zo from '../images/zo.png'
import {LoginForm} from "./userMenu/LoginForm"
import { SignupForm } from "./userMenu/SignupForm";
import { createContext, useContext, useReducer, useState } from "react";
import { loadSetHandler, searchHandler } from "../functions/serverEventHandlers";
import { Form, redirect, useLoaderData } from "react-router-dom";
import { UserSidebar } from "./userMenu/userSidebar";
import SearchResults from "./userMenu/searchResults";
import { searchReducer } from "../functions/searchReducer";
const DarkmodeContext = createContext(" light")
function ProfileIcon({userData, profile_pic}) {
  const isDark = useContext(DarkmodeContext)
  const c = profile_pic;
  return (
    <a className={"a__img-link" + isDark}href={userData.user.user_name}>
      <img className={"img--profile-icon" + isDark} src={c} height={300} width={300}>
      </img>
    </a>
  )
}


function SearchBar(){
  const isDark = useContext(DarkmodeContext);
  const [searchResults, searchDispatch] = useReducer(searchReducer, {
  });
  const [input, setInput] = useState(null)
  
  return (
    <>
      <Form method="get" action="/search/sets" style={{ display: 'flex', justifyContent: 'center', padding: '20px', width: '100%', minWidth: '0'}} >
        <input placeholder="Search" name="term"className={"input--search " + isDark} onChange={(event) => setInput(event.target.value)}></input>
        <button type= "submit" className= {"material-symbols-outlined bttn--search" + isDark}>search</button>
      </Form>
    
    </>
  )
}


export default function CreateHeader({userDispatch, dataDispatch, userData, data, profile_pic, setProfilePic, setSidebarOpen, sidebarOpen, darkContext}) {

  const isDark = useContext(darkContext)
  const [isLoginFormOpen, setLoginFormOpen] = useState(false)
  const [isSignupFormOpen, setSignupFormOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [formsOpen, setFormsOpen] = useState({login: false, signup: false})
  function onLoadSetBttnClick(){
    if(!data || !data.data){
      console.log('nothing to load')
    }
    else{
      console.log(data.data.sets)
      setIsOpen(!isOpen)
    }
  }
  if(userData.user){
      return(
        
      <DarkmodeContext.Provider value={isDark}>
        <div className={isDark}style={{display:'flex', alignItems:'center'}}>
          <button className={"menu--button material-symbols-outlined " + isDark} onClick={() => {setSidebarOpen(!sidebarOpen)}}>menu</button>
          <SearchBar></SearchBar>
        </div>
      
        <span className ={isDark} >
          
          <h1 className={"h1--navbar" + isDark}><a href="/">Flashcards</a></h1>
        </span>
        <header className={"header--navbar" + isDark}> 
          
          <div className={"div--navbar" + isDark}style={{display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', columnGap: '3vw'}}>
            
          <ProfileIcon userData = {userData} profile_pic={profile_pic}></ProfileIcon>
          
            <h1 className={"h1--header--username" + isDark}> {userData.user.user_name}</h1>
            <button className = {'bttn--navbar' + isDark} onClick={onLoadSetBttnClick}>select set</button>

            <button className = {'bttn--navbar' + isDark} onClick={onLoadSetBttnClick}></button>
          </div>
          
        </header>
        
        <ViewSets isOpen={isOpen} setIsOpen={setIsOpen} data={data} dataDispatch={dataDispatch}></ViewSets>
        </DarkmodeContext.Provider>
    )
  } else if(userData.loading) {
    return (
      <header className={"header--navbar" + isDark}> 
        <div className={"div--navbar" + isDark}>
          <h1 className={"h1--navbar" + isDark}>Flashcards</h1>
          <h1 className={"h1--navbar" + isDark}>Logging in...</h1>
        </div>
      </header>
    )
  } else if(userData.error) {
    return(
        <>

          <header className={"header--navbar" + isDark}>
            <div className={"div--navbar" + isDark}>
              <h1 className={"h1--navbar" + isDark} onClick={()=>{redirect('/balls')}}>Flashcards</h1>
              {formsOpen.login?<LoginForm setProfilePic= {setProfilePic} setFormsOpen={setFormsOpen} userDispatch={userDispatch} dataDispatch={dataDispatch}></LoginForm>
              :null}
            {formsOpen.signup?<SignupForm setFormsOpen = {setFormsOpen} userDispatch={userDispatch} dataDispatch={dataDispatch} formsOpen={formsOpen}> </SignupForm>
            :null}
           
              <button className= {'bttn--navbar' + isDark} onClick={() => {setFormsOpen({login: !formsOpen.login, signup: false})}}>login</button>
              <button className = {'form__bttn--signup' + isDark} onClick={()=>{setFormsOpen({signup: !formsOpen.signup, login: false})}}>sign up</button>
              
            </div>
            <h1 className = {"error--navbar" + isDark}>Errors:</h1>
              <p>{userData.error}</p>
          </header>
          <ViewSets isOpen={isOpen} setIsOpen={setIsOpen} data={data} dataDispatch={dataDispatch}></ViewSets>
        </>
    )
  }
  else {
    return(
      <> 
      
     
      <h1>{userData.user}</h1>
        <header className={"header--navbar" + isDark}> 
          <div className={"div--navbar" + isDark}>
            <h1 className={"h1--navbar" + isDark}>Flashcards</h1>
            {formsOpen.login?<LoginForm setProfilePic= {setProfilePic} setFormsOpen={setFormsOpen} userDispatch={userDispatch} dataDispatch={dataDispatch}></LoginForm>
            :null}
            {formsOpen.signup?<SignupForm setFormsOpen = {setFormsOpen} userDispatch={userDispatch} dataDispatch={dataDispatch} formsOpen={formsOpen}> </SignupForm>
            :null}
           
            <button className= {'bttn--navbar' + isDark} onClick={() => {setFormsOpen({login: !formsOpen.login, signup: false})}}>login</button>
            <button className = {' bttn--navbar form__bttn--signup' + isDark} onClick={()=>{setFormsOpen({signup: !formsOpen.signup, login: false})}}>sign up</button>
          </div>
        </header>
       
      </>
    );
  }
}
