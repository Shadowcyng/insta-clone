import React, {useState} from 'react'
import { Button, } from '@material-ui/core'
import './Login.css'
import { auth} from '../firebase/firebase'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


function ForgetPassword({setRoute}) {
    const[email,setEmail]= useState('')

    const resetPassword = (event) =>{
        event.preventDefault()        
        auth.sendPasswordResetEmail(email).then(data=>{
        alert('Password reset link has been sent to your email, please Check inbox');
        setRoute('login')
        }).catch(err=>alert(err.message))
    }
    return (
        <div className='signup'>
            <div  className='forgetPassword__headerImage'>
        <img 
         src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
         alt='InstaLogo'  />
         </div>
          <div className='signup__body'>
        <center>
            <form className='signup__header'>
            
            <LockOutlinedIcon className='forgetPassword__icon' />
            <h1 className='forgetPassword__h1'>Trouble Loging in?</h1>
            <p className='forgetPassword__p'>
                Enter your email and we'll send you a link to reset your Password.
            </p>
            <input placeholder='Email' 
            className='signup__input'
            type='text'  
            value={email}
            onChange={(event)=>(setEmail(event.target.value))} 
            />
         
          <button 
          type='submit'
          disabled={!email}
          className='signup__button'
          onClick={resetPassword} 
          > Reset Password 
          </button>
          <Button 
          className='signup__forgetPassword'
          onClick={()=>setRoute('signup')}
          >
          Create New Account </Button>
        
          </form>
          <div className='signup__link'>
          
              <Button className='signup__linkButton' onClick={()=>setRoute('login')} >
              <strong>Back to Login</strong>
              </Button>
          </div>
        </center>
        </div>
        </div>
      
    )}

export default ForgetPassword
