import { useState, useEffect } from "react"
export default function useFetch(url, props) {
  
  const [data, setData] = useState(null)
  const port = 'http://localhost:3500/'
  const options = {
    method: props.method!==undefined?props.method:'get',
    headers: {
      "Content-Type": "application/json"
    },
    body:props.body!==undefined?props.body:{a:'t'}
  }
  
  useEffect(() => {
    if(url !== undefined && url !== null) {
      fetch(`${port}${url}`, props.body?options:{method: 'get'})
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        if(props.setData){
          props.setData(data)
        }
      })
    }
  }, [url])
  return data;
}