import logo from './logo.svg';
import{useTestBackend, useCleaning, useUpdate, useUpdateProperties, useReact, useUpdateTest, useLoading}  from './hooks/serverHooks.js';
import sanitize from './functions/sanitize.js';
import './App.css';
import { useState, useEffect, useContext, createContext} from 'react';


import './list.js';
import useDeleteFunction from './hooks/deleteHook.js';

const DataContext = createContext('test')
const TestContext = createContext('beans')
let setFunction = null;

function CreateHeader() {
  return(
    <header className='main-header'> Flashcards App </header>
  );
}

var terms = [{front: "dog", back: "chien"},
   {front : "i am", back: "je suis"}, 
   {front : "my name is", back: "je m'appelle"}]
const [minimizeIcon, maximizeIcon] = [null, null];
  
   

//Block Element Modifier



function FlashcardDeleteButton(props) {
  /*let deleteFunction = useDeleteFunction({
    setData: setFunction,
    front: flashcardSet[props.index].front,
    back: flashcardSet[props.index].back
  })*/
  
  return(
    <button className='button--square'
    onClick={() => {
      
    }
    }
    >x</button>

    
  );
}


function FlashcardSetListElement({setCurrentFlashcardSet, setChange, appProperties, index}){


 /* const [useFlashcardData, setFlashcardData] = useUpdate({
    existing: true,
    front: flashcardSet[appProperties.currentCard].front,
    back:flashcardSet[appProperties.currentCard].back
  })*/
    let flashcardSet = useContext(DataContext)  
  const flashcardVals = (flashcardSet[index] === null)?{front:"", back:""}:flashcardSet[index]
  const [showEditInputState, setEditInputState] = useState(false)
  const [newValue, setNewValue] = useState(flashcardVals)
 
  function edit() {
    setEditInputState(!showEditInputState)
    
  }
  function updateCurrentCard(event) {
    setNewValue(event.target.value)
  }
  function updateSet(){
    if(newValue.front !== '' && newValue.back !== ''){
      
        setCurrentFlashcardSet(
          newValue
      )

    }
    setEditInputState(!showEditInputState)
    setNewValue({
      front: '',
      back: ''
    })
    
  }


  var b = null;

  
  return(
    
    <>
      
        <div key = {flashcardSet[index].front + "_div"} className = "term-list-element">
        <div style ={{marginLeft:'none', marginRight: 'auto'}}>
            
            {!showEditInputState?
            <>
            <p key = {flashcardSet[index].front + "_header"} className = "term-list-element__h1" > 
            <span className='text text--pink' style = {{fontStretch:'ultra-condensed', fontSize: 'large'}}>front: </span>{flashcardSet[appProperties.currentCard]?flashcardSet[index].front:'error: flashcard not found'} 
            </p>
            </>
            :
            <>
            <CreateInput indexOfValueToChange={index} newFlashcardValues={newValue} setNewFlashcardValues={setNewValue} partToChange={'front'}></CreateInput>
            
            </>
            }
            
          </div>
          <div style={{marginLeft: 'auto', marginRight: 'none'}}>
            {!showEditInputState?
              <>
                <p>back:{flashcardSet[index]?flashcardSet[index].back:'error: flashcard not found'}</p>
              </>
              :
              <>
                <CreateInput indexOfValueToChange={index} newFlashcardValues={newValue} setNewFlashcardValues={setNewValue} partToChange={'back'}></CreateInput>
              </>
              
            }
          </div>
            <button className={`material-symbols-outlined button--square${showEditInputState?" flashcard-list-create__submit":""}`}
            onClick={!showEditInputState?edit:updateSet}>  {!showEditInputState?'edit':'check_circle'}</button>
            <FlashcardDeleteButton key = {Math.random} index={index}></FlashcardDeleteButton>

        </div>
    </>

  );
    
  
}


function FlashcardSetListAllCards({ setCurrentFlashcardSet, appProperties, setChange}){
  const flashcardSet = useContext(DataContext)
  return(
    
    flashcardSet.map((flashcard, index) => {
      return (
      <FlashcardSetListElement key={index + '_le'} flashcard={flashcard} index ={index} setCurrentFlashcardSet={setCurrentFlashcardSet} setAppProperties={setChange} appProperties={appProperties} flashcardSet={flashcardSet}></FlashcardSetListElement>
      );
    })
  );
}

