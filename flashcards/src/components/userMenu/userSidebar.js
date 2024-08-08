import { useContext } from "react"
import { UserContext } from "../../App"

import { useNavigate } from "react-router-dom"
import logoutHandler from "../../functions/logoutHandler"

export function UserSidebar({UserContext, userDispatch, dataDispatch, setIsDark, DarkmodeContext}){
  const user = useContext(UserContext)
  const isDark = useContext(DarkmodeContext)

  const navFunction = useNavigate()

  if(user) {return(
      <>
        <div className={"user-sidebar " + isDark}>
          <ul className={"ul-links " + isDark}>
            <a href={"/" + user.user_name}><li className={"li--link-sidebar " + isDark}>View Profile</li></a>
            <a href={"/" + user.user_name + '/options'}> <li className={"li--link-sidebar " + isDark}>Account Options</li></a>
            <li className={"li--link-sidebar " + isDark} onClick={() => {userDispatch({type: "SWITCH_MODE"})}}>Change Theme</li>
            <li className={"li--link-sidebar " + isDark} onClick={() => {logoutHandler(userDispatch, dataDispatch)
              navFunction('')
            }}>Log out</li>
            <li className={"li--link-sidebar " + isDark}>Switch accounts</li>
            <></>
          </ul>
        </div>
        </>
    )
}
}