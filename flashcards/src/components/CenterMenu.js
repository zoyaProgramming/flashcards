
import { useState } from "react"
import useSets from "../hooks/listAllSetsHook"


function CloseButton(props){
  function close() {
    props.setState(false)
  }
  return(
    <button className="material-symbols-outlined button--close" onClick={close}>close</button>
  )
}

function SelectButton (props) {
  return(
    <tr className="tr--all-set-lis all-set-list"><td className="td--all-set-list all-set-list">
      <button className = "table--button" onClick={() => {
        props.setData(props.elem.rowid)
        props.setName(props.elem.tbl_name)
        props.setIsOpen(false)
      }}>{props.elem.tbl_name}</button>
    </td></tr>
  )
}

function Table(props) {
  const sets = useSets({setData: props.setData})
  return(
    <table className="table--all-set-list all-set-list">
      <tbody className="all-set-list">
      {sets!=null?sets.map((elem) => 
      {return (
        <SelectButton elem={elem} setData={props.setData} setName={props.setName} setIsOpen = {props.setIsOpen}></SelectButton>
      )}
       ):null}
      
      </tbody>
    </table>
  )

}


export default function CenterMenu(props) {
  
 const test = [
  {test1: "value of test1", test2: "valueoftest2", test3: {
    key: "value"
  }}, 
  "test" 
 ]

  if(props.isOpen) {
    return (
     
    <div className="div--center-overlapping">
      
       <header className="header--list-flashcard-sets"> 
       <CloseButton setState={props.setIsOpen}></CloseButton>
        <h1 className="h1--list-flashcard-sets">All flashcard sets</h1>
      </header>
      
      
      <Table setData = {props.setTableId } setName={props.setName} setIsOpen={props.setIsOpen}> </Table>
      
    </div>
    )
  }
  return(
    null
  )
  }