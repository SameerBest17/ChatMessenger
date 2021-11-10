using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ChatAppWithReact.Models;
using ChatAppWithReact.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using ChatAppWithReact.Context;
using Microsoft.EntityFrameworkCore;

namespace ChatAppWithReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationController : ControllerBase

    {
        private readonly AppDbContext _context;
        public static string User { get; set; } 
        private readonly IAppRepository _appRepository;
 


        private readonly ILogger<ApplicationController> _logger;

        // The Web API will only accept tokens 1) for users, and 2) having the "access_as_user" scope for this API
        static readonly string[] scopeRequiredByApi = new string[] { "access_as_user" };

        public ApplicationController(ILogger<ApplicationController> logger,IAppRepository appRepository, AppDbContext context)
        {
            _context = context;
            _appRepository = appRepository;
            _logger = logger;
        }

        [HttpGet("Users")]
        public async Task<IEnumerable<ApplicationUser>> Get()
        {
            return await _context.Users.Select(user => new ApplicationUser()
            {
                Username = user.Username,
                Fullname = user.Fullname,
                Email = user.Email,
                ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, user.ImageName)
            }).ToListAsync();
         
        }

        [HttpGet("{username}")]
        public  ApplicationUser GetUser(string username)
        { 
            return  _appRepository.GetUser(username);
        }
        [HttpGet("Rooms")]
        public async Task<IEnumerable<Room>> GetRooms()
        {
            return  await _appRepository.GetRooms();
        }
        [HttpGet("{username}/{password}")]
        public object VirifyUser(string username,string password)
        {   ApplicationUser user = _appRepository.VerifyUser(username, password);
            if (user!=null ) { User = user.Username;
                user.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, user.ImageName);
                return user;
            }
            return null;
           
        }

        [HttpGet("rooms/{username}")]
        public object JoinedRooms(string username)
        {   
            return _appRepository.JoinedRooms(username);
        }

        [HttpPost("User")]
        public async Task<ApplicationUser> Create([FromForm] ApplicationUser user)
        {
      
           var newuser= await _appRepository.Create(user);
            newuser.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, newuser.ImageName);
            return newuser;
        }
        [HttpPost("Room")]
        public async Task<Room> Create_Room(Room room)
        {
          return await _appRepository.Create(room);
        }
        [HttpPost("JoinRoom")]
        public async Task<string> JoinRoom([FromForm] JoinedRoom room)
        {
          return  await _appRepository.JoinGroup(room);
            
        }

    }
}
