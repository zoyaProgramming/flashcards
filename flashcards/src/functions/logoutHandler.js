import { redirect } from "react-router-dom"
export default async function logoutHandler(userDispatch, dataDispatch){
  console.log('b')
  const response = await fetch('http://localhost:3500/logout', {credentials: 'include', method: 'post', headers: {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": true,      
    "Access-Control-Allow-Headers": true, 
    "Access-Control-Allow-Methods": true }})
  if(!response.ok){
    userDispatch({type: 'USER_ERROR'})
    dataDispatch({type: 'DATA_ERROR'})
    console.log('error logging out')
  } else {
    userDispatch({type: 'CLEAR_USER'})
    dataDispatch({type: 'CLEAR_DATA'})
  }
}