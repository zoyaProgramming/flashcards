
import { useEffect, useState } from "react";
import { useLoaderData,  } from "react-router-dom";
function usePic(test, setPic) {
  useEffect(() => {
    async function promiseSync(){

      function base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      }

      const c = base64ToArrayBuffer(test);
      console.log(c)
      if(!c){
        console.log('yeahhh')
        return
      } else {
        console.log('getting pic...')
       // const uint8array = new Uint8Array(c)
      //  console.log(uint8array)
        const Blob = new File([c], 'name', {'type' : 'image/png'});
        const url = URL.createObjectURL(Blob);
        console.log(url)
        
        console.log('size: ' + Blob.size)
        setPic(url)
      }
    }
    promiseSync()
  }, [test])
    
  }


function ProfileIcon({userData, profile_pic, isDark}) {
  const [src, setPic] = useState(null);
  const pp = usePic(userData.data, setPic);
 


  const c = profile_pic;
  return (
        <img className={"img--profile-icon-search-results " + isDark} src={src} height={50} width={50}>
        </img>
        
  )
}

export default function SearchResults({results, isDark}) {
  const [openedMenus, setOpenedMenus] = useState({users: true, sets: false})
  const [selected, setSelected] = useState(0)
  const test = useLoaderData();

  if(test){
    let resultsMapped=[]
    if(selected==0 && Array.isArray(test.users)) {
       resultsMapped = test.users.map((value)=> {
        if(value.user_name){
          return(
            <li className="li--user">
              <ProfileIcon userData={value} isDark={isDark}></ProfileIcon>
                <a className={"link " + isDark} href={"/users/" + value.user_name +'/profile'}>{value.user_name}</a>
            </li>
          )
        } else {
          return(
                <li className="li--link-sidebar">
                  <a className={"link " + isDark}href={"/users/" + value.user_id + "/sets" + value.set_name}>{value.set_name}</a>
                  <button className={"material-symbols-outlined button--add " + isDark}>add</button>
                </li>
          )
        }
      })
    } else if (selected==1 && Array.isArray(test.sets)){
      resultsMapped = test.sets.map((value)=> {
        if(value.user_name){
          return(
            <li className="li--search-results">
                <a className={"link " + isDark} href={"/users/" + value.user_name +'/profile'}>{value.user_name}</a>
              </li>
          )
        } else {
          return(
                
                <li className="li--search-results">
                  
                  <a className={"link " + isDark}href={"/users/" + value.user_id + "/sets" + value.set_name}>{value.set_name}</a>
                  <button className={"material-symbols-outlined button--add " + isDark}>add</button>
                </li>
          )
        }
      })

    }
    
    return(
      <>
        <div className={"div--search " + isDark} style={{padding: "20px"}}>
            <h1 className="h1--results">Results for <span className="span--dark">"{test.term}"</span></h1>
              <div className="scroller-items">
                <a className={"select--result" + (selected===0?" selected":"")}
                onClick={() => {
                  setSelected(0)}}>users</a>
                <a className={"select--result" + (selected===1?" selected":"")}
                onClick={() => {setSelected(1)}}
                >sets</a>
            </div>
          </div>



        <div>
          <ul  className="ul--search" style={{width: '100%'}}>
            
            {resultsMapped}
          </ul>
        </div>
      </>
    )
  }
  if(true){
    return(
      <p>{"good lord"}</p>
    )

  }
  if(!(results) || !(results.data)) {
    <p>{test}</p>
    return (<p>damn{JSON.stringify(results.results)}</p>);
  } else {
    const resultsMapped = results.data.map((value)=> {
      return(
       
            <li className="li--link-sidebar">
              {value.set_name}
              <button className={"material-symbols-outlined button--add " + isDark}>add</button>
            </li>
            
      )
      })
    return (
      <>

        <div className={"div--search " + isDark} >
          <h1>Sets: </h1>
          <ul style={{width: '100%'}}>
            {resultsMapped}
          </ul>
        </div>
      </>
    )
    }
}
export  function SearchResults1(){
  const [openedMenus, setOpenedMenus] = useState({users: true, sets: false})
  const [selected, setSelected] = useState(0)
  return(
      <>
      
          <div style={{padding: "20px"}}>
            <h1 className="h1--results">Results for test a</h1>
              <div className="scroller-items">
                <a className={"select--result" + (selected===0?" selected":"")}
                onClick={() => {
                  setSelected(0)}}>users</a>
                <a className={"select--result" + (selected===1?" selected":"")}
                onClick={() => {setSelected(1)}}
                >sets</a>
            </div>
          </div>


        <div className="div--search-results-users">
          <a className="bttn--search-results-open-users" 
          onClick={() => {
            setOpenedMenus({...openedMenus, users: !openedMenus.users})
          }}>users</a>
          <ul className="ul--search-results" style={{visibility: openedMenus.users?'visible':'collapse'}}>
            <li className="li--search-results">
              test item
            </li>
            <li className="li--search-results">
              test item
            </li>
            <li className="li--search-results">
              test item
            </li>
          </ul>
          
        </div>
        <div>
        <a className="bttn--search-results-open-users" onClick={() => {
        setOpenedMenus({...openedMenus, sets: !openedMenus.sets})}}>sets</a>
          <ul className="ul--search-results" style={{visibility: openedMenus.sets?'visible':'collapse'}}>
            <li className="li--search-results">
            test item
            </li>
            <li className="li--search-results">
            test item
            </li>
            <li className="li--search-results">
            test item
            </li>
        </ul>
      
        </div>
      </>
  )
}