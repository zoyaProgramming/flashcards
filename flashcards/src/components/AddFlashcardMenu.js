import CenterMenu from "./CenterMenu"
import { useState } from "react"
export default function FlashcardMenu(props) {
  const [isOpen, setIsOpen] = useState(false)
  return(
    <div className="div--top-menu">
      <button className="button--top-menu" onClick={() => {setIsOpen(!isOpen)}}>flashcard sets</button>
      <CenterMenu isOpen={isOpen} setIsOpen={setIsOpen} setTableId = {props.setTableId} setName={props.setName}></CenterMenu>
    </div>
  )
}
