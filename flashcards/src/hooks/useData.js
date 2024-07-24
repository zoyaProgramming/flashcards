
import { useState, useEffect } from 'react';

export default function useData() {
  const[dataState, setDataState] = useState(null);
  useEffect(() => {
    const [data, setData] = useState(null)
    const port = 'http://localhost:3500/'

    useEffect(() => {
      console.log('test')
      fetch(`${port}sets`, props.body?options:{method: 'get'})
        .then((res) => res.json())
        .then((data) => {
          setData(data)})

    }, [url])
  return data;

  })
}