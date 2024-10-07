import { useState } from "react"
import { loginHandler } from "../../functions/serverEventHandlers"
import { Form } from "react-router-dom"

export  function LoginForm({setFormsOpen, userDispatch, setProfilePic, dataDispatch}) {
    return(
      <div className="div--login-form">
        <h1>Login</h1>
        <Form className="form--login-form"  method= "POST" onClick={()=>{console.log('clicked')}}>
          <label className = "form__label--login" htmlFor="username">user: </label>
          <input id="username" name="username"></input>
          <label className= "form__label--login" htmlFor="password">password: </label>
          <input id="password" name="password"></input>
          <button className="form__bttn--submit--login" type="submit">submit</button>
        </Form>
      </div>
    )
}
