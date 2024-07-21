import { useState, useEffect } from 'react';
import { useFetch, useFetchGet } from './serverHooks';
import sanitize from '../functions/sanitize';
export default function useDeleteFunction(props) {
  const data  = useFetch('/delete', {
    method: 'fetch',
    body: {
      front: sanitize(props.front),
      back: sanitize(props.back)
    }
  })
  useEffect(() => {
    props.setData(Math.random())
  }, [data])
}