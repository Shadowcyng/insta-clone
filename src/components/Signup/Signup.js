import React,{useState} from 'react'
import { auth, db } from '../firebase/firebase'
import { Button } from '@material-ui/core'
import firebase from 'firebase'

function Signup({setRoute, username, setUsername}) {
    const[email,setEmail]= useState('')
    const[password,setPassword] = useState('')
    
    

    const signUp = (event) =>{
        event.preventDefault();
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(authUser=>{
          authUser.user.updateProfile({
            displayName:username
          })
          db.collection('users').add({
            username:username,
            email:email,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            profilePicture:''
          })
          setRoute('home')
        //  console.log(username)
          })
        .catch(error=>{alert(error.message)
        })
        
      }
      
    return (
        <div>
             <div className='signup'>
             <div className='signup__body'>
<center>
    <form className='signup__header'>
    <center>
     <img className='signup__headerImage' 
      src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
      alt='InstaLogo' />
    </center>  
    <input
  className='signup__input'
  placeholder='Username' 
  type='text' 
  value={username}
  onChange={(event)=>setUsername(event.target.value)}
  />   
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
  className='signup__button'
  disabled={!(email && password && username)}
  onClick={signUp}> Sign up </button>
  
  </form>
  <div className='signup__link'>
    <p>Have an account?<Button className='signup__linkButton' onClick={()=>setRoute('login')} >
        <strong>Login</strong>
        </Button>
        </p>

  </div>
</center>
</div>
</div>
        </div>
    )
}

export default Signup