function RenderListAllCards() {
  const flashcardSet = useContext(DataContext)
  return(
    <>
     {(flashcardSet !== null && flashcardSet !== undefined)?
          flashcardSet!==null&&flashcardSet.length>=1?flashcardSet.map((flashcard, index) => {
            return(
              <>
              <p style={{color:"red"}}>{flashcard.front}</p>
              <p style={{color:"red"}}>{flashcard.back}</p>
              </>
            );
          }):<p>empty {' '}</p>
        
    : <></>
    }
    </>
  );
}
  
function CreateInput({ indexOfValueToChange, newFlashcardValues, setNewFlashcardValues, partToChange, newKey}) {
  const partToChangeBool = partToChange==='front'?true:false
  newKey = newKey !== undefined? newKey: indexOfValueToChange+'__'+partToChange
  
  return(
      <input className='flashcard-list-div__input' key = {newKey} name = "new-flashcard-front" id = "new-flashcard-front" onChange=
          {(event) => {
            //console.log(event.target.value)

            const sanitized = sanitize(event.target.value)

            setNewFlashcardValues({
              front:  partToChangeBool?sanitized:newFlashcardValues.front,
              back: !partToChangeBool?sanitized:newFlashcardValues.back
          })
        }}
          value = {newFlashcardValues[partToChange]}
    ></input>);

  
}

function FlashcardSetCreateMenu({setCurrentFlashcardSet, appProperties, setChange}){
  const flashcardSet = useContext(DataContext)
/*  const [data, setData] = useUpdate({
    existing: undefined,
    front: null,
    back: null
  });*/
  const [newFlashcardValues, setNewFlashcardValues] = useState(
    {
      front: "",
      back: ""
    }
  )
  function addWord(){
    //console.log('hiiii')

    var b = JSON.parse(JSON.stringify(flashcardSet))
    //console.log('byeee')
    b[b.length] = {front: newFlashcardValues.front, 
      back:newFlashcardValues.back}

    
    setCurrentFlashcardSet(

        {
          front: newFlashcardValues.front,
          back: newFlashcardValues.back,
          existing: false
        }

    )
    setNewFlashcardValues({front:''
      ,back:''
    })
  }
  
  if(appProperties.isEditOpen){return(
    <header className = "flashcard-list-div-header">
      <div className='flashcard-list-div__div'>
        <label className = 'flashcard-list-div__label' htmlFor ="new-flashcard-front">front of flashcard</label>
        <CreateInput partToChange = {'front'} indexOfValueToChange={null} newFlashcardValues={newFlashcardValues} setNewFlashcardValues = {setNewFlashcardValues} key={'flashcarddivcreatefront'}></CreateInput>
      </div>
        <div className='flashcard-list-div__div'>
        <label className = 'flashcard-list-div__label' htmlFor ="flashcard-list-div__input">back of flashcard</label>
          <CreateInput partToChange = {'back'} indexOfValueToChange={null} newFlashcardValues={newFlashcardValues} setNewFlashcardValues ={setNewFlashcardValues} key='flashcarddivcreateback'  ></CreateInput>
          
        </div>
        <button className = {`button--square${appProperties.isEditOpen?" flashcard-list-create__submit":""}`}
         onClick={addWord} style={{margin:'auto', padding:'0'}}>submit</button>
    </header>
    

  );}

}
 /* <input className='flashcard-list-div__input' name = "new-flashcard-front" id = "new-flashcard-front" onChange=
        {(event) => {setNewFlashcardValues({
          front:  event.target.value,
          back: newFlashcardValues.back
        })}}
        ></input>*/

