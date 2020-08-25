import React,{useState,useEffect} from 'react'
import Avatar from '@material-ui/core/Avatar'
import './Post.css';
import { db } from '../firebase/firebase';
import firebase from 'firebase'
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite'
function Post(props) {

    const[comment,setComment] = useState(''); //singular commment
    const[comments,setComments] = useState([]); //array of comments
    const[likes,setLikes]=useState([])
    const { imageUrl, username, caption, postId, user } = props
    let count = 0;
    let exist =false;
    useEffect(() => {
        let unsubscribeComment;
        let unsubscribeLike;  
        if(postId){
       unsubscribeComment= db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp','asc')
        .onSnapshot(snapshot=>{
            setComments(snapshot.docs.map(doc=>({
                    comment:doc.data(),
                    id : doc.id
              }) )
            )
        })
        unsubscribeLike =db.collection('posts').doc(postId).collection('likes')
        .orderBy('timestamp','desc')
        .onSnapshot(snapshot=>{
            setLikes(snapshot.docs.map(doc=>({
                like:doc.data(),
                id:doc.id
            }
            
            )))           
        })
        
    }else{
            unsubscribeComment();
            unsubscribeLike();
        }
      }, [postId])

      const postComment = (event) =>{
          event.preventDefault()
          
          db.collection('posts').doc(postId).collection('comments').add({
              text:comment,
              username: user.displayName, 
              timestamp:firebase.firestore.FieldValue.serverTimestamp()
          })
          setComment('')
      }
      const del = () =>{
         db.collection('posts').doc(postId).delete()
      }
      
      const handleLike =(event) =>{
        event.preventDefault()
        let exist = false;
        likes.map(({like,id})=>{
            
                if(like.username === user?.displayName){
                    db.collection('posts').doc(postId).collection('likes').doc(id).delete()
                    .catch(err=>alert(err.message)) 
                    exist=true; 
                    }else{   
                    }
        })
       if(exist===false){
        db.collection('posts').doc(postId).collection('likes').add({
        username:user.displayName,
        timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch(err=>alert(err.message))
    }
      }
    return (
        <div className='post'>
            {/**header -> avatar + username*/}
            <div className='post__header'>
               {/* <div classsName='post__headerLeft'>  */}
            <div className='post__avatar'>   
            <Avatar 
                className='post__avatar'
                alt={username}
                src='aas'
                /> 
           <h3>{username}</h3>
           </div> 
           <div  className='post__headerButton' id='del'>
               {(username===user?.displayName) &&
           <Button onClick={del}><DeleteIcon fontSize='small' /></Button>
          }
           </div>
            </div>
            {/**Image */}
            <img className='post__image'  
            src={imageUrl}
            alt='Shadowcyng'
             />
                    {  
                        likes.map(({like,id})=> {
                            count=count+1;
                            
                            if(like.username === user?.displayName){
                                exist = true 
                                return <Button onClick={handleLike}> <FavoriteIcon style={{color:'#ED4956'}} id='like' className='post__like' /> </Button>
                            }
                        })
                    }
                   { (exist === false) &&
         <Button onClick={handleLike}  > <FavoriteBorderIcon style={{color:'#777777'}} id='like' className='post__like' /> </Button>   
}
                   {(count === 1) &&
            <span className='post__likeText'>{count} like </span>
                   }
                   {(count > 1) &&
            <span className='post__likeText'>{count} likes </span>
                   }
            {/**Username + Caption */}
           <div className='post__caption'> <p className='post__textP'><span className='post__textSpan'>{username}</span> {caption}</p></div>
            <div className='post__comments'>  
            { 
                comments.map(({id,comment}) =>(
                    <p className='post__textP' key={id}>
                        <span className='post__textSpan'> {comment.username}</span> {comment.text}</p> 
                ))
                } 
             </div>
             {/**if there is user then only code will be fire */}
            {user &&(<form className='post__commentBox'>
                
                <input
                className='post__commentInput'
                placeholder='Add a comment...'
                type='text'
                value={comment}
                onChange={(e)=>setComment(e.target.value)} 
                /> 
                <button 
                disabled={!comment}
                onClick={postComment} 
                className='post__commentButton'
                >
                 <strong>Post</strong>
                </button> 
            </form>
)}
        </div>
    )
}

export default Post
