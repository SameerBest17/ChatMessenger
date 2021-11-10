import React from 'react'
import 'font-awesome/css/font-awesome.min.css';

export default function ChatHistory(props) {
  console.log(props.messages)
    return (
      <div className="chat-history">
      <ul>
        {props.messages.map((msg,i)=>( <li key={i} className="clearfix">
          <div className= {msg.author===props.currentUser ? "message-data align-left":"message-data align-right"  } >
            <span className="message-data-time" >{msg.time}, {msg.date}</span> &nbsp; &nbsp;
            <span className="message-data-name" >{msg.author}</span> <i className="fa fa-circle me"></i>
          </div>
          <div className= {msg.author===props.currentUser ? "message my-message":"message other-message float-right"}>
           {msg.text}
          </div>
        </li>))}
      </ul>
      </div>
    )
}
