using Microsoft.AspNetCore.Mvc;
using ChatAppWithReact.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAppWithReact.Repository
{
   public interface IAppRepository
    {
        Task<IEnumerable<ApplicationUser>> GetUsers();
        Task<IEnumerable<Room>> GetRooms();
        ApplicationUser GetUser(string username);
        Task<ApplicationUser> Create([FromForm] ApplicationUser user);
        Task<Room> Create(Room room);
        Task<string> JoinGroup([FromForm] JoinedRoom room);
        List<string> JoinedRooms(string username);
        ApplicationUser VerifyUser(string username,string password);

     
        Task Delete(int id);
        
    }
}
