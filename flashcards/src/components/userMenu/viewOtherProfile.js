import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  useParams,
  Outlet,
  useLoaderData,
} from "react-router-dom";
import { useDataHook } from "../../hooks/useDataHook";
import { dataReducer } from '../../functions/dataReducer.js';
import { userReducer } from '../../functions/userReducer.js';
import { useState, useReducer, useContext, createContext} from 'react';
import { uploadProfilePic, test} from "../../functions/uploadProfilePic.js";


function SetView({sets}) {
  if(!Array.isArray(sets)) {
    return( <p>This user doesn't have any flashcard sets!</p>) 
  }
  const allSets = sets.map((object)=>{
    return(
      <>
        <a className="link--set">{object.set_name}</a>
        <p className="link--description">{object.description}</p>
      </>
    )
  })
  
  return(
    <div className="div--set-list">
      <ul className="ul--set-list">
        {allSets}
      </ul>
    </div>
  )
}


export function UserProfile({useParams}) {
  const loaded = useLoaderData();
  const [picSrc, setPicSrc] = useState(null)
  const user = loaded.user;
  const data = loaded.sets;
  //const [editProfilePicOpen, setEditProfilePicOpen] = useState(false)
  

    

  //const getData = useDataHook(userDispatch, dataDispatch, setPicSrc)
  var pp = null;
  if(!user) {
    return(<p>loading {JSON.stringify(user.user_name) + JSON.stringify(data)}</p>)
  }
  
  return (
    
    <div className="body--profile">
  
      <img className="img--profile-icon" src={picSrc}style={{height: '100px', width: '100px', margin: 'auto', display: 'block', marginTop: '5vh'}}></img>
      
      <h1 className="h1--username roboto-regular" >{user.user_name}</h1>
      <p style={{display: 'block', width: '100%', height: '20vh'}}>{user.profile_description}</p>
        <SetView sets={data}></SetView>
    </div>)
  
}
