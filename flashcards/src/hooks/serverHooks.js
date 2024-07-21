

import { useState, useEffect } from 'react';
import sanitize from '../functions/sanitize';




export function useTestBackend(front, back) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const callBackendAPI = async () => {
      try {
        const response = await fetch("http://localhost:3500/api", {
          method: 'post',
          headers: {

            "Content-Type": "application/json"
          },
          body: `
          {
              "front": "${front}",
              "back": "${back}"
              }`

        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const body = await response.json();
       
        // setData(body.data);
      } catch (error) {
        console.log('err')
        console.error(error.message);
      }
    };
    callBackendAPI();
  }, []);
  return (
    <p> {data !== null ? data[data.length - 1].front : "null"}</p>);

}

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
  console.log('attemtping to update')
  const [data, setData] = useState(null);
  const [newCard, setNewCard] = useState({
    front: null,
    back: null,
    existing:null,
    oldFront: null,
    oldBack: null
  })
  const url=  newCard.existing?"/update":"/save"
  useEffect(() => {
    
    if(newCard.existing!== false && newCard.existing === null) {
      console.log('null')
      console.log(newCard)
      const callBackendAPI = async () => {
        try {
          const response = await fetch(("http://localhost:3500" + url), {
            method:'get',
            headers: {
  
              "Content-Type": "application/json"
            }
          });
          if (!response.ok) {
            throw new Error("Cleaning Failed to fetch data");
          }
          const body =  await response.json();
          props.setData(body.data);
        } catch (error) {
          console.error(error.message);
        }
      };
      callBackendAPI();
    }
    else{
      console.log('not' + url)
      const callBackendAPI = async () => {
        try {
          const response = await fetch("http://localhost:3500" + url, {
            method: 'post',
            headers: {

              "Content-Type": "application/json"
            },
            body: `
            {
                "front": "${newCard.front}",
                "back": "${newCard.back}"
                ${newCard.existing?
                  ',oldFront: ' +newCard.oldFront +
                  ', oldBack: '+newCard.oldBack+"}":"}"}`

          });
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const body = await response.json();
          props.setData(body.data)
        } catch (error) {
          console.log('err')
          console.error(error.message);
        }
      };
      callBackendAPI();
    }
    
  }, [newCard]);
  return setNewCard;

}

export function useFetch(url, props) {
  const [data, setData] = useState(null)
  const port = 'http://localhost:3500/'
  const options = {
    method: props.method!==undefined?props.method:'get',
    body:props.body!==undefined?sanitize(props.body):{}
  }
  console.log(`${port}${url}`)
  
  useEffect(() => {
    console.log('test')
    fetch(`${port}${url}`, options)
      .then((res) => res.json())
      .then((data) => {
        setData(data)})

  }, [url])
  return data;
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
  
 // x console.log('applebees' + JSON.stringify(state))
  const [useChange, setChange] = useState({
    key: null,
    val: null
  })
  const init = props.init;
  useEffect(() => {
  
    const clone = JSON.parse(JSON.stringify(state))
  //  console.log(useChange.key)
    clone[useChange.key] = useChange.val
    setState(JSON.parse(JSON.stringify(clone)))
  }, [useChange]
  )
 // console.log(state)
  return [state, setChange]
}

export function useReact() {

  const [state, setState] = useState(0)
  useEffect(() => {
    console.log(state)
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
  const [data, setData] = useState(null)
  const port = 'http://localhost:3500/'
  useEffect(() => {
    fetch(`${port}${url}`, {
      method: 'get'
    })
      .then((res) => res.json())
      .then((data) => {
        
        setData(data)})

  }, [url, props.data])
  return data;

}

export function useLoading(props) {
  const fetchedData = useFetchWithReload("fetch", {data: props.data})
  useEffect(() => {
    console.log(props.data)
    console.log(fetchedData)

  }
  ,[fetchedData, props.data])
  
  return fetchedData;
  
}
export * from './serverHooks'