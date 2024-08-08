import React from 'react';
import ReactDOM from 'react-dom/client';
import {CookiesProvider, useCookies} from 'react-cookie';
import {ProfileView, PicSelector} from './components/userMenu/viewProfile';
import './index.css';
/* styles*/
import './styles.css'
import { UserProfile } from './components/userMenu/viewOtherProfile';
import './styles/login.css';
import './styles/navbar.css';
import './styles/searchMenu.css';
import './styles/profile.css';
import {App, C} from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  useParams,
  redirect,
  useLoaderData,
} from "react-router-dom";
import CreateHeader from './components/CreateHeader';
import SearchResults from './components/userMenu/searchResults';
import OptionsMenu from './components/userMenu/OptionsMenu';

const dataLoader = async () => {
  const data = await fetch('http://localhost:3500/',{method: 'get', credentials: "include", headers: {"Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": true,      
    "Access-Control-Allow-Headers": true, 
    "Access-Control-Allow-Methods": true }})
  if (!data.ok) {
    console.log(data)
    return redirect("/t");
  }
  console.log(data)
  if(data.ok) {
    return data;
  } else {
    console.log('asdijfodisajiofsdjoijss')
    console.log(data)
    return redirect('/login')
  }
};

/*function loader({request, params}) {
  async function callBackendAPI() {
    const userExists = await fetch('http://localhost:3500/',{method: 'get', credentials: "include", headers: {        "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": true,      
      "Access-Control-Allow-Headers": true, 
      "Access-Control-Allow-Methods": true }})
    if(userExists.ok){
      const response = await userExists.json()
      if(response){
        const user = response
        console.log(user)
        const data = response.current_set
        userDispatch({type: 'GET_USER', payload:  user.user_name})
        if(data) {
          dataDispatch({type: 'GET_DATA', payload: response})
        }
      } else {
        userDispatch({type: 'CLEAR_USER'})
      }
    }

  }
  callBackendAPI()
}*/

function B(){
  const r = useLoaderData()
 return (
   <div>
    <p>{JSON.stringify(r)}</p>
    <a href='/test'>hello</a>
    <h1> Hello</h1>
  </div>
  )
}
const router = createBrowserRouter([{
  path: '/',
  element: (<App></App>),
  children: [
    {path: '', element: (<C></C>)},
    {
      path: '/:user',
      element: (
        <ProfileView useParams={useParams}></ProfileView>
      ),
      children: [
        {
          path: '/:user/profilepic',
          element: <PicSelector></PicSelector>
        },
        {
          path:'/:user/profile/update', 
            loader: async function({request}){
              const url = new URL(request.url);
              const searchTerm = url.searchParams.get('description');
              if(!searchTerm){
                console.log('blehhh')
                redirect('')
                return null;

              } else {
                const response = await fetch(`http://localhost:3500/updateDescription`, {method: 'post', credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({description: searchTerm})}
                 )
                if(!response.ok){
                  console.log('eep')
                  redirect('')
                  return null;
                } else {
                  console.log('success')
                  redirect('')
                  return true;
                }
              }
            }

        }
        
      ]
    },
    {
      path: '/:user/options',
      element: <OptionsMenu></OptionsMenu>
    },
    {
      path: '/search/sets',
      loader: async function({request}){
        const url = new URL(request.url);
        const searchTerm = url.searchParams.get('term');
        const body = {
          type: 'user',
          user: searchTerm
        }
        const result = await fetch('http://localhost:3500/search/' + searchTerm,{method: 'get', credentials: 'include', headers: {
          'Content-Type': 'application/json'
        }
        })
        if(!result.ok){
          console.log('one less problem without you')
          return null;
        } else {
          
          const jsonResult = await result.json()
          return jsonResult;
        }

      },
      element:<SearchResults></SearchResults>
    }, {
      path: 'users/:user',
      children: [
        {
          path: 'profile',
          loader:  async function ({params}){
            console.log(params)
            const searchTerm = params.user;
            console.log(searchTerm)
            const body = {
              type: 'user',
              set: searchTerm
            }
            const result = await fetch('http://localhost:3500/users/' + searchTerm,{method: 'get', credentials: 'include'
            })
            if(!result.ok){
              console.log('one less problem without you')
              return null;
            } else {
              console.log('yeah were so back')
              const jsonResult = await result.json()
              console.log(jsonResult)
              return jsonResult;
            }
            return null;
          },
          element: <UserProfile></UserProfile>,
          children: [{
            
          }

          ]
        }

      ]
      

    }
  ]
}]
  
  
)
// React browser router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
      <React.StrictMode>
        <RouterProvider router={router}>

        </RouterProvider>
        
        
      </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
