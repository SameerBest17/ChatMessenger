import React, { Component } from 'react'
import './ChatMessenger.scss'
import axios from "axios";
import { connect } from 'react-redux'
import * as signalR from '@aspnet/signalr'
import { Redirect } from "react-router";
import PropleList from './PropleList'
import RoomsList from './RoomsList'
import ChatHeader from './ChatHeader'
import ChatMessage from './ChatMessage'
import ChatHistory from './ChatHistory'
import RoomsPopup from './RoomsPopup'
import { HubConnection } from '../../Store/Actions/HubConnection'


class ChatMessenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      selected: null,
      Displaymessage: "No Message Is Selected",
      messages: [],
      msgs: [],
      rooms: [],
      Rooms: [],
      roomsNotJoined: [],
      conversations: {},
      hubConnection: null,
      users: {},
      connectionId: '',
      SendToRoom: false
    }

  }

  GetDateAndTime = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return { date, time };
  }


  onSelect = (user) => {
    this.setState({ selectedItem: user })
    this.setState({ SendToRoom: false })
    this.setState({ selected: user.username })
    let msgCov = this.state.msgs.filter((msg, i) => {
      if ((msg.author === this.props.currentUser.username && msg.To === user.username) || (msg.author === user.username && msg.To === this.props.currentUser.username))
        return msg;
    }
    )
    this.setState({ messages: msgCov });
  }


  onSelectRoom = (room) => {
    const selRoom = this.state.Rooms.find(Room => Room.name === room)
    this.setState({ selectedItem: selRoom });
    this.setState({ SendToRoom: true })
    this.setState({ selected: room })
    let msgCov = this.state.msgs.filter((msg, i) => {
      if (msg.To === room) return msg;
    }
    )
    this.setState({ messages: msgCov });
  }


  sendMessage = (e, msg) => {
    e.preventDefault();

    const { date, time } = this.GetDateAndTime();
    console.log(this.state.SendToRoom);
    if (this.state.SendToRoom) {
      this.state.hubConnection
        .invoke("SendMessageToGroup", this.state.selected, this.state.nick, msg, time, date)
        .catch(err => console.log(err));
    } else {
      const Users = this.state.users;
      const connectionId = Users[this.state.selected]
      this.state.hubConnection
        .invoke("SendMessageToUser", connectionId, this.state.nick, msg, time, date, this.state.selected)
        .catch(err => console.log(err));
    }

  }

  createRoom = () => {
    const roomName = prompt("Room Name", "Public");
    this.state.hubConnection
      .invoke("CreateRoom", roomName, this.props.currentUser.username)
      .catch(err => console.log(err));
  }



  showRooms = () => {
    const roomsNotJoined = this.state.Rooms.filter(room => {
      if (!this.state.rooms.includes(room.name))
        return room;
    })

    this.setState({ roomsNotJoined })
    console.log(this.state.roomsNotJoined)
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  }

  JoinGroup = async (roomvalue = '', NewRoom = true) => {

    const user = this.props.currentUser.username;
    if (NewRoom) {
      const formData = new FormData();
      formData.append('username', user);
      formData.append('name', roomvalue);
      const url = "http://localhost:6081/api/Application/JoinRoom";
      try {
        const res = await axios.post(url, formData)
        if (res) console.log(res.data);
        var rooms = this.state.rooms.concat([roomvalue]);
        this.setState({ rooms })

        const roomsNotJoined = this.state.roomsNotJoined.filter(r => r.name !== roomvalue)
        this.setState({ roomsNotJoined })
        console.log(this.state.roomsNotJoined);
      } catch (error) {
        console.error("ERROR!", error)
      }
    }

    this.state.hubConnection
      .invoke("JoinGroup", roomvalue)
      .catch(err => console.log(err));

  }
  
  deleteroom = (room) => {
    this.state.hubConnection
      .invoke("DeleteGroup", room)
      .catch(err => console.log(err));
  }

  componentDidMount = () => {
    
    const rooms = this.props.Rooms;
    this.setState({ rooms });
    
    let nick = this.props.currentUser.username;
    
    const hubConnection = new signalR.HubConnectionBuilder().withUrl('/chatHub').build();
    hubConnection.start().then(() => {
      this.props.hubcon(hubConnection);
      console.log("Connection Started......")
      if (this.state.rooms) { this.state.rooms.forEach(room => this.JoinGroup(room, false)) }
    })
      .catch((err) => console.log("Connect Failed Error While establishing Connection :( ", err));

    this.setState({ hubConnection, nick }, () => {

      this.state.hubConnection.on("ReceiveMessage", msg => {
        const newMsg = { text: msg.content, time: msg.time, date: msg.date, author: msg.author, To: msg.to }
        const msgs = this.state.msgs.concat(newMsg)
        this.setState({ msgs: msgs });
        const messages = this.state.messages.concat(newMsg)
        this.setState({ messages })
        console.log(this.state.messages)

      });

      this.state.hubConnection.on("NewRoom", room => {
        console.log("NEW ROOM", room);
        var Rooms = this.state.Rooms.concat([room])
        this.setState({ Rooms })
        if (room.admin === this.props.currentUser.username) {
          this.JoinGroup(room.name);
        }
      })

      this.state.hubConnection.on("onRoomDeleted", (room) => {

        const Rooms = this.state.Rooms.filter(r => r.name !== room)
        this.setState({ Rooms })

      })

      this.state.hubConnection.on("removeRoom", (room) => {

        var ind = this.state.rooms.indexOf(room)
        this.state.rooms.splice(ind, 1);

        this.setState({ selected: null, Displaymessage: `Room ${room} has been deleted.\nYou are now moved to the Lobby!` })

      })

      this.state.hubConnection.on("onError", (msg) => {
        console.log(msg);
      })

      this.state.hubConnection.on("UserConnected", (connectionId, users, rooms, message) => {

        if (!this.state.connectionId) {
          message.forEach(msg => {
            const msgs = this.state.msgs.concat({ text: msg.content, time: msg.time, date: msg.date, author: msg.author, To: msg.to })
            this.setState({ msgs: msgs });
            this.setState({ Rooms: [...rooms] })
            this.setState({ connectionId })
          })
        }
        console.log("Connected",users)
        this.setState({ users: users });


      });

      this.state.hubConnection.on("UserDisconnected", (connectionId, users) => {
        console.log("Disconnect",connectionId);
        this.setState({ users: users });


      });

    });

  }

  render() {
    if (!this.props.isLogin) return <Redirect to='/' />
    const AllUsers = this.props.allUsers.filter(user => user.username != this.props.currentUser.username)
    const rooms = ['New', 'Fun', 'Private']
    return (
      <div className="container clearfix">
        <RoomsPopup join={this.JoinGroup} rooms={this.state.roomsNotJoined} />
        <PropleList users={AllUsers} active={this.state.users} create={this.createRoom} onSelect={this.onSelect} />
        {this.state.selected ? <div className="chat">
          <ChatHeader currentUser={this.props.currentUser.username} user={this.state.selectedItem} delete={this.deleteroom} count={this.state.messages.length} />
          <ChatHistory messages={this.state.messages} currentUser={this.props.currentUser.username} />
          <ChatMessage send={this.sendMessage} />
        </div> : <div className='no-chat'><p>{this.state.Displaymessage}</p></div>}
        <RoomsList rooms={this.state.rooms} Rooms={this.state.Rooms} RoomsList={this.showRooms} joinRooms={this.JoinGroup} onSelect={this.onSelectRoom} />

      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.authUser,
    isLogin: state.auth.authLogin,
    allUsers: state.auth.allUsers,
    Rooms: state.auth.Rooms,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    hubcon: (connection) => dispatch(HubConnection(connection)),
  }
}




export default connect(mapStateToProps, mapDispatchToProps)(ChatMessenger)
