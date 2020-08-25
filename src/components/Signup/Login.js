import React, {useState} from 'react'
import { Button, } from '@material-ui/core'
import './Login.css'
import { auth } from '../firebase/firebase'
import firebase from 'firebase'


function Login({setRoute}) {
    const[email,setEmail]= useState('')
    const[password,setPassword] = useState('')

    const  login = (event) =>{
        event.preventDefault();
        auth.signInWithEmailAndPassword(email,password)
        .then(()=>setRoute('home'))
        .catch(error=>alert(error.message))
        
      }
      const googleSignin = (event)=> {
        event.preventDefault()
        var provider = new firebase.auth.GoogleAuthProvider();
         firebase.auth()
         .signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            setRoute('home')
            console.log(token)
            console.log(user)
         }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
          
            console.log(error.code)
            console.log(error.message)
         });
      }
    return (
    
        <div className='signup'>
          <div className='signup__body'>
        <center>
            <form className='signup__header'>
            <center>
             <img className='signup__headerImage' 
              src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
              alt='InstaLogo' />
            </center>  
            <input placeholder='Email' 
            className='signup__input'
            type='text'  
            value={email}
            onChange={(event)=>(setEmail(event.target.value))} 
            />
          <input
          className='signup__input'
          placeholder='Password' 
          type='password' 
          value={password}
          onChange={(event)=>(setPassword(event.target.value))}
          />    
          <button 
          type='submit'
          disabled={!(email && password)}
          className='signup__button' 
          onClick={login}> Login </button>
          <Button className='signup__google' onClick={googleSignin}>
            <img alt='google' className='signup__googleIcon' src='https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png' />
            Log in with Google
            </Button>
           <Button 
          className='signup__forgetPassword'
          onClick={()=>setRoute('forget password')}
          >
          Forget password? </Button>
          </form>
          <div className='signup__link'>
            <p>
              Don't have an account?
              <Button className='signup__linkButton' onClick={()=>setRoute('signup')} >
              <strong>Signup</strong>
              </Button>
              </p>
          </div>
        </center>
        </div>
        </div>
      
    )}

export default Login
