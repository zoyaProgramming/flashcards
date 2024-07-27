import logo from './logo.svg';
import { submitUpdateHandler, fetchHandler, submitAddHandler, deleteHandler, firstReloadHandler} from './functions/serverEventHandlers.js';
import {useUpdateProperties, useFetchWithReload } from './hooks/serverHooks.js';
import sanitize from './functions/sanitize.js';
import './App.css';
import { useState, useReducer, useContext, createContext} from 'react';
import './list.js';
import deleteFunction from './hooks/deleteHook.js';
import CreateHeader from './components/CreateHeader.js';
import DeleteConfirmation from './components/DeleteConfirmation.js';
import { dataReducer } from './functions/dataReducer.js';
import { userReducer } from './functions/userReducer.js';
import { useDataHook } from './hooks/useDataHook.js';
const DataContext = createContext(null)
const UserContext = createContext(null)
let setFunction = null;
var terms = [{ front: "dog", back: "chien" },
{ front: "i am", back: "je suis" },
{ front: "my name is", back: "je m'appelle" }]
const [minimizeIcon, maximizeIcon] = [null, null];

function appReducer(state, action) {
  const clone = JSON.parse(JSON.stringify(state))
   function help (original, action, val)  {
    switch(action.type) {
      case 'isAddCardOpen'://horribly named
        original.isAddCardOpen = !state.isAddCardOpen
        break;
      case 'isFlashcardListOpen':
        original.isFlashcardListOpen = !original.isFlashcardListOpen;
        break;
      case 'currentCard':
        //console.log(action.currentCard)
        original.currentCard = action.currentCard
        break;
      case 'isFront':
        let f = state.isFront
        if(action.isFront === 'front'){
          f = 'front'
        } else if(state.isFront === 'front') {
            f = 'back'
          } else {
            f = 'front'
          }
        original.isFront = f
        break;
      case 'reset':
        original = ({isAddCardOpen: false,
        currentCard: 0,
        isFront: 'front',
        isFlashcardListOpen: false})
        break;
    }
  }



  if(Array.isArray(action)) {
    action.forEach((val) => {
      help(clone, val)
    })
    return clone;
  } else {
    console.log('yeahhh')
     help(clone, action)
     return clone;
  }
  
  throw Error('Unknown action: ' + action.type)
}
//Block Element Modifier
function FlashcardDeleteButton({index, dispatchData}) {
  const flashcardData = useContext(DataContext).data.current_set
  
  return (
    <button className='button--square'
      onClick={() => {
         deleteHandler(
          {
            front: flashcardData[index].front,
            back: flashcardData[index].back
          },
          dispatchData
        )
      }
      }
    >x</button>
  );
}
function FlashcardSetListElement({ dispatchData, appState, index , dispatch}) {
  let flashcardSetId = useContext(UserContext)
  let flashcardSet = useContext(DataContext).data.current_set
  const flashcardVals = (flashcardSet[index] === null) ? { front: "", back: "" } : flashcardSet[index]
  const [showEditInputState, setEditInputState] = useState(false)
  const [newValue, setNewValue] = useState(flashcardVals)
  function addFnc(){//horribly named
    setEditInputState(!showEditInputState)
  }
  function updateSet() {
    if (newValue.front !== '' && newValue.back !== '') {
      submitUpdateHandler({ newCard: newValue, oldCard: flashcardSet[index], dispatchData: dispatchData}).then(() => {
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
          <p dangerouslySetInnerHTML={{ __html: flashcardSet[appState.currentCard] ? flashcardSet[index].front : 'error: flashcard not found' }}></p>
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
          onClick={!showEditInputState ? addFnc : updateSet}> {!showEditInputState ? 'edit' : 'check_circle'}</button>
      </td>
      <td>
        <FlashcardDeleteButton key={Math.random} index={index} dispatchData={dispatchData}></FlashcardDeleteButton>
      </td>
    </tr>
  );
}
function FlashcardSetListAllCards({ dispatchData, appState, dispatch}) {
  const data = useContext(DataContext).data
  const name = data.set_name
  const flashcardSet = data.current_set
  return (
    <>
      <table><tbody>
        
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
            <FlashcardSetListElement key={index + '_le'} index={index} dispatchData={dispatchData} dispatch={dispatch} appState={appState}></FlashcardSetListElement>
          );
        })}
      </tbody></table>
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
        ////console.log(event.target.value)
        setNewFlashcardValues({
          front: partToChangeBool ? event.target.value : newFlashcardValues.front,
          back: !partToChangeBool ? event.target.value : newFlashcardValues.back
        })
      }}
      value={newFlashcardValues[partToChange]}
    ></input>);
}
function FlashcardSetCreateMenu({ dataDispatch, dispatch, appState, }) {
  const data = useContext(DataContext)
  const flashcardSet = data.data.current_set
  const name = data.set_name
  const [newFlashcardValues, setNewFlashcardValues] = useState(
    {
      front: "",
      back: ""
    }
  )
  function addWord() {
    ////console.log('hiiii')
    var b = JSON.parse(JSON.stringify(flashcardSet))
    ////console.log('byeee')
    submitAddHandler({
      newCard: {front: newFlashcardValues.front, back: newFlashcardValues.back},
      dataDispatch
    })
    /*dispatchData(
      {
        front: newFlashcardValues.front,
        back: newFlashcardValues.back,
        existing: false
      }
    )*/
    setNewFlashcardValues({
      front: ''
      , back: ''
    })
  }
  return (
    appState.isAddCardOpen == true ?
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
          <button className={`material-symbols-outlined   button--square${appState.isAddCardOpen ? " flashcard-list-create__submit" : ""}`}
            onClick={addWord} style={{ margin: 'auto', padding: '0' }}>submit</button>
        </header>
      </> :
      null
  );
}
function Flashcard({handleClick, nextCard, previousCard, appState, dispatch, dispatchData }) {
  const data = useContext(DataContext).data
  if(data === null || data===undefined){
  
    return(<h1>select a set to view flashcards</h1>)
  } else {
  }
  const flashcardSet = data.current_set
  const name = data.set_name
  console.log(data)
  const colors = {
    front: { color: '#1B1E22' },
    back: { color: '#1B1E22' }
  }
  function nextCard() {
    let cc = appState.currentCard
    console.log('helllo')
    if (cc + 1 >= flashcardSet.length) {
      //console.log("cc" + cc + "len: " + flashcardSet.length)
      cc = 0;
    } else {
      cc = cc +1;
      //console.log("cc" + cc)
    }
    dispatch([{type: 'currentCard',
      currentCard: cc}, 
      {type: 'isFront', isFront: 'front'}])
  
  }
  
  function previousCard() {
    let cc= appState.currentCard
    if (cc - 1 == -1) {
      cc = flashcardSet.length - 1
    } else {
      cc = cc-1;
    }
    dispatch(
      [{type: 'currentCard',
      currentCard: cc}, 
      {type: 'isFront', isFront: 'front'}]
    )
  }
  function onKeyDown(event) {
    if (event.key === "ArrowRight") {
      nextCard()
    } else if (event.key === "ArrowLeft") {
      previousCard()
    }
  }
  function onClick() {
    console.log('click')
    dispatch({
      type: 'isFront'
    })
  }
  if(!name){
    return(<p>select a set</p>)
  }
  return (flashcardSet !== null && Array.isArray(flashcardSet) && flashcardSet.length ?
    <>
    <h1>{name}</h1>
    <div className='div--flashcard-container'  onKeyDown={onKeyDown}>
      <button className={
        `flashcard${!appState.isFlashcardListOpen ? "--fullscreen" : ""}`
      } style={colors[appState.isFront]} onClick={onClick} dangerouslySetInnerHTML={{ __html: flashcardSet[appState.currentCard][appState.isFront]}}>
      </button>
      <div className="div-arrow-button">
        <button className={`arrow__button${!appState.isFlashcardListOpen ? "--fullscreen" : ""} previous-button`} onClick={previousCard}>{'<-'}</button>
        <button className={`arrow__button${!appState.isFlashcardListOpen ? "--fullscreen" : ""} next-button}`} onClick={nextCard}>{'->'}</button>
      </div>
      {!appState.isFlashcardListOpen ? <button className="material-symbols-outlined flashcard__minimize-button"
        onClick={() => {
          console.log('aaaaa')
          dispatch({
            type: "isFlashcardListOpen"
          })
        }}>
        collapse_content
      </button>:
        <button className="material-symbols-outlined flashcard__minimize-button" onClick={() => {
          dispatch(
            {
              type: 'isFlashcardListOpen'
            }
          )
        }}>
          open_in_full
        </button>
      }
    </div></>
    : <><h1>No flashcards to display</h1>
      <h5>Click '+' to add a flashcard</h5></>
    );
}
function Body() {
  const [t, x] = useState(0);
      // stores the user information
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
    const [state, dispatch] = useReducer(appReducer, {
      
      isAddCardOpen: false,
      currentCard: 0,
      isFront: 'front',
      isFlashcardListOpen: false
    
  })
  useDataHook(userDispatch, dataDispatch)
  
    return (<>
      <p> {({} == null).toString()}</p>
      <UserContext.Provider value={user}>
      <DataContext.Provider value={data}>
      
        <CreateHeader userDispatch={userDispatch} dataDispatch={dataDispatch} user={user} data={data}></CreateHeader>
          {
            user.user?//obviously don't want to load in the flashcard data if not logged in
            <div>
                <div className='main-div' tabIndex="0">
                  <Flashcard isFront={state.isFront} appState={state} dispatch={dispatch}>
                  </Flashcard>
                </div>
                {(data.data !== null && Array.isArray(data.data.current_set))?
                <>
                    <div style={{ display: "flex", padding: "1vh" }}>
                      <button name='open-add-flashcard-menu' className='button--square' onClick=
                        {() => {
                          dispatch({
                            type: "isAddCardOpen"
                          })
                        }}>+</button>
                    </div>
                    <div className='flashcard-list-div'>
                      <FlashcardSetCreateMenu userDispatch={userDispatch} dataDispatch={dataDispatch} appState={state}></FlashcardSetCreateMenu>
                      {state.isFlashcardListOpen == false ? <></> :
                        <FlashcardSetListAllCards dispatch={dispatch} appState={state} userDispatch={userDispatch} dispatchData={dataDispatch}>
                        </FlashcardSetListAllCards>
                      }
                </div>
                    </>
                :null}
            </div>
            : <p>not logged in???</p>
          }
        </DataContext.Provider>
        </UserContext.Provider>
    </>
    );
}
function App() {
  /* const [currentFlashcardSet, status] = 
      useFetchWithReload(currentId,{ data: data, id: currentId })*/
      return(<Body></Body>)
    
}
export default App;