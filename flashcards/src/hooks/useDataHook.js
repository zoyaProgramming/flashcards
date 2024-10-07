import { useEffect } from "react"
export function useDataHook( userDispatch, dataDispatch, setPic, rgb){
  

  useEffect(()=> {
    console.log('reload')
    userDispatch({
      type:'LOADING_DATA',
      payload: null
    })
    async function callBackendAPI() {
      console.log('rgb changed')
      const userExists = await fetch('http://localhost:3500/',{method: 'get', credentials: "include", headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": true,      
        "Access-Control-Allow-Headers": true, 
        "Access-Control-Allow-Methods": true }})
      if(userExists.ok){
        const response = await userExists.json()
        if(response){
          const user = response
          console.log(user.user)
          const data = response
          
          userDispatch({type: 'GET_USER', payload:  user.user})
          if(data) {
            dataDispatch({type: 'GET_DATA', payload: response})
            if(setPic ){
              console.log("mmm")
              const test= await fetch('http://localhost:3500/profilepic', {method: 'get', credentials: "include", headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": true,      
                "Access-Control-Allow-Headers": true, 
                "Access-Control-Allow-Methods": true }})
                const c = await test.arrayBuffer()
                if(!c){
                  return
                } else {
                  console.log('getting pic...')
                  const uint16array = new Uint8Array(c)
                  const Blob = new File([uint16array], 'name', {'type' : 'image/jpeg'});
                  const url = URL.createObjectURL(Blob);
                  setPic(url)
                }
            }
          }
        } else {
          console.log('aaaa')
          userDispatch({type: 'CLEAR_USER'})
        }
      } else {
        const errorMsg = await userExists.text()
        console.log('Error: ' + errorMsg)
      }

    }
    callBackendAPI()

  }, [rgb])
}