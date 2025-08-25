import { useState, useEffect} from "react";
import { Send, Link } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import './SendMsg.css';
import { baseApi } from "../utils/baseApi";


export const SendMessage = () => {

  const navigate = useNavigate();
  const [reciver, setReciver] = useState({ name: null, validTill: null, error: null });
  const [message, setMessage] = useState('');
  const[whisper,setWhisper] = useState(false);



  const getId = ()=>{
          const url = new URL(window.location.href);
        const pathname = url.pathname;
        const id = pathname.split("/").pop();
        return id
  }

  useEffect(() => {


    const validate_link = async () => {
      try {
        const res = await fetch(`${baseApi}/msg/validate_unique_link/${getId()}`);
        const data = await res.json();

        if (res.ok) {
          const { name, validTill } = data;
          setReciver((prev) => ({ ...prev, name, validTill }));
        } else {
          setReciver((prev) => ({ ...prev, error: data.message }));
        }
      } catch (err) {
        setReciver((prev) => ({ ...prev, error: err.message }));
      }
    };

    validate_link();
  }, []);


const sendMsg = async () => {
  try {
    if(!message || !message.trim()) return
    const res = await fetch(`${baseApi}/msg/send_message/${getId()}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ message }), // make sure "message" exists
    });
    const dataa = await res.json()
    if (res.ok) {
      setMessage('')
      setWhisper(true);
      setTimeout(() => setWhisper(false), 2000); 
    }
    else{
          setReciver(prev => ({ ...prev, error: dataa.message }));

    }
  } catch (err) {
    setReciver(prev => ({ ...prev, error: err.message }));
  }
};




  return (
    <main className="sendmsg-container">
      <div className="sendmsg-content">
        <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', marginRight: '10px' }}>💌</span>
            <h1 style={{ display: 'inline' }}>Whisper a Secret Message!</h1>
        </div>


        {reciver.name && (
          <div className="message-container">
            <h2>Send a mysterious message to <span style={{ color: '#ff3f4fff', fontSize:'2rem'}}>{reciver.name}</span> 🕵️‍♂️</h2>
            <p>Shh… they'll never know it's you! 🤫</p>
            {reciver.validTill && <p style={{color:'#002d30ff'}}>This link is valid until : <b style={{color:'red'}}>{reciver.validTill}</b></p>}
            {!whisper && <textarea
              className="sendmsg-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your secret magic here... ✨"
            />}

            <div className="sendmsg-actions">
              <button onClick={()=>{sendMsg()}} style={{background:'#FF9F00'}}>
                {whisper==false? <Send />: ''}
                {whisper== false? 'Whisper it !' : 'whispered'}
                </button>
              <button type="button" onClick={() => navigate('/')} style={{background:'#309898'}}><Link /> Create my link</button>
            </div>
          </div>
        )}

        {reciver.error && (
          <div className="sendmsg-error">
            <h2>Oops! {reciver.error}</h2>
            <p>Either the secret link has vanished…</p>
            <p>…or something's wrong with this URL. 😶‍🌫️</p>
          </div>
        )}

          <ul className="sendmsg-ul">
            <li>Your identity stays hidden — forever anonymous! 🤐</li>
            <li>Messages self-destruct 24 hours after the link creation ⏳</li>
            <li>You can only whisper secrets while the magic link is alive 🪄⏰</li>
            <li>Hit <b>Create my link</b> to unlock your secret portal 🔗</li>
            <li>Each friend gets a unique link for ultimate secrecy 🎯</li>
        </ul>

      </div>
    </main>
       
  
   
  );
};
