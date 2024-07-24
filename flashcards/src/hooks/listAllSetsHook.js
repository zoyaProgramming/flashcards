import { useState, useEffect } from "react"

export default function useSets(props) {
  const [data, setData] = useState(null)
  const port = 'http://localhost:3500/'

  useEffect(() => {
    console.log('doing')
    fetch("http://localhost:3500/sets", {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        console.log(res)
        
        res.json().then((data) => {
          console.log(data.data)
          setData(data.data)
        })
        })
      

  }, [])
  return data;
}