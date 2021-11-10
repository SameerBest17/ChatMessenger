
import React, { useState } from 'react';

export default function ChatMessage(props) {
    const [Message, setMessage] = useState('');
     
    return (
        <div className="chat-message clearfix">
            <textarea value={Message} onChange={e=>setMessage(e.target.value)} name="message-to-send" id="message-to-send" placeholder="Type your message" rows="2"></textarea>

            {/* <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
            <i className="fa fa-file-image-o"></i> */}

            <button  type="submit" onClick={(e)=> {props.send(e,Message) 
            setMessage('')}}>Send</button>

        </div>
    )
}
