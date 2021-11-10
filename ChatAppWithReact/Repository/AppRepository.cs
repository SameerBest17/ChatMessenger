using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatAppWithReact.Context;
using ChatAppWithReact.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace ChatAppWithReact.Repository
{
    public class AppRepository : IAppRepository
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;
        public AppRepository(AppDbContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            this._hostEnvironment = hostEnvironment;
        }
        public async Task<ApplicationUser> Create([FromForm] ApplicationUser user)
        { 
            try
            {
                user.ImageName = await SaveImage(user.ImageFile);
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return user;
            } catch {
                throw new Exception("User Already there with this Username or Email ID ");
            }
           
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }
            return imageName;
        }

        public async Task<Room> Create(Room room)
        {

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();
            return room;
        }

        public async Task Delete(int id)
        {
          var user = await _context.Users.FindAsync(id);
            if (user != null) {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            } 
        }

        public async Task<IEnumerable<ApplicationUser>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }
        public async Task<IEnumerable<Room>> GetRooms()
        {
            return await _context.Rooms.ToListAsync();
        }

        public ApplicationUser GetUser(string username)
        {
          var user = _context.Users.FirstOrDefault(u =>  u.Username == username );
            return user;        
             /*await _context.Users.FindAsync(user.UserId);*/
        }

        public ApplicationUser VerifyUser(string username, string password)
        {   
            var User = GetUser(username);
            if(User == null) {  throw new Exception("No User Found"); }
            if (User.Password == password)
            { 
                return User;
            }
            else
            {
                return  null;
            }
                }

        public async Task<string>JoinGroup([FromForm] JoinedRoom room)
        {
            try {
                _context.RoomJoined.Add(room);
                await _context.SaveChangesAsync();
                return "OK";
            } catch (Exception) {
                return "Not ADDED TO DATABASE"; };
            
        }

        public List<string> JoinedRooms(string username)
        {
            var joinrooms = _context.RoomJoined.Where(j => j.Username == username).Select(j => j.Name).ToList();
            return joinrooms;
        }


    }
}
