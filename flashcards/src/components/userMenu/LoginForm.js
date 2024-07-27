import { useState } from "react"
import { loginHandler } from "../../functions/serverEventHandlers"

export  function LoginForm({setLoginFormOpen, userDispatch}) {
    return(
      <div className="div--login-form">
        <h1>Login</h1>
        <form className="form--login-form" onSubmit={(event) => {
          loginHandler(event, userDispatch)
          event.preventDefault()
          console.log('submit captured')
        }}>
          <label className = "form__label--login" htmlFor="user">user: </label>
          <input id="username" name="username"></input>
          <label className= "form__label--login" htmlFor="password">password: </label>
          <input id="password" name="password"></input>
          <button className="form__bttn--submit--login" type="submit" onClick={() => {
            console.log('submit clicked')
            }}>
              submit</button>
          
          
        </form>
      </div>
    )
}
