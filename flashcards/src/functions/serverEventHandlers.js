
import sanitize from "./sanitize";



// dispatch needs: action object with a type, a "payload" that's either an error or data"
// for updating flashcards in a set


// LOADING_DATA, GET_DATA, DATA_ERROR, CLEAR_DATA
export  function submitUpdateHandler({newCard, oldCard, dispatchData}){
  dispatchData({type: 'LOADING_DATA', payload: null})
    async function callBackendAPI(){
      try {
        const response = await fetch(("http://localhost:3500/update"), {
          method: 'post',
          headers: {

            "Content-Type": "application/json"
          }, credentials: 'include',
          body: JSON.stringify({
            front: sanitize(newCard.front),
            back: sanitize(newCard.back),
            oldFront: sanitize(oldCard.front),
            oldBack: sanitize(oldCard.back)
          })}
        );
        if(response.status==400) {
        }
        else if (!response.ok) {
          throw new Error("Failed to fetch data");
        } else {
          const json = await response.json()
          dispatchData({type: 'GET_DATA', payload: json})
          return true;
        }
        const body = await response.json();
      } catch (error) {
        console.error(error.message);
      }
    };

    return callBackendAPI();
  }
//for adding flashcards to a set
export function submitAddHandler({ newCard, dataDispatch}) {
  dataDispatch({type: 'LOADING_DATA', payload: null})
  console.log('submit add handler')
  async function callBackendAPI(){
    try {
      const response = await fetch("http://localhost:3500/save", {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',

        body: JSON.stringify({
          front: sanitize(newCard.front),
          back: sanitize(newCard.back)
        })}
      );
      if (!response.ok) {
        const msg = await response.text()
        dataDispatch({type: 'DATA_ERROR', payload: msg})
        
      } else {
        const json = await response.json()
        dataDispatch({type: 'GET_DATA', payload: json})
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return callBackendAPI();
}

export  function deleteHandler(flashcard, dataDispatch)
 {
  dataDispatch({type: 'LOADING_DATA', payload: null})
  async function callBackendAPI() {
    const response = await fetch('http://localhost:3500/delete', {
      method: 'post',
      headers: {
        'Content-Type' : 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(flashcard)
    })
    if(!response.ok){
      const msg = await response.text()
      dataDispatch({type: 'DATA_ERROR', payload: msg})
    } else {
      const b = await response.json()
      dataDispatch({type: 'GET_DATA', payload: b})
    }
  }
  return callBackendAPI();

}

export async function signupHandler(event, userDispatch) {
  const data = new FormData(event.target)
  const user = data.get('username');
  const pass = data.get('password');
  console.log(JSON.stringify({
    user: user,
    password: pass
  }))
  userDispatch(undefined, {type: 'LOADING_USER', payload: null})
  const request = await fetch('http://localhost:3500/signup', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      user: user,
      password: pass
    })
  })
  if (request.ok) {
    const result = await request.json()
    userDispatch(undefined, {type: 'GET_USER', payload:{result}
    })
  } else if(request.status == 500) {
    const body = await request.text()
    console.log(body)
    userDispatch(undefined, {type: 'USER_ERROR', payload: body})
  } else if (request.status == 404) {
    const body = await request.text()
    console.log(body)
    userDispatch('USER_ERROR', {type: 'USER_ERROR',payload: body})
  }
}


export async function loginHandler(event, userDispatch) {
  const localhost = 'http://localhost:3500/'
  const data = new FormData(event.target)
  const user = data.get('username');
  const pass = data.get('password');
  userDispatch( {
    type:'LOADING_USER',
    payload: null
  })
  const request = await fetch(localhost + 'login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      user: user,
      pass: pass
    })
  }
  
  )
  if(!request.ok) {
    const msg = await request.text()
    userDispatch({
      type:'USER_ERROR',
      payload: msg
    })
  } else {
    const result = await request.json()
    console.log(result.user)
    userDispatch({
      type:'GET_USER',
      payload: result.user
    })
  }
}

export async function addSetHandler(event, dataDispatch){
  const data = new FormData(event.target)
  const name = data.get('name');
  const description = data.get('description');
  console.log('adding')
  dataDispatch({
    type: 'LOADING_DATA',
    payload: null
  })
  const request = await fetch("http://localhost:3500/createSet", {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      name, description
    })
  })
  if(request.ok) {
    const result = await request.json()
    console.log(result)
    dataDispatch({
      type: 'GET_DATA',
      payload: result
    })
  } else{
    const msg = await request.text()
    dataDispatch({
      type: 'DATA_ERROR',
      payload: msg
    })
  }

}


// select set handler initially loads the actual flashcard information in
// if data exists, should come with a set name, set description, and set contents
export async function selectSetHandler(event, dataDispatch, setname, description) {

{
    const response = await fetch(`http://localhost:3500/selectSet`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        setname,
        description
      })
    })

    if(response.ok) {
      const result = await response.json()
      dataDispatch({
        type: 'GET_DATA',
        payload: result
      })
    } else {
      const msg = await response.text()
      dataDispatch(undefined, {
        type: 'DATA_ERROR',
        payload: msg
      })
    }
  }
}


export async function loadSetHandler(dataDispatch) {
  dataDispatch({
    type:'LOADING_DATA',
    payload: null
  })
  const response = await fetch(`http://localhost:3500/listSets`, {
    method: 'get',
    credentials: 'include'
  })
  if(response.ok) {
    console.log('reee')
    const result = await response.json()
    dataDispatch( {
      type:'GET_DATA',
      payload: result
    })
  } else {
    const result = await response.text()
    dataDispatch( {
      type:'DATA_ERROR',
      payload: result
    })
  }

}

export async function firstReloadHandler( userDispatch, dataDispatch){
  userDispatch({
    type:'LOADING_DATA',
    payload: null
  })
  const userExists = await fetch('http://localhost:3000/',{method: 'get', credentials: 'include'})
  if(userExists.ok){
    const response = await userExists.json()
    if(response.ok){
      const user = response.user
      const data = response.current_set
      userDispatch({type: 'GET_USER', payload: user})
      if(data) {
        dataDispatch({type: 'GET_DATA', payload: data})
      }
    } else {
      userDispatch({type: 'CLEAR_USER'})
    }
    
    
    

  }
  
}
export * from './serverEventHandlers'








