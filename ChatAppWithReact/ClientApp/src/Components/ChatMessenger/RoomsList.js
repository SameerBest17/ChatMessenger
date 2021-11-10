import React from 'react'

export default function PropleList(props) {
    return (
        <div className="people-list" id="people-list">
            
            <div className="room-action-Button">
                <button onClick={props.RoomsList} >Join Room</button>
            </div>
            <div className="Text-Lable">
            <label style={{textAlign:'center'}}> Rooms List </label>
            </div>
          
            <ul className="list">
                {
                    props.rooms.map((room, i) => (
                        <li key={i} onClick={() => props.onSelect(room)} className="user clearfix">
                            <img className="profile-image" src='//ssl.gstatic.com/accounts/ui/avatar_2x.png' alt="avatar" />
                            <div className="about">
                                <div className="name">{room}</div>
                            </div>
                        </li>
                    ))

                }

            </ul>
        </div>

    )
}


