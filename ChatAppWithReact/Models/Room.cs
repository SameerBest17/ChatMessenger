using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAppWithReact.Models
{
    public class Room
    {   [Key]
        public string Name { get; set; }
        public string Admin { get; set; }

     


    }
}
