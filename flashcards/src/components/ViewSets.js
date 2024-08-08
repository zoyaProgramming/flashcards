
import { useContext, useState } from "react"
import { addSetHandler, selectSetHandler } from "../functions/serverEventHandlers"


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
    <tr key={Math.random()}className="tr--all-set-lis all-set-list"><td className="td--all-set-list all-set-list">
      <button className = "table--button" onClick={(event) => {
        
        selectSetHandler(event, props.dataDispatch, props.elem.set_name).then(props.setIsOpen(false))
        
        
      }}>{props.elem.set_name}</button>
    </td></tr>
  )
}

function Table(props) {
  
  const c = props.data;
  const sets = props.data.data.sets;
  
  return(
    
    <table className="table--all-set-list all-set-list">
      <tbody className="all-set-list">
      {sets!=null && Array.isArray(sets)?sets.map((elem) => 
      {
        console.log('aaaaa')
        return (
        <SelectButton key={Math.random()}elem={elem} setData={props.setData} setName={props.setName} setIsOpen = {props.setIsOpen} dataDispatch={props.dataDispatch}></SelectButton>
      )}
       ):null}
      
      </tbody>
    </table>
  )

}
 function AddSetBttn(props) {
  const [addSetMenu, setAddSetMenu] = useState(false)
  return (
    <>
      <button className="bttn--navbar" onClick={() => {setAddSetMenu(!addSetMenu)}}>create new set</button>
      {addSetMenu?<><AddSetMenu setOpen = {setAddSetMenu} dataDispatch = {props.dataDispatch}></AddSetMenu></>:null}
    </>
    
    
  )
}
function AddSetMenu(props) {
  const [addState, setAddState] = useState(null)
  return(
    <>

      <form className="form--add-set-form" onSubmit={(event) => {
          addSetHandler(event, props.dataDispatch)
          event.preventDefault()
          props.setOpen(false)
        }}>
          <label className = "form__label" htmlFor="name">name: </label>
          <input className="form__input" id="name" name="name"></input>
          <label className= "form__label" htmlFor="description">description: </label>
          <input className = "form__input"id="description" name="description"></input>
          <button className="form__bttn--submit" type="submit" onClick={() => {
            console.log('submit clicked')
            
            }}>submit</button>
          
          
        </form>
     <button className="bttn--square material-symbols-outlined" onClick={() => {
      props.setOpen(false)
     }}>close</button>
     </>
  )

}

export default function ViewSets(props) {
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
      <Table setData = {props.setTableId } setName={props.setName} setIsOpen={props.setIsOpen} data={props.data} dataDispatch = {props.dataDispatch}> </Table>
      <AddSetBttn dataDispatch={props.dataDispatch}></AddSetBttn>
    </div>
    )
  }
  return(
    null
  )
  }