import { Form } from "react-router-dom"
import {useState} from 'react'
import { switchMode } from "../../functions/serverEventHandlers"
function DeleteConfirm({setState, link}){
  return(
    <>
    <a href={link}>yes</a>
    <button onClick={() => {setState(false)}}>cancel</button>
    </>
  )
  
}
export default function OptionsMenu(){
  const [showDeleteConfirm, setConfirm] = useState(false)
  if(showDeleteConfirm){
    return(
    <DeleteConfirm setState = {setConfirm} link={"options/delete"}></DeleteConfirm>)
  }
  return(
    <div className={"div--options"}>
        <button className="bttn--navbar " onClick={() => {switchMode({darkMode: true})}}>default theme</button>
        <button className="bttn--navbar" >private</button>
        <button className="bttn--navbar bttn--red" onClick = {()=> {
          console.log('aaa')
          setConfirm(true)}}>Delete Account</button>
        
    </div>
  )
}