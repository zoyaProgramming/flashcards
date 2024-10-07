
import '../../App.css';
import { useState, useReducer, useContext, createContext} from 'react';
import { dataReducer } from '../../functions/dataReducer.js';
import { userReducer } from '../../functions/userReducer.js';
import { useDataHook } from '../../hooks/useDataHook.js';
import { useLoaderData, useOutletContext, Outlet, useActionData, useParams} from 'react-router-dom';

import { addSetHandler , duplicateSet} from '../../functions/serverEventHandlers.js';
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
function FlashcardSetListElement({ dispatchData, appState, index , dispatch}) {
  const isDark = useContext(DarkmodeContext);
  let flashcardSetId = useContext(UserContext)
  let flashcardSet = useContext(DataContext).cards
  const flashcardVals = (flashcardSet[index] === null) ? { front: "", back: "" } : flashcardSet[index]
  const [newValue, setNewValue] = useState(flashcardVals)
  var b = null;
  return (
    <tr>
      <td key={flashcardSet[index].front + "_header"} >
        
          <p dangerouslySetInnerHTML={{ __html: flashcardSet[appState.currentCard] ? flashcardSet[index].front : 'error: flashcard not found' }}></p>
      </td>
      <td >
          <p dangerouslySetInnerHTML={{ __html: flashcardSet[index] ? flashcardSet[index].back : 'error: flashcard not found' }}></p>

        
      </td>
    </tr>
  );
}
function FlashcardSetListAllCards({ dispatchData, appState, dispatch}) {
  const isDark = useContext(DarkmodeContext);
  const data = useContext(DataContext)
  const name = data.name
  const flashcardSet = data.cards
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
function Flashcard({handleClick, nextCard, previousCard, dispatch, dispatchData }) {
  const data = useContext(DataContext);
  const appState = useContext(StateContext);
  const isDark = useContext(DarkmodeContext);
  
  if(data === null || data===undefined){
    return(<h1>select a set to view flashcards</h1>)
  } else {
    console.log(data.cards)
  }
  const flashcardSet = data.cards
  const name = data.name
  const description = data.description
  console.log(data)
  const colors = {
    front: { color: '#1B1E22' },
    back: { color: '#1B1E22' }
  }
  function nextCard() {
    let cc = appState.currentCard
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
  console.log(appState)

  // copy the set to the logged in user's library
  return (flashcardSet !== null && Array.isArray(flashcardSet) && flashcardSet.length ?
    <>
    <h1>{name}
      <button className="button-square" onClick={(event) => {
        const cards = flashcardSet.map((card)=>{
          return {front: card.front, back: card.back};
        })
        duplicateSet(name, description, dispatchData, null, cards);
      }}>add to my library</button>
      
    </h1>
    
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

export function ViewSet(){
  const [dispatch, dataDispatch, setIsDark, userDispatch, state] = useOutletContext();
  const params = useParams();
  const data = useLoaderData().sets.find(item => item.name == params.set_name);
  const userState=useContext(UserContext);
  const isDark=useContext(DarkmodeContext);
  return(
    //obviously don't want to load in the flashcard data if not logged in
      <DataContext.Provider value={data}>
      <StateContext.Provider value={state}>
      <>
        <div className={"main-div" + isDark} tabIndex="0">
          <Flashcard isFront={state.isFront} appState={state} dispatch={dispatch} dispatchData={dataDispatch}>
          </Flashcard>
        </div>
        {data !== null && Array.isArray(data.cards)?
        <>
            <div className={"flashcard-list-div" + isDark}>
              {state.isFlashcardListOpen == false ? <></> :
                <FlashcardSetListAllCards dispatch={dispatch} appState={state} userDispatch={userDispatch} dispatchData={dataDispatch}>
                </FlashcardSetListAllCards>
              }
           </div>
        </>
        :null}
    </>
    </StateContext.Provider>
    </DataContext.Provider> 

  )
}