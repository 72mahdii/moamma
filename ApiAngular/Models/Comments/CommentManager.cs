using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiAngular.Models.Comments
{
    public class CommentManager
    {
        public string[] CmdChecked { get; set; }
        public string[] CmdUnChecked { get; set; }
        public string[] CmdDeleted { get; set; }
        public string[] ReplyDeleted { get; set; }
    }
}
