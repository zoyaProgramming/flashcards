import CenterMenu from "./CenterMenu";
import FlashcardMenu from './AddFlashcardMenu'
import { useState } from "react";
export default function CreateHeader(props) {
  return(
    <>
      <header className='main-header'> Flashcards App </header>
      <FlashcardMenu setTableId = {props.setTableId} setName={props.setName}></FlashcardMenu>
    </>
  );
  
}
