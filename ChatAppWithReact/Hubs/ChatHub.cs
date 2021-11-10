using ChatAppWithReact.Context;
using ChatAppWithReact.Controllers;
using ChatAppWithReact.Models;
using ChatAppWithReact.Repository;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ChatAppWithReact.Hubs
{
    public class ChatHub:Hub
    {
        /*  ApplicationController _appController;
          AppDbContext _context;*/
        private readonly AppDbContext _context;
        private readonly static Dictionary<string, string> _Rooms = new Dictionary<string, string>();
        private readonly static Dictionary<string, string> _Connections = new Dictionary<string, string>();

        public ChatHub(AppDbContext context)
        {
            _context = context;
       
        }
/*        public async Task AddMessagesToDB(string message,string Author,string To,string date,string time)
        {
            try
            {
                if (!string.IsNullOrEmpty(message.Trim()))
                {
                    // Create and save message in database
                    var msg = new Message()
                    {
                        Content = Regex.Replace(message, @"(?i)<(?!img|a|/a|/img).*?>", string.Empty),
                        Author = Author,
                        To = To,
                        Date =date,
                        Time=time
                    };
                    _context.Messages.Add(msg);
                    _context.SaveChanges();
                }
            }
            catch (Exception) {
                await Clients.Caller.SendAsync("onError", "Message not send! Message should be 1-500 characters.");
            }
        }*/
        public async Task SendToAll(string user,string message,string to)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message,to);
        }

        public async Task SendMessageToCaller(string user, string message,string to)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", user,message,to);
        }

        public async Task SendMessageToUser(string connectionId,string name, string message, string time, string date, string to)
        {

            try
            {
                if (!string.IsNullOrEmpty(message.Trim()))
                {
                    // Create and save message in database
                    var msg = new Message()
                    {
                        Content = Regex.Replace(message, @"(?i)<(?!img|a|/a|/img).*?>", string.Empty),
                        Author = name,
                        To = to,
                        Date = date,
                        Time = time
                    };
                    _context.Messages.Add(msg);
                    _context.SaveChanges();

                    if (!String.IsNullOrEmpty(connectionId))
                    {
                        await Clients.Client(connectionId).SendAsync("ReceiveMessage", msg);
                    }
        
                   
                    await Clients.Caller.SendAsync("ReceiveMessage", msg);

                }

            }
            catch (Exception ex)
            {   
                await Clients.Caller.SendAsync("onError",ex);
            }

          
             
        }
        public async Task CreateRoom(string roomName,string admin)
        {
            try
            {

                // Accept: Letters, numbers and one space between words.
                Match match = Regex.Match(roomName, @"^\w+( \w+)*$");
                if (!match.Success)
                {
                    await Clients.Caller.SendAsync("onError", "Invalid room name!\nRoom name must contain only letters and numbers.");
                }
                else if (roomName.Length < 5 || roomName.Length > 100)
                {
                    await Clients.Caller.SendAsync("onError", "Room name must be between 5-100 characters!");
                }
                else if (_context.Rooms.Any(r => r.Name == roomName))
                {
                    await Clients.Caller.SendAsync("onError", "Another chat room with this name exists");
                }
                else
                {
                    // Create and save chat room in database
                    var room = new Room()
                    {
                        Name = roomName,
                        Admin = admin
                    };
                    _context.Rooms.Add(room);
                    _context.SaveChanges();
                    await Clients.All.SendAsync("NewRoom",room);
                }
               
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("onError", "Couldn't create chat room: " + ex.Message);
            }
        }
        public Task JoinGroup(string group)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, group);
        }


        public async Task DeleteGroup(string group)
        {
            var room = _context.Rooms.Where(r => r.Name == group).FirstOrDefault();
            _context.Rooms.Remove(room);
            _context.SaveChanges();

            _context.Messages.Where(m => m.To == group)
              .ToList().ForEach(m => _context.Messages.Remove(m));
            _context.SaveChanges();

            _context.RoomJoined.Where(r => r.Name == group)
               .ToList().ForEach(r => _context.RoomJoined.Remove(r));
            _context.SaveChanges();

            await Clients.Group(group).SendAsync("onRoomDeleted", group);

            // Tell all users to update their room list
            await Clients.All.SendAsync("removeRoom",group);

        }
       

        public async Task SendMessageToGroup(string group,string name, string message, string time,string date)
        {
            try
            {
                if (!string.IsNullOrEmpty(message.Trim()))
                {
                    // Create and save message in database
                    var msg = new Message()
                    {
                        Content = Regex.Replace(message, @"(?i)<(?!img|a|/a|/img).*?>", string.Empty),
                        Author = name,
                        To = group,
                        Date = date,
                        Time = time
                    };
                    _context.Messages.Add(msg);
                    _context.SaveChanges();
                    await Clients.Group(group).SendAsync("ReceiveMessage", msg);
                }
               
            }
            catch (Exception)
            {
               await Clients.Caller.SendAsync("onError", "Message not send! Message should be 1-500 characters.");
            }
          
        }

        public override async Task OnConnectedAsync()
        {
            var username = ApplicationController.User;
            if (_Connections.ContainsKey(username)) {
                _Connections.Remove(username);
            }
            _Connections.Add(username, Context.ConnectionId);
            var Room =await _context.Rooms.ToListAsync();
            var messages = await _context.Messages.ToListAsync();
           
            await Clients.All.SendAsync("UserConnected", Context.ConnectionId,_Connections,Room,messages);
            await base.OnConnectedAsync();
        }


        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var key = _Connections.FirstOrDefault(u => u.Value == Context.ConnectionId).Key;
            _Connections.Remove(key);

            await Clients.All.SendAsync("UserDisconnected", Context.ConnectionId,_Connections);
            await base.OnDisconnectedAsync(ex);
        }
    }
}
