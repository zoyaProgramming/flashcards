import { useEffect } from "react"

export function useDataHook( userDispatch, dataDispatch){
  
  
  useEffect(()=> {
    console.log('reload')
    userDispatch({
      type:'LOADING_DATA',
      payload: null
    })
    async function callBackendAPI() {
      const userExists = await fetch('http://localhost:3500/',{method: 'get', credentials: 'include', headers: {"Content-Type": "application/json"}})
      if(userExists.ok){
        const response = await userExists.json()
        if(response){
          const user = response.user
          console.log(user)
          const data = response.current_set
          userDispatch({type: 'GET_USER', payload:  user})
          if(data) {
            dataDispatch({type: 'GET_DATA', payload: response})
          }
        } else {
          console.log(response.user)
          userDispatch({type: 'CLEAR_USER'})
        }
      }

    }
    callBackendAPI()

  }, [])
}