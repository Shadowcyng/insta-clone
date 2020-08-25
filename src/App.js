import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './components/post/Post';
import { db,auth, storage } from './components/firebase/firebase';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { Modal, makeStyles, Button, Input,  Avatar } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed';
import Login from './components/Signup/Login';
import Signup from './components/Signup/Signup';
import firebase from 'firebase'
import Loading from './components/Loading/Loading';
import ForgetPassword from './components/Signup/ForgetPassword';
import 'bootstrap/dist/css/bootstrap.css';

import {  Nav, Navbar } from 'react-bootstrap';



//for modal styling
function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const[posts,setPosts] = useState([])
  const[username,setUsername] = useState('')
  const[user,setUser] = useState(null)
  const[route,setRoute]=useState('')
  const[open,setOpen]=useState(false)
  //const[openProfile,setOpenPorfile] = useState(false)
  const[userId,setUserId] = useState({})
  //for modal and post image
  const [modalStyle] = React.useState(getModalStyle);
  //
  const[image,setImage] = useState(null);
  const[caption,setCaption] = useState('');
  const[progress,setProgress] = useState(0);
  // function  for  modal  
  const classes=useStyles()
   
  const handleChange = (e) =>{
      if(e.target.files){
          setImage(e.target.files[0])
      }
  }
  const handleUpload=(event)=>{
      event.preventDefault()
      const uploadTask = storage.ref(`images/${image.name}`).put(image)
      uploadTask.on('state_changed',
          (snapshot)=>{
              //Progress function
              const progress = Math.round(
                  (snapshot.bytesTransferred/snapshot.totalBytes)*100
                  );
              setProgress(progress)
          },
          (error)=>{
              //error funtion
              console.log(error.message)
              alert(error.message)
          },
          ()=>{
              //Upload complete function
              storage
                  .ref('images')
                  .child(image.name)
                  .getDownloadURL()
                  .then(url=> {
                      //post image inside the database
                      db.collection('posts').add({
                          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                          caption:caption,
                          username:user.displayName,
                          imageUrl:url,     
                      })
                  })
                  setProgress(0);
                  setCaption('')
                  setImage(null)
                  document.getElementById('file').value=null;
                  setOpen(false)   
          }
          ) }
        
      //     const uploadProfile =(event)=>{
      //       event.preventDefault()
      //       const uploadTask = storage.ref(`images/${image.name}`).put(image)
      // uploadTask.on('state_changed',
      //     (snapshot)=>{
      //         //Progress function
      //         const progress = Math.round(
      //             (snapshot.bytesTransferred/snapshot.totalBytes)*100
      //             );
      //         setProgress(progress)
      //     },
      //     (error)=>{
      //         //error funtion
      //         console.log(error.message)
      //         alert(error.message)
      //     },
      //     ()=>{
      //         //Upload complete function
      //         storage
      //             .ref('images')
      //             .child(image.name)
      //             .getDownloadURL()
      //             .then(url=> {
      //                 //post image inside the database
      //                 db.collection('users').doc(userId.toString()).set({
      //                   profilePicture :url  
      //                 },{merge:true})
      //             })
      //             setProgress(0); 
      //             setImage(null)
      //             document.getElementById('profile').value=null;
      //             setOpenPorfile(false)   
      //           })
      //     }

  useEffect(() => {
    //For Authorization
   const unsubscribe =  auth.onAuthStateChanged((authUser=>{
      if(authUser){
        //User has logged in
        console.log(authUser)
        setUser(authUser)
        setRoute('home')
      }else{
        //User has logged out
        setUser(null)
        setRoute('login')
      }
      return ()=>{
        unsubscribe();
      }
    }))
  }, [user])

  useEffect(() => {
    // to get posts on screen
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({
        id: doc.id,
        post: doc.data(),
      })))
    })
    db.collection('users').onSnapshot(snapshot=>{
      setUserId(snapshot.docs.map(doc=> doc.id))
    })
    //Every Single time,a Post added or changes, this piece of code fires  
  }, []);  
  return (<>
   {
   (route==='login') ?
     <Login  setRoute={setRoute} /> :
     (route==='signup') ?
     <Signup setRoute={setRoute} username={username} setUsername={setUsername} /> :
     (route==='home') ?
     <div className="app">
     {/*Header */}
     <div className='app__header'>
       <img className='app__headerImage' 
       src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
       alt='InstaLogo' />
     {user &&  
     (
      <Navbar bg="white" expand="lg">
  
  <Navbar.Toggle class='navbar__toggle'> <Avatar  class='navbar__toggle'  alt={user.displayName} src="/static/images/avatar/1.jpg" /> </Navbar.Toggle>
     
  <Navbar.Collapse id="basic-navbar-nav" >
    <Nav className="mr-auto">
    <Button onClick={()=>{
     setOpen(true)}
    } > New Post </Button>     
   <Button onClick={()=>{
   auth.signOut()
  setRoute('login')
  }}>Logout</Button>
  </Nav>
 </Navbar.Collapse>
</Navbar>
        )
     }
     </div> 
     {/*Post */}
     <div className='app__posts'>
     <div className='app__postsLeft'>
       { posts.map(({id,post}) => 
         <Post key={id}
          postId={id} 
         imageUrl={post.imageUrl} 
         username={post.username} 
         caption={post.caption}
         user={user} 
        //  profilePicture={ db.collection('users').doc(userId.toString()).profilePicture.toString()}
         />
         )
       }
     </div>
     <div className='app__postsRight'>
       <InstagramEmbed
         url='https://www.instagram.com/p/B9mVSCqlxHD/?utm_source=ig_web_copy_link'
         maxWidth={320}
         hideCaption={false}
         containerTagName='div'
         protocol=''
         injectScript
         onLoading={() => {}}
         onSuccess={() => {}}
         onAfterRender={() => {}}
         onFailure={() => {}}
       />
       <InstagramEmbed
         url='https://www.instagram.com/p/B_7pXOBFJpE/?utm_source=ig_web_copy_link'
         maxWidth={320}
         hideCaption={false}
         containerTagName='div'
         protocol=''
         injectScript
         onLoading={() => {}}
         onSuccess={() => {}}
         onAfterRender={() => {}}
         onFailure={() => {}}
       />
   </div>
   </div>
  </div>:
  (route==='forget password')?
  <ForgetPassword setRoute={setRoute} userId={userId} /> :
  <Loading />
   }
       <Modal
        open={open}
        onClose={()=>setOpen(false)}
        >
         <div  style={modalStyle} className={classes.paper}>
         <div className='imageUpload'>
        <center>
            <div className='imageUpload__header'>
            
            <AddAPhotoIcon className='imageUpload__icon'/>
       <progress className='imageUpload__progress'  max='100' value={progress} /> {progress}%
      <form>
        <Input className='imageUpload__input' 
        type='file' id='file' 
        onChange={handleChange} 
        
        />
            <Input className='imageUpload__input'
            type='text'
            placeholder='Enter a caption...' 
            value={caption} 
            onChange={e=>setCaption(e.target.value)} />  
        <button 
          type='submit'
          disabled={!image}
          className='imageUpload__button' 
          onClick={handleUpload}> Post </button>
          </form>
        </div> 
        </center>
        </div>        
        </div>
      </Modal>


    {/* Porfile picture modal */}
        {/* <Modal
          open={openProfile}
          onClose={()=>setOpenPorfile(false)}
          >
          <div  style={modalStyle} className={classes.paper}>
          <div className='imageUpload'>
          <center>
              <div className='imageUpload__header'>
              
              <AddAPhotoIcon className='imageUpload__icon'/>
        <progress className='imageUpload__progress'  max='100' value={progress} /> {progress}%
        <form>
          <Input className='imageUpload__input' 
          type='file' id='profile' 
          onChange={handleChange} 
          
          />
            
          <button 
            type='submit'
            onClick={uploadProfile}
            className='imageUpload__button' 
            > Post </button>
            </form>
          </div> 
          </center>
          </div>        
          </div>
        </Modal>
      
     */}
    </>
  );
}

export default App;
