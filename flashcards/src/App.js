import logo from './logo.svg';
import { useTestBackend, useCleaning, useUpdate, useUpdateProperties, useReact, useUpdateTest, useLoading, useFetch } from './hooks/serverHooks.js';
import sanitize from './functions/sanitize.js';
import './App.css';
import { useState, useEffect, useContext, createContext } from 'react';
import './list.js';
import useDeleteFunction from './hooks/deleteHook.js';
import CreateHeader from './components/CreateHeader.js';
import DeleteConfirmation from './components/DeleteConfirmation.js';
const DataContext = createContext(null)
const TestContext = createContext(null)
let setFunction = null;
var terms = [{ front: "dog", back: "chien" },
{ front: "i am", back: "je suis" },
{ front: "my name is", back: "je m'appelle" }]
const [minimizeIcon, maximizeIcon] = [null, null];
//Block Element Modifier
function FlashcardDeleteButton(props) {
  /*let deleteFunction = useDeleteFunction({
    setData: setFunction,
    front: flashcardSet[props.index].front,
    back: flashcardSet[props.index].back
  })*/
  const currentId = useContext(TestContext)
  const flashcardData = useContext(DataContext)
  const [url, setUrl] = useState('')
  const deleteFnc = useDeleteFunction({
    url: url,
    front: flashcardData[props.index].front,
    back: flashcardData[props.index].back,
    setData: setFunction
  })
  return (
    <button className='button--square'
      onClick={() => {
        setUrl(currentId + '/delete')
      }
      }
    >x</button>
  );
}
function FlashcardSetListElement({ setCurrentFlashcardSet, setChange, appProperties, index }) {
  let flashcardSet = useContext(DataContext)
  const flashcardVals = (flashcardSet[index] === null) ? { front: "", back: "" } : flashcardSet[index]
  const [showEditInputState, setEditInputState] = useState(false)
  const [newValue, setNewValue] = useState(flashcardVals)
  function edit() {
    setEditInputState(!showEditInputState)
  }
  function updateCurrentCard(event) {
    setNewValue(event.target.value)
  }
  function updateSet() {
    if (newValue.front !== '' && newValue.back !== '') {
      setCurrentFlashcardSet(
        {
          front: newValue.front,
          back: newValue.back,
          existing: true,
          oldFront: flashcardSet[index].front,
          oldBack: flashcardSet[index].back
        }
      )
    }
    setEditInputState(!showEditInputState)
  }
  var b = null;
  return (
    <tr>
      <td key={flashcardSet[index].front + "_header"} >
        {!showEditInputState ?
          <p dangerouslySetInnerHTML={{ __html: flashcardSet[appProperties.currentCard] ? flashcardSet[index].front : 'error: flashcard not found' }}></p>
          :
          <CreateInput indexOfValueToChange={index} newFlashcardValues={newValue} setNewFlashcardValues={setNewValue} partToChange={'front'}></CreateInput>
        }
      </td>
      <td >
        {!showEditInputState ?
          <p dangerouslySetInnerHTML={{ __html: flashcardSet[index] ? flashcardSet[index].back : 'error: flashcard not found' }}></p>
          :
          <CreateInput indexOfValueToChange={index} newFlashcardValues={newValue} setNewFlashcardValues={setNewValue} partToChange={'back'}></CreateInput>
        }
      </td>
      <td className='td--nowrap'>
        <button className={`material-symbols-outlined button--square${showEditInputState ? " flashcard-list-create__submit" : ""}`}
          onClick={!showEditInputState ? edit : updateSet}>  {!showEditInputState ? 'edit' : 'check_circle'}</button>
      </td>
      <td>
        <FlashcardDeleteButton key={Math.random} index={index}></FlashcardDeleteButton>
      </td>
    </tr>
  );
}
function FlashcardSetListAllCards({ setCurrentFlashcardSet, appProperties, setChange }) {
  const flashcardSet = useContext(DataContext)
  return (
    <>
      <table>
        <tr>
          <th>
            front:
          </th>
          <th>
            back:
          </th>
          <th className='th--for-button'>
          </th>
          <th className='th--for-button'>
          </th>
        </tr>
        {flashcardSet.map((flashcard, index) => {
          return (
            <FlashcardSetListElement key={index + '_le'} flashcard={flashcard} index={index} setCurrentFlashcardSet={setCurrentFlashcardSet} setAppProperties={setChange} appProperties={appProperties} flashcardSet={flashcardSet}></FlashcardSetListElement>
          );
        })}
      </table>
    </>
  );
}
// jdisafjoifsjo
// jdsioaff
// sdf
function CreateInput({ indexOfValueToChange, newFlashcardValues, setNewFlashcardValues, partToChange, newKey }) {
  const partToChangeBool = partToChange === 'front' ? true : false
  newKey = newKey !== undefined ? newKey : indexOfValueToChange + '__' + partToChange
  return (
    <input className='flashcard-list-div__input' key={newKey} name="new-flashcard-front" id="new-flashcard-front" onChange=
      {(event) => {
        //console.log(event.target.value)
        const sanitized = sanitize(event.target.value ? event.target.value : "")
        setNewFlashcardValues({
          front: partToChangeBool ? event.target.value : newFlashcardValues.front,
          back: !partToChangeBool ? event.target.value : newFlashcardValues.back
        })
      }}
      value={newFlashcardValues[partToChange]}
    ></input>);
}
function desanitize(input) {
  const reg2 = /[&amp&lt;&gt;&quot;&#x27;&#x2f]/
  const b = input.toString().split()
}
function FlashcardSetCreateMenu({ setCurrentFlashcardSet, appProperties, setChange }) {
  const flashcardSet = useContext(DataContext)
  const [newFlashcardValues, setNewFlashcardValues] = useState(
    {
      front: "",
      back: ""
    }
  )
  function addWord() {
    //console.log('hiiii')
    var b = JSON.parse(JSON.stringify(flashcardSet))
    //console.log('byeee')
    b[b.length] = {
      front: newFlashcardValues.front,
      back: newFlashcardValues.back
    }
    setCurrentFlashcardSet(
      {
        front: newFlashcardValues.front,
        back: newFlashcardValues.back,
        existing: false
      }
    )
    setNewFlashcardValues({
      front: ''
      , back: ''
    })
  }
  return (
    appProperties.isEditOpen == true ?
      <>
        <header className="flashcard-list-div-header">
          <div className='flashcard-list-div__div'>
            <label className='flashcard-list-div__label' htmlFor="new-flashcard-front">front of flashcard</label>
            <CreateInput partToChange={'front'} indexOfValueToChange={null} newFlashcardValues={newFlashcardValues} setNewFlashcardValues={setNewFlashcardValues} key={'flashcarddivcreatefront'}></CreateInput>
          </div>
          <div className='flashcard-list-div__div'>
            <label className='flashcard-list-div__label' htmlFor="flashcard-list-div__input">back of flashcard</label>
            <CreateInput partToChange={'back'} indexOfValueToChange={null} newFlashcardValues={newFlashcardValues} setNewFlashcardValues={setNewFlashcardValues} key='flashcarddivcreateback'  ></CreateInput>
          </div>
          <button className={`material-symbols-outlined   button--square${appProperties.isEditOpen ? " flashcard-list-create__submit" : ""}`}
            onClick={addWord} style={{ margin: 'auto', padding: '0' }}>submit</button>
        </header>
      </> :
      null
  );
}
/* <input className='flashcard-list-div__input' name = "new-flashcard-front" id = "new-flashcard-front" onChange=
       {(event) => {setNewFlashcardValues({
         front:  event.target.value,
         back: newFlashcardValues.back
       })}}
       ></input>*/

/*function Flashcard(
  { currentCard, handleClick, nextCard, previousCard, appProperties, setChange }) {
  const flashcardSet = useContext(DataContext)
  const colors = {
    front: { color: '#1B1E22' },
    back: { color: '#1B1E22' }
  }
  const b = '&#x27';
  return (flashcardSet !== null && flashcardSet.length ?
    <div className='flashcard-container'>
      <button className={
        `flashcard${!appProperties.isFlashcardListOpen ? "--fullscreen" : ""}`
      } style={colors[appProperties.isFront]} onClick={handleClick} dangerouslySetInnerHTML={{ __html: flashcardSet[appProperties.currentCard][appProperties.isFront] }}>
      </button>
      <div className="div-arrow-button">
        <button className={`arrow__button${!appProperties.isFlashcardListOpen ? "--fullscreen" : ""} previous-button`} onClick={previousCard}>{'<-'}</button>
        <button className={`arrow__button${!appProperties.isFlashcardListOpen ? "--fullscreen" : ""} next-button}`} onClick={nextCard}>{'->'}</button>
      </div>
      {!appProperties.isFlashcardListOpen ? <button className="material-symbols-outlined flashcard__minimize-button"
        onClick={() => {
          setChange({
            key: "isFlashcardListOpen", val: true
          })
        }}>
        collapse_content
      </button> :
        <button className="material-symbols-outlined flashcard__minimize-button" onClick={() => {
          setChange({
            key: "isFlashcardListOpen", val: false
          })
        }}>
          open_in_full
        </button>
      }
    </div>
    : <p>not loaded</p>);
}*/
function Flashcard({ currentCard, handleClick, nextCard, previousCard, appProperties, setChange }) {
  const flashcardSet = useContext(DataContext)
  const colors = {
    front: { color: '#1B1E22' },
    back: { color: '#1B1E22' }
  }
  return (flashcardSet !== null && flashcardSet.length ?
    <div className='div--flashcard-container'>
      <button className={
        `flashcard${!appProperties.isFlashcardListOpen ? "--fullscreen" : ""}`
      } style={colors[appProperties.isFront]} onClick={handleClick} dangerouslySetInnerHTML={{ __html: flashcardSet[appProperties.currentCard][appProperties.isFront] }}>
      </button>
      <div className="div-arrow-button">
        <button className={`arrow__button${!appProperties.isFlashcardListOpen ? "--fullscreen" : ""} previous-button`} onClick={previousCard}>{'<-'}</button>
        <button className={`arrow__button${!appProperties.isFlashcardListOpen ? "--fullscreen" : ""} next-button}`} onClick={nextCard}>{'->'}</button>
      </div>
      {!appProperties.isFlashcardListOpen ? <button className="material-symbols-outlined flashcard__minimize-button"
        onClick={() => {
          setChange({
            key: "isFlashcardListOpen", val: true
          })
        }}>
        collapse_content
      </button> :
        <button className="material-symbols-outlined flashcard__minimize-button" onClick={() => {
          setChange({
            key: "isFlashcardListOpen", val: false
          })
        }}>
          open_in_full
        </button>
      }
    </div>
    : <h1>No flashcards to display
        <h5>Click '+' to add a flashcard</h5>
      </h1>
    );
}
function Body() {

}

function App() {
  const [data, setData] = useState(null)
  const [currentId, setCurrentId] = useState(null)
  const[name, setName] = useState(null)
  const [del, setDel] = useState(true)
  // const tester = useReact()
  setFunction = setData;
  //const loadingState = useLoading()
  const [currentFlashcardSet, status] = useLoading({ data: data, id: currentId })
  console.log(currentFlashcardSet)
  const [setCurrentFlashcardSet, msg] = useUpdate(
    {
      setData: setData,
      id: currentId
    }
  )
  const [isFront, setIsFront] = useState("front")
  const [testing, setTesting] = useState(1)
  const [appProperties, setChange] = useUpdateProperties({
    init:
    {
      isEditOpen: false,
      currentCard: 0,
      isFront: "front",
      isFlashcardListOpen: false,
      testing1: testing,
      flashcardSet: currentId
    }
  })
  function nextCard() {
    setTesting(testing + 1)
    if (appProperties.currentCard + 1 == currentFlashcardSet.length) {
      console.log("loonnnng")
      setChange(
        { key: "currentCard", val: 0 }
      )
    } else {
      console.log("short")
      setChange(
        { key: "currentCard", val: appProperties.currentCard + 1 }
      )
      //setCurrentCardState(appProperties.currentCard + 1)
    }
    /* setChange({
       key: "isFront", val: 'front'
     })*/
    //setChange({key:"isFront", val: "front"})
  }
  function onKeyDown(event) {
    if (event.key === "ArrowRight") {
      nextCard()
    } else if (event.key === "ArrowLeft") {
      previousCard()
    }
  }
  function previousCard() {
    if (appProperties.currentCard - 1 == -1) {
      setChange({
        key: "currentCard", val: (currentFlashcardSet.length - 1)
      })
    } else {
      setChange({
        key: "currentCard", val: (appProperties.currentCard - 1)
      })
    }
    setChange({ key: "isFront", val: "front" })
  }
  function onClick() {
    if (appProperties.isFront == "front") {
      setChange({ key: "isFront", val: 'back' })
    } else {
      setChange({ key: "isFront", val: 'front' })
    }
  }
  //return(<div> testing </div>);
  if(status === 404){
    return(
      <>

        <p>Flashcard set wasn't retrieved successfully. </p>
        <CreateHeader setTableId={setCurrentId}></CreateHeader>
        <TestContext.Provider value={currentId}>
          {
            
             del?
                <DeleteConfirmation setData ={setCurrentId} TestContext ={TestContext} setDel = {setDel}> </DeleteConfirmation>
          :null
          }
          <FlashcardSetCreateMenu setCurrentFlashcardSet={setCurrentFlashcardSet} appProperties={appProperties}></FlashcardSetCreateMenu>
        </TestContext.Provider>
      </>
      
    )
  }

  return (<>
    <CreateHeader setTableId={setCurrentId} setName={setName}></CreateHeader>
    {Array.isArray(currentFlashcardSet)?
     <TestContext.Provider value={currentId}>
        <div>
          <DataContext.Provider value={currentFlashcardSet}>
            
            <div className='main-div' onKeyDown={onKeyDown} tabIndex="0">
              <Flashcard nextCard={nextCard} previousCard={previousCard} handleClick={onClick} isFront={appProperties.isFront} appProperties={appProperties} setChange={setChange} ></Flashcard>
            </div>
            {appProperties.isFlashcardListOpen?
              <div style={{ display: "flex", padding: "1vh" }}>
                <button name='open-add-flashcard-menu' className='button--square' onClick=
                  {() => {
                    setChange({
                      key: "isEditOpen", val: !appProperties.isEditOpen
                    })
                  }}>+</button>
              </div>
            :null}
            {msg?<p>{msg}</p>:null}
            <div className='flashcard-list-div'>
              <FlashcardSetCreateMenu setCurrentFlashcardSet={setCurrentFlashcardSet} appProperties={appProperties}></FlashcardSetCreateMenu>
              {appProperties.isFlashcardListOpen == false ? <></> :
                <FlashcardSetListAllCards setChange={setChange} appProperties={appProperties} setCurrentFlashcardSet={setCurrentFlashcardSet}></FlashcardSetListAllCards>
              }
            </div>
            
          </DataContext.Provider>
        </div>
      </TestContext.Provider>
    
      : <h1>select a set to begin</h1>}
  </>
  );
}
export default App;
