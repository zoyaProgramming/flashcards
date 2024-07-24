
import { useContext , useState} from "react"
import useFetch from "../hooks/useFetch"
export default function DeleteConfirmation(props) {
  const TestContext = useContext(props.TestContext)/*stores the rowid  */
  const [url, setUrl] = useState(null)
  useFetch(url, {
    setData: props.setData
  })
  function deleteFnc(){
    setUrl(
      `${TestContext}/delete`
    )
  }
  if(props.url === null){
    return(
      <h1>cannot delete {props.name}</h1>
    )

  } else if(props.function === null) {
    return(null)
  } 

  return(
    <div className="div--center-overlapping">
      <h1 className="h1--delete-confirmation">Would you like to delete {props.name}?</h1>
      <button className="button--delete-confirmation" onClick={deleteFnc}>yes</button>
      <button className="button--delete-confirmation" onClick={() => {props.setDel(false)}}>no</button>
      

    </div>
  
  )

}