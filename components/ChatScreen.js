import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useState,useRef } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth, db } from '../firebase';
import AttachFileIcon from "@material-ui/icons/AttachFile"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import { useCollection } from 'react-firebase-hooks/firestore';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic'
import Message from './Message';
import firebase from "firebase"
import getRecipientEmail from '../utils/getRecipientEmail';
import Timeago from "timeago-react"

function ChatScreen({chat,messages}) {
    const [user]=useAuthState(auth);

    const [input,setInput]=useState("");
    const router=useRouter();
    const [messagesSnapshot]=useCollection(db.collection("chats")?.doc(router.query.id).collection("messages").orderBy("timestamp","asc"));
    const showMessages=()=>{
        if(messagesSnapshot){
            return messagesSnapshot.docs.map((message)=>(
                
                <Message key={message.id} user={message.data().user} message={{...message.data(),timestamp:message.data().timestamp?.toDate().getTime()}}/>
            ))
        }else{
            return JSON.parse(messages).map(message=>(
                <Message key={message.id} user={message.user} message={message}/>
            ));
        }
    }

   const endofMessageRef = useRef(null);

    const [recipientSnapshot]=useCollection(
        db.collection("users")
        .where("email","==",getRecipientEmail(chat.users,user))
    )
    const scrollToBottom=()=>{
        endofMessageRef.current.scrollIntoView({behavior:"smooth",block:"start"});
    };
    const sendMessage=(e)=>{
        e.preventDefault();

        //update last seen
        db.collection("users").doc(user.uid).set({
            lastSeen:firebase.firestore.FieldValue.serverTimestamp(),
        },{merge:true});

        db.collection('chats').doc(router.query.id).collection('messages').add({

            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            messages:input,
            user:user.email,
            photoURL:user.photoURL,
        })

        setInput("");
        scrollToBottom();

    }

   
    const recipient =recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail=getRecipientEmail(chat.users,user)
    return (
        <Container>
            <Header>
                {recipient?(<Avatar src={recipient?.photoURL}/>):(<Avatar>{recipientEmail[0]}</Avatar>)}
                
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot?(<p>Last Active:{''}{recipient?.lastSeen?.toDate()?(<Timeago datetime={recipient?.lastSeen?.toDate()}/>):"Unavailable"}</p>):(<p>Loading Last active...</p>)}
        
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndofMessage ref={endofMessageRef}/>
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon/>
                <Input value={input} onChange={(e)=>setInput(e.target.value)} />
               
                <button hidden disabled={!input} type="submit" onClick={sendMessage}> Send MESSAGE</button>
                <MicIcon/>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;
const InputContainer=styled.form`
    display:flex;
    align-items:center;
    padding:10px;
    position:sticky;
    bottom:0;
    background-color:white;
    z-index:100;
    `;

const Container=styled.div``;
const Input=styled.input`
    flex:1;
    outline:none;
    border:none;
    border-radius:10px;
    padding:20px;
    background-color:whitesmoke;
    margin-left:15px;
    margin-right:15px;

`;

const Header=styled.div`
    position:sticky;
    background-color:white;
    z-index:100;
    top:0;
    display:flex;
    padding:11px;
    height:80px;
    align-items:center;
    border-bottom:1px solid whitesmoke;
`;

const HeaderInformation=styled.div`
    margin-left:15px;
    flex:1;
    >h3{
        margin-bottom:0px;
    }
    >p{
        font-size:14px;
        color:gray;
    }

`;

const HeaderIcons=styled.div``;

const EndofMessage=styled.div`
margin-bottom:50px;
`;

const MessageContainer=styled.div`
    padding:30px;
    background-color: #e5ded8;
    min-height:90vh;
`;


