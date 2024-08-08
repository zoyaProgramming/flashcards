import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  useParams,
  Outlet,
  Form
} from "react-router-dom";
import { useDataHook } from "../../hooks/useDataHook";
import { dataReducer } from '../../functions/dataReducer.js';
import { userReducer } from '../../functions/userReducer.js';

import { useState, useReducer, useContext, createContext} from 'react';
import { uploadProfilePic, test} from "../../functions/uploadProfilePic.js";


// this should change the current user's table
export function PicSelector({picSrc, setPicSrc}) {
  const [pic, setPic] = useState(null)
  return(
    <div className="div--pic_selector">
    <form onSubmit={( event ) => 
      {
        const url = URL.createObjectURL(pic)
        setPicSrc(url)
        console.log(url)
        uploadProfilePic(pic)
      event.preventDefault()
    }
      }>
      <label htmlFor="img_upload">selecct file</label>
      <input id="img_upload" style={{margin: 'auto'}} type="file"accept="image/png, image/jpeg" onChange={(event) => {
        const obj = event.target;
        const files = obj.files;
        const firstFile = obj.files
        console.log(firstFile[0] instanceof File)
        setPic(files[0])
   //     test(firstFile[0], setPicSrc)
      }}></input>
    <button type="submit">submit</button>
    </form>
    </div>
  )
}

function SetView({sets}) {
  if(!Array.isArray(sets)) {
    return( <p>This user doesn't have any flashcard sets!</p>) 
  }
  const allSets = sets.map((object)=>{
    return(
      <>
        <a className="link--set" href="/:user/sets/:setname">{object.set_name}</a>
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

function EditParagraphForm({user}){
  const [input, setInput] = useState(null);
  return(
    <Form name='description' action={'profile/update'} >
      <label className="label--form" htmlFor="profile-description">description</label>
      <textarea name ="description"id="profile-description" aria-placeholder="description" className="textarea-description" onChange={(event)=>{
      setInput(event.target.value)
    }}></textarea>
    <button  type="submit" className="form__bttn--submit--login">submit</button>
    </Form>
  )

}

export  function ProfileView ({useParams}) {
  const params = useParams()
  const [editMode, setEditMode] = useState(false);
  const [picSrc, setPicSrc] = useState(null)
  const [editProfilePicOpen, setEditProfilePicOpen] = useState(false)
  const [user, userDispatch] = useReducer(userReducer, {
    user: null, 
    loading: false
  })
  //console.log(user)
  const [data, dataDispatch]  = useReducer(dataReducer, 
    {
      data: null, 
      loading: false
    }
  )
  const getData = useDataHook(userDispatch, dataDispatch, setPicSrc)
  var pp = null;
  if(data.data && data.data.profilePic) {
    console.log(data.data.profilePic)
  }

  if(!user.user || !data.data) {
    return(<p>loading {JSON.stringify(user) + JSON.stringify(data)}</p>)
  }
  
  if(!editMode) {return (
    
    <div className="body--profile">
      <button onClick={()=>{setEditMode(!editMode)}}>balls</button>
      <button onClick={() => {setEditProfilePicOpen(!editProfilePicOpen)}}
      style={{background: 'none', border: 'none', width: 'fit-content', height: 'fit-content', display: 'block', margin: 'auto'}}>
        <img className="img--profile-icon" src={picSrc}style={{height: '100px', width: '100px', margin: 'auto', display: 'block', marginTop: '5vh'}}></img>
      </button>
      {editProfilePicOpen?<PicSelector picSrc={picSrc} setPicSrc={setPicSrc}></PicSelector>:null}
      
      <h1 className="h1--username roboto-regular" >{user.user.user_name}</h1>
      <p style={{display: 'block', width: '100%', height: '20vh'}}>{user.user.profile_description}</p>
        <SetView sets={data.data.sets}></SetView>
    </div>)}
    else {
      return(
        
        <div className={"body--profile"}>
          <button onClick={()=>{setEditMode(!editMode)}}>balls</button>
          <p>{editProfilePicOpen.toString()}</p>
          <button onClick={() => {setEditProfilePicOpen(!editProfilePicOpen)}}
          style={{background: 'none', border: 'none', width: 'fit-content', height: 'fit-content', display: 'block', margin: 'auto'}}>
            <img className="img--profile-icon" src={picSrc}style={{height: '100px', width: '100px', margin: 'auto', display: 'block', marginTop: '5vh'}}></img>
          </button>
          {editProfilePicOpen?<PicSelector picSrc={picSrc} setPicSrc={setPicSrc}></PicSelector>:null}
          
          <h1 className="h1--username roboto-regular" >{user.user.user_name}</h1>
          
          <EditParagraphForm user={user}></EditParagraphForm>
            <SetView sets={data.data.sets}></SetView>
    </div>
      )
    }


  
}