function Flashcard(
  
  {currentCard, handleClick, nextCard,previousCard, appProperties, setChange}) {
    const flashcardSet = useContext(DataContext)
  const colors = {
    front: {color: '#1B1E22'},
    back: {color: '#1B1E22'}
  }
  return (flashcardSet?

    <div className='flashcard-container'> 
      <button className = {
        
        `flashcard${!appProperties.isFlashcardListOpen?"--fullscreen":""}`
      } style={colors[appProperties.isFront]} onClick = {handleClick}>{flashcardSet[appProperties.currentCard][appProperties.isFront]}
      </button>
      <div className="div-arrow-button">
        <button className={`arrow__button${!appProperties.isFlashcardListOpen?"--fullscreen":""} previous-button`}onClick= {previousCard}>{'<-'}</button>
        <button className={`arrow__button${!appProperties.isFlashcardListOpen?"--fullscreen":""} next-button}`} onClick= {nextCard}>{'->'}</button>
      </div>
      {!appProperties.isFlashcardListOpen?<button className="material-symbols-outlined flashcard__minimize-button" 
      onClick= {() => {
        setChange({
          key: "isFlashcardListOpen", val: true
        })
      }}> 
        collapse_content


      </button>:
      <button className="material-symbols-outlined flashcard__minimize-button" onClick={() => {
        
        setChange({
          key: "isFlashcardListOpen", val: false
        })}}>
          open_in_full
      </button>
      }
      
    </div>
  :<></>);
}

function App() {
  const [data, setData] = useState(null)
 // const tester = useReact()
  setFunction = setData;
  //const loadingState = useLoading()
  const currentFlashcardSet= useLoading({data: data})
  const  setCurrentFlashcardSet = useUpdate(
    {
      setData: setData
    }
  )
  
  const [isFront, setIsFront] = useState("front")
  const[testing, setTesting] = useState(1)
  const [appProperties, setChange] = useUpdateProperties({init: 
    {
      isEditOpen: false,
      currentCard:0,
      isFront:"front",
      isFlashcardListOpen : false,
      testing1: testing
     }
  })


  function nextCard() {
    setTesting(testing+1)
    if(appProperties.currentCard + 1 == currentFlashcardSet.length) {
      console.log("loonnnng")
      
      setChange(
        {key: "currentCard", val: 0}
      )
      
    } else {
      console.log("short")
      setChange(
        
        {key: "currentCard", val: appProperties.currentCard + 1}
      )
      
      
      //setCurrentCardState(appProperties.currentCard + 1)
    }
    setChange({
      key: "isFront", val: 'front'
    })
    
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
    if(appProperties.currentCard -1 == -1) {
      setChange({
        key: "currentCard", val: (currentFlashcardSet.length - 1)
      })
      
    } else {
      setChange({
        key: "currentCard", val: (appProperties.currentCard - 1 )
      })
    }
    setChange({key: "isFront", val: "front"})
  }
  function onClick() {
    //console.log(appProperties.currentCard)
    if(appProperties.isFront == "front") {
      setChange({key: "isFront", val: 'back'})
    } else {
      setChange({key: "isFront", val: 'front'})
    }
  }

  //return(<div> testing </div>);
  return (
    currentFlashcardSet!==null?<div>
      <DataContext.Provider value={currentFlashcardSet}>
          
          <button onClick={useCleaning}></button>
         
          <CreateHeader></CreateHeader>
          <span className="material-symbols-outlined">
            open_in_full
          </span>
          <div className='main-div' onKeyDown={onKeyDown} tabIndex="0">
            <Flashcard nextCard={nextCard} previousCard = {previousCard} handleClick={onClick} isFront={appProperties.isFront} appProperties={appProperties}  setChange={setChange} ></Flashcard>
          </div>
          <div style={{display:"flex", padding:"1vh" }}>
              <button name ='open-add-flashcard-menu' className = 'button--square'onClick= 
                {()=> {
                  setChange({
                    key: "isEditOpen", val: !appProperties.isEditOpen
                  })
                  
                }}> + </button>
                
            </div>

          <div className='flashcard-list-div'>
            
              {!appProperties.isFlashcardListOpen?<></>:
                <>
                  <FlashcardSetCreateMenu setCurrentFlashcardSet = {setCurrentFlashcardSet}  appProperties={appProperties}>  </FlashcardSetCreateMenu>
                  <FlashcardSetListAllCards setChange={setChange} appProperties= {appProperties} setCurrentFlashcardSet={setCurrentFlashcardSet}></FlashcardSetListAllCards>
                </>
              }
          </div>
      </DataContext.Provider>
    </div>
    :<p>Not loaded yet...</p>
      
  );
}


export default App;
