

import { useState, useEffect } from 'react';
import useFetch from './useFetch';
import sanitize from '../functions/sanitize';






export function useFetchGet(props) {
  const [data, setData] = useState(null)


}

export function useCleaning() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const callBackendAPI = async () => {
      try {
        const response = await fetch("http://localhost:3500/clean", {
          method:'get',
          headers: {

            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("Cleaning Failed to fetch data");
        }
        const body =  await response.json();
        setData(body.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    callBackendAPI();
  }, []);
  return data;
}




export function useUpdate(props) {
  const [msg, setMsg] = useState(null);
  const [newCard, setNewCard] = useState({
    front: null,
    back: null,
    existing:null,
    oldFront: null,
    oldBack: null
  })
  console.log()
  const url1= props.id?props.id:""
   const url2 =  newCard.existing?"/update":"/save"
   const url = "/" + url1 + url2

  useEffect(() => {
    
    if(props.id === null) {
      console.log(newCard)
    } else if(newCard.existing!== false && newCard.existing === null ) {
      console.log('shusfhauifdisujfiudajsfijiusfjduijsadiufjsui')
      setMsg('')
    }
    else{
      // save or update
      const callBackendAPI = async () => {

        try {
          console.log(url)
          const response = await fetch("http://localhost:3500" + url, {
            method: 'post',
            headers: {

              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              front: sanitize(newCard.front),
              back: sanitize(newCard.back),
              oldFront: newCard.oldFront?sanitize(newCard.oldFront):null,
              oldBack: newCard.oldBack?sanitize(newCard.oldBack):null
            })}
          );
          if(response.status==400) {
          }
          else if (!response.ok) {
            setMsg('error saving')
            throw new Error("Failed to fetch data");
          } else {
            setMsg(null)
          }
          const body = await response.json();
          
          props.setData(body.data)
          
        } catch (error) {
          console.error(error.message);
        }
      };
      callBackendAPI();
    }
    
  }, [newCard]);
  return [setNewCard, msg];

}





/*export function useFlashcardData(props){
  
  const [data, setData ] = useState(
    useFetch('/clean')
  )


  useEffect(() => {
    const newData = useFetch('/update', 
      {
        method:'post',
        headers: {
            
          "Content-Type" : "application/json"},
        body:   `{"front":${props.front}, "back":${props.back}}`
      }
    )
    setData(newData)
  }, [data])
  return [data, setData]
  

}*/

export function useUpdateProperties(props){
  const [state, setState] = useState(props.init)
  const [useChange, setChange] = useState({
    key: null,
    val: null
  })
  useEffect(() => {
  
    const clone = JSON.parse(JSON.stringify(state))
    if(Array.isArray(useChange) && useChange.length > 0) {
      useChange.forEach((card) => {
        clone[card.key] = card.val
      })
    } else if(useChange.key !== null && useChange.val !== null) {
      clone[useChange.key] = useChange.val
    }
      
    setState(JSON.parse(JSON.stringify(clone)))
  }, [useChange]
  )
  useEffect(() => {
    console.log('test')
  }, [props.flashcardSet])
  return [state, setChange]
}

export function useReact() {

  const [state, setState] = useState(0)
  useEffect(() => {
    setState(state + 1)
    
  },
    []
  )
  return state;
}


export function useUpdateTest(props) {
  return null;
}

export function  useFetchWithReload(url, props) {
  const [data, setData] = useState([null, null])
  const port = 'http://localhost:3500/'
  useEffect(() => {
    const callBackendAPI = async () => {
      
      if(url) {
        const response = await fetch(`${port}${url}`, {
          method: 'get'
        })
        if (!response.ok) {
          console.log('problem')
          console.log(response)
          setData([response, 404])
          return;
        } else {
          console.log(response)
          const jsonResult = await response.json()
          setData([jsonResult, 200])
        }
      }
    }
    callBackendAPI()
  }, [url, props.data])
  return data;

}

export function useLoading(props) {
  console.log('loading')
  const fetchedData = useFetchWithReload(props.id?props.id:"", {data: props.data})
  
  
  return fetchedData;
}

export function useFlashcardSetId(props){
  const fetchedData = useFetch('sets')
  useEffect(() => {
    if(Array.isArray(fetchedData)){
      props.setData(fetchedData)
    }
  }, [fetchedData])


}
export * from './serverHooks'