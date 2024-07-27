import { useState, useEffect } from 'react';
import { useFetchGet } from './serverHooks';
import useFetch from './useFetch';
import sanitize from '../functions/sanitize';
export default function useDeleteFunction(props)
 {
  console.log(props)
  const data  = useFetch(props.url, {
    method: 'post',
    body: JSON.stringify({
      front: props.front,
      back: props.back
    })
  })
  useEffect(() => {
    props.setData(Math.random())
  }, [data])
}

