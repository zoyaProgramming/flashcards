import { useState } from "react"
import { signupHandler } from "../../functions/serverEventHandlers"

export  function SignupForm({setSignupFormOpen, userDispatch}) {
  const [signupState, setSignupState] = useState(null)
  
    return(
      <div className="div--login-form">
        <h1>Create Account</h1>
        <form className="form--login-form" onSubmit={(event) => {
            signupHandler(event, userDispatch)
            event.preventDefault()
          }}>
          <p>{signupState}</p>
          <label className = "form__label--login" htmlFor="user" >user: </label>
          <input id="username" name="username"></input>
          <label className= "form__label--login" htmlFor="password">password: </label>
          <input id="password" name="password"></input>
          <button className="form__bttn--submit--login" type="submit" >submit</button>
          <button className="form__bttn--submit--login" type="submit" onClick={() => {
            console.log('submit clicked')
            setSignupFormOpen(false)
          }}>submit</button>
          
        </form>
      </div>
    )
}