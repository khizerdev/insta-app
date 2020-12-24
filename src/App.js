import './App.css';
import Post from './components/Post';
import React ,  {useState , useEffect} from 'react'
import {db , auth} from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload'

function getModalStyle() {
  const top = 50
  const left = 50

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
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  const [posts, setPosts] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [user, setUser] = useState(null)


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser)
        setUser(authUser)

        // if(authUser.displayName){
          //dont update username
        // } else {
        //   return authUser.updateProfile({
        //     displayName: username,
        //   })
        // }

      } else {
        setUser(null)
      }
    })

    return () => {
      unsubscribe();
    }

  } , [user , username])

  useEffect(() => {
   
    db.collection('posts').orderBy('timestamp' , 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post:doc.data()
      })))
    })

  }, [posts])

  const signUp = (event) => {
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email , password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
  }


  const signIn = (event) => {
    event.preventDefault()
    auth
      .signInWithEmailAndPassword(email,password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false)

  }

  return (
    <div className="app">


    { user?.displayName ? (
      <ImageUpload username={user.displayName}/> ) : ( <h3>Login to Create a Post</h3>)
    }
    

    {/* signUpModal */}
    <Modal open={open} onClose={() => setOpen(false )}>
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
        <center>

          <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram"/>

          <div>
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} />
          </div>
          
            <div>
            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
            </div>

            <Button style={{marginTop: '10px'}} type="submit" onClick={signUp}>Sign Up</Button>

        </center>
      </form>
      </div>
    </Modal>

    {/* signInModal */}
    <Modal open={openSignIn} onClose={() => setOpenSignIn(false )}>
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
        <center>

          <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram"/>

          <div>
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          </div>

            <div>
            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
            </div>

            <Button style={{marginTop: '10px'}} type="submit" onClick={signIn}>Sign In</Button>

        </center>
      </form>
      </div>
    </Modal>

      <div className="app__header">

      <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram"/>

      {/* if user is logged in show logout button otherwise show signIn and signUp */}
      { user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button> 
        ) : 
        <div className="app__loginContainer">
        <Button onClick={() => setOpenSignIn(true)}>SignIn</Button>
        <Button onClick={() => setOpen(true)}>Signup</Button>
        </div>
      }

      </div>
      
      <div className="app__posts">
      {  
        posts.map(({post,id}) => (
        <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imgUrl={post.imgUrl}  />
        )) 
      }
      </div>


    </div>

  );
}

export default App;
