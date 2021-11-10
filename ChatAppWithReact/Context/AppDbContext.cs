using Microsoft.EntityFrameworkCore;
using ChatAppWithReact.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAppWithReact.Context
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options){  }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<JoinedRoom> RoomJoined { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
          
        }
    }
}
