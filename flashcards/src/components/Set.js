export default function Set( ){

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
        `flashcard${!appState.isFlashcardListOpen ? "--fullscreen" : ""}`
      } style={colors[appState.isFront]} onClick={onClick} dangerouslySetInnerHTML={{ __html: flashcardSet[appState.currentCard][appState.isFront]}}>
      </button>
      <div className={"div-arrow-button" + isDark}>
        <button className={`arrow__button${!appState.isFlashcardListOpen ? "--fullscreen" : ""} previous-button`} onClick={previousCard}>{'<-'}</button>
        <button className={`arrow__button${!appState.isFlashcardListOpen ? "--fullscreen" : ""} next-button}`} onClick={nextCard}>{'->'}</button>
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

}