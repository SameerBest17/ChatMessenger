import React,{ useState } from 'react'
import { connectAdvanced } from 'react-redux';
import { isConditionalExpression } from 'typescript';
import './RoomsPopup.scss';
export default function RoomsPopup(props) {
  var modal = document.getElementById("myModal");
    return (
        <div id="myModal" className="modal">
        <div className="rooms-container">
        <span onClick={()=> modal.style.display = "none"} className="close">&times;</span>
          {props.rooms?<ul>
            {props.rooms.map((room,i) => (
              <li key={i} className="room">
                <picture className="room-picture">
                  <img src='//ssl.gstatic.com/accounts/ui/avatar_2x.png' alt={`${room.name}`} />
                </picture>
                <div className="room-info-container">
                  <div className="room-info">
                    <h4>{room.name}</h4>
                    <p>Admin:{room.admin}</p>
                  </div>
                  <div className="room-action">
                    <button onClick={()=>{props.join(room.name)
                    }}>Join</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>:<h4>No Room Joined</h4>}
      
        </div>
        </div>
    )
}
