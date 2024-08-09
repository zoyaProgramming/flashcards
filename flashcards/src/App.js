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
import { UserSidebar } from './components/userMenu/userSidebar.js';
import { useLoaderData, useOutletContext, Outlet, useActionData} from 'react-router-dom';
const DataContext = createContext(null)
const UserContext = createContext(null)
const DarkmodeContext = createContext('')
const StateContext = createContext('')

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
  const isDark = useContext(DarkmodeContext);
  const flashcardData = useContext(DataContext).data.current_set
  
  return (
    <button className={"button--square" + isDark}
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
  const isDark = useContext(DarkmodeContext);
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
      <td className={"td--nowrap" + isDark}>
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
  const isDark = useContext(DarkmodeContext);
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
          <th className={"th--for-button" + isDark}>
          </th>
          <th className={"th--for-button" + isDark}>
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
  const isDark = useContext(DarkmodeContext);
  const partToChangeBool = partToChange === 'front' ? true : false
  newKey = newKey !== undefined ? newKey : indexOfValueToChange + '__' + partToChange
  return (
    <input className={"flashcard-list-div__input" + isDark} key={newKey} name="new-flashcard-front" id="new-flashcard-front" onChange=
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
  const isDark = useContext(DarkmodeContext);
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
        <header className={"flashcard-list-div-header" + isDark}>
          <div className={"flashcard-list-div__div" + isDark}>
            <label className={"flashcard-list-div__label" + isDark} htmlFor="new-flashcard-front">front of flashcard</label>
            <CreateInput partToChange={'front'} indexOfValueToChange={null} newFlashcardValues={newFlashcardValues} setNewFlashcardValues={setNewFlashcardValues} key={'flashcarddivcreatefront'}></CreateInput>
          </div>
          <div className={"flashcard-list-div__div" + isDark}>
            <label className={"flashcard-list-div__label" + isDark} htmlFor="flashcard-list-div__input">back of flashcard</label>
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
  const isDark = useContext(DarkmodeContext);
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
    <div className={"div--flashcard-container" + isDark}  onKeyDown={onKeyDown}>
      <button className={
        `flashcard${(!appState.isFlashcardListOpen ? "--fullscreen" : "") + isDark}`
      } style={colors[appState.isFront]} onClick={onClick} dangerouslySetInnerHTML={{ __html: flashcardSet[appState.currentCard][appState.isFront]}}>
      </button>
      <div className={"div-arrow-button" + isDark}>
        <button className={`arrow__button${!appState.isFlashcardListOpen ? "--fullscreen" : ""} previous-button` + isDark} onClick={previousCard}>{'<-'}</button>
        <button className={`arrow__button${!appState.isFlashcardListOpen ? "--fullscreen" : ""} next-button}` + isDark} onClick={nextCard}>{'->'}</button>
      </div>
      {!appState.isFlashcardListOpen ? <button className={"material-symbols-outlined flashcard__minimize-button" + isDark}
        onClick={() => {
          console.log('aaaaa')
          dispatch({
            type: "isFlashcardListOpen"
          })
        }}>
        collapse_content
      </button>:
        <button className={"material-symbols-outlined flashcard__minimize-button" + isDark} onClick={() => {
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
    : <>
    <h1>{name}</h1>
    <h1>No flashcards to display</h1>
      <h5>Click '+' to add a flashcard</h5></>
    );
}

export function C(){
  const [dispatch, dataDispatch, setIsDark, userDispatch] = useOutletContext();
  const state=useContext(StateContext)
  const data = useContext(DataContext)
  const userState=useContext(UserContext)
  console.log(userState)
  const isDark=useContext(DarkmodeContext)
  return(
    userState?//obviously don't want to load in the flashcard data if not logged in
      
      <>
        <div className={"main-div" + isDark} tabIndex="0">
          <Flashcard isFront={state.isFront} appState={state} dispatch={dispatch}>
          </Flashcard>
          
        </div>
        {data.data !== null && Array.isArray(data.data.current_set)?
        <>
            <div className = {isDark} style={{ display: "flex", padding: "1vh" }}>
              <button name='open-add-flashcard-menu' className={"button--square" + isDark} onClick=
                {() => {
                  dispatch({
                    type: "isAddCardOpen"
                  })
                }}>+</button>
            </div>
            <div className={"flashcard-list-div" + isDark}>
              <FlashcardSetCreateMenu userDispatch={userDispatch} dataDispatch={dataDispatch} appState={state}></FlashcardSetCreateMenu>
              {state.isFlashcardListOpen == false ? <></> :
                <FlashcardSetListAllCards dispatch={dispatch} appState={state} userDispatch={userDispatch} dispatchData={dataDispatch}>
                </FlashcardSetListAllCards>
              }
           </div>
        </>
        :null}
    </>
    : <p>not logged in???</p>
  )
}

function Body() {
  const rgb = useActionData()
  
  console.log("refresh: " + rgb)
  const [isDarkMode, setIsDark] = useState(' light')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile_pic, setPic] = useState(null)

  console.log(profile_pic)
  const [t, x] = useState(0);
      // stores the user information
    const [userState, userDispatch] = useReducer(userReducer, {
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
  useDataHook(userDispatch, dataDispatch, setPic, rgb)
  let darkVariable = ' light'
  if(userState.user) {
    switch(userState.user.dark_mode){
      case 1:
        darkVariable = ' dark'
        break;
      case 0:
        darkVariable = ' light';
        break;
    }
  }
    return (<>
    <DarkmodeContext.Provider value={userState.darkMode}>
    <div className={"r" + userState.darkMode} style={{display: 'flex',
      flexDirection: 'row',
      height: '100%',

      flexWrap: 'nowrap',
      maxWidth: '100vw',
      width: '100vw',

      flexBasis: 'auto',
      minWidth: '0'
    }}>
      
      <UserContext.Provider value={userState.user}>
        {sidebarOpen?<UserSidebar UserContext={UserContext} userDispatch={userDispatch} dataDispatch={dataDispatch} DarkmodeContext={DarkmodeContext} setIsDark={setIsDark}></UserSidebar>:null}
      <DataContext.Provider value={data}>
      <StateContext.Provider value={state}>
      <div style={{maxHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
        <CreateHeader darkContext={DarkmodeContext} setProfilePic={setPic} profile_pic={profile_pic} userDispatch={userDispatch} dataDispatch={dataDispatch} userData={userState} data={data} setSidebarOpen = {setSidebarOpen} sidebarOpen={sidebarOpen} setDarkmode ={setIsDark}></CreateHeader>
        <Outlet context={[dispatch, dataDispatch, setIsDark, userDispatch]}></Outlet>
          
          </div>
        </StateContext.Provider>
        </DataContext.Provider>
        </UserContext.Provider>
        
        </div>
        </DarkmodeContext.Provider>
    </>
    
    );
}
export function App() {
  
  /* const [currentFlashcardSet, status] = 
      useFetchWithReload(currentId,{ data: data, id: currentId })*/
      return(<Body></Body>)
}