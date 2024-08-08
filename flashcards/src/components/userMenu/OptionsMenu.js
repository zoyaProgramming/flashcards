import { Form } from "react-router-dom"
import { switchMode } from "../../functions/serverEventHandlers"
export default function OptionsMenu(){
  return(
    <div className={"div--options"}>
        <button className="bttn--navbar " onClick={() => {switchMode({darkMode: true})}}>default theme</button>
        <button className="bttn--navbar" >private</button>
        <button className="bttn--navbar bttn--red">Delete Account</button>
    </div>
  )
}