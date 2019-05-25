using ApiAngular.Models;
using ApiAngular.Models.Articles;
using ApiAngular.Models.Authors;
using ApiAngular.Models.Comments;
using ApiAngular.Models.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ApiAngular.Controllers
{
    [Authorize(Policy = "moamma_spa")]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ArticlesController : Controller
    {
        /*___Properties___*/
        #region Properties
        private UserManager<Author> _userManager;
        private StorageContext _storageContext;
        private IArticleRep _articleRepository;
        private IHostingEnvironment _host;

        public ArticlesController(
        UserManager<Author> userMng,
            StorageContext strgContext,
            IArticleRep artRep,
            IHostingEnvironment hst)
        {
            _userManager = userMng;
            _storageContext = strgContext;
            _articleRepository = artRep;
            _host = hst;
        }

        #endregion
        /*---________---*/


        /*___Create Article___*/
        #region Create Article 
        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<string>> CreateArticle([FromBody]ArticleModel article)
        {
            Author author = await _userManager.GetUserAsync(HttpContext.User);
            Article createdArticle = new Article
            {
                Title = article.Title,
                Category = article.Category,
                Tag = article.Tag,
                Content = article.Content,
                Summary = article.Summary,
                Archive = article.Archive,
                CrtDate = DateTime.Now,
                AuthorId = author.Id,
                Likes = 0,
            };
            await _storageContext.Article.AddAsync(createdArticle);
            await _storageContext.SaveChangesAsync();
            return Json("ok");
        }
        #endregion

        /*___Edit Article___*/
        #region EditArticle
        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<string>> EditArticle([FromBody]Article article)
        {
            try
            {
                Article oldArticle = _storageContext.Article.FirstOrDefault(a => a.Id == article.Id);
                oldArticle.Category = article.Category;
                oldArticle.Tag = article.Tag;
                oldArticle.Summary = article.Summary;
                oldArticle.Content = article.Content;
                oldArticle.Title = article.Title;
                oldArticle.Archive = article.Archive;
                _storageContext.Article.Update(oldArticle);
                await _storageContext.SaveChangesAsync();
                return Json("ok");
            }
            catch (Exception e)
            {

                return Json(e.Message);
            }

        }
        #endregion

        /*___Fetch Articles___*/
        #region FetchArticles

        [HttpGet]
        [Route("[action]")]
        public async Task<List<Article>> FetchArticles()
        {
            try
            {
                Author author = await _userManager.GetUserAsync(HttpContext.User);
                List<Article> articles = _storageContext.Article
                    .Include(a => a.Comments).Where(a => a.AuthorId == author.Id)
                    .OrderByDescending(a => a.CrtDate).ToList();

                IQueryable<ReplyComment> replies = _storageContext.ReplyComment;
                foreach (Article a in articles)
                {
                    if (a.Comments.Count > 0)
                    {
                        foreach (Comment c in a.Comments)
                        {
                            if (replies.Where(r => r.CommentId == c.Id).Count() > 0)
                            {
                                c.ReplyComments = replies.Where(r => r.CommentId == c.Id).ToList();
                            }
                        }
                    }
                }
                return articles;

            }
            catch (Exception)
            {

                return null;
            }

        }

        #endregion

        /*___Fetch Trashes___*/
        #region FetchTrashes
        [HttpGet]
        [Route("[action]")]
        public IEnumerable<DeletedArticle> FetchTrashes()
        {
            return this._storageContext.DeletedArticle.OrderByDescending(a => a.CrtDate).ToList();
        }
        #endregion

        /*___Trash Article___*/
        #region TrashArticle

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<string>> TrashArticle([FromBody]Article art)
        {
            try
            {
                Author author = await _userManager.GetUserAsync(HttpContext.User);
                Article article = _storageContext.Article.FirstOrDefault(a => a.Id == Convert.ToInt64(art.Id));
                DeletedArticle deletedArticle = new DeletedArticle
                {
                    Title = article.Title,
                    Category = article.Title,
                    Tag = article.Tag,
                    AuthorId = author.Id,
                    CrtDate = article.CrtDate,
                    Summary = article.Summary,
                    Content = article.Content,
                };
                await _storageContext.DeletedArticle.AddAsync(deletedArticle);
                _storageContext.Article.Remove(article);
                await _storageContext.SaveChangesAsync();
                return Json("ok");
            }
            catch (Exception e)
            {

                return Json(e.Message);
            }

        }

        #endregion

        /*___Erase Article___*/
        #region EraseArticle

        [HttpPost]
        [Route("[action]")]
        public ActionResult<string> EraseArticle([FromBody]string id)
        {
            try
            {
                DeletedArticle dArticle = _storageContext.DeletedArticle.FirstOrDefault(a => a.Id == Convert.ToInt64(id));
                _storageContext.DeletedArticle
                    .Remove(dArticle);
                _storageContext.SaveChanges();
                return Json("ok");
            }
            catch (Exception e)
            {

                return Json(e.Message);
            }
        }

        #endregion

        /*___Return Article___*/
        #region RetArticle
        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<string>> RetArticle([FromBody]DeletedArticle article)
        {
            try
            {
                _storageContext.DeletedArticle.Remove(article);
                Author author = await _userManager.GetUserAsync(HttpContext.User);
                Article createdArticle = new Article
                {
                    Title = article.Title,
                    Category = article.Category,
                    Tag = article.Tag,
                    Content = article.Content,
                    Summary = article.Summary,
                    Archive = true,
                    CrtDate = DateTime.Now,
                    AuthorId = author.Id,
                    Likes = 0,
                };
                await _storageContext.Article.AddAsync(createdArticle);
                await _storageContext.SaveChangesAsync();
                return Json("ok");
            }
            catch (Exception e)
            {

                return Json(e.Message);
            }

        }

        #endregion

        /*___UnCheck Comment Manager___*/
        #region UnCheckCommentManager

        [HttpPost]
        [Route("[action]")]
        public ActionResult<string> UnCheckCommentManager([FromBody]CommentManager cmd)
        {
            try
            {
                if (cmd.CmdDeleted.Length > 0)
                {
                    for (int i = 0; i < cmd.CmdDeleted.Length; i++)
                    {
                        Comment c = _storageContext.Comment
                            .FirstOrDefault(ct => ct.Id == Convert.ToInt64(cmd.CmdDeleted[i]));
                        if (c != null)
                        {
                            _storageContext.Comment.Remove(c);
                        }
                    }
                }
                if (cmd.ReplyDeleted.Length > 0)
                {
                    for (int i = 0; i < cmd.ReplyDeleted.Length; i++)
                    {
                        ReplyComment r = _storageContext.ReplyComment.FirstOrDefault(rp =>
                                rp.Id == Convert.ToInt64(cmd.ReplyDeleted[i]));
                        if (r != null)
                        {
                            _storageContext.ReplyComment.Remove(r);
                        }
                    }
                }
                if (cmd.CmdChecked.Length > 0)
                {
                    for (int i = 0; i < cmd.CmdChecked.Length; i++)
                    {
                        Comment c = _storageContext.Comment.FirstOrDefault(cm =>
                                    cm.Id == Convert.ToInt64(cmd.CmdChecked[i]));
                        if (c != null)
                        {
                            c.Approved = true;
                            _storageContext.Comment.Update(c);
                        }
                    }
                }
                if (cmd.CmdUnChecked.Length > 0)
                {
                    for (int i = 0; i < cmd.CmdUnChecked.Length; i++)
                    {
                        Comment c = _storageContext.Comment.FirstOrDefault(cm =>
                                cm.Id == Convert.ToInt64(cmd.CmdUnChecked[i]));
                        if (c != null)
                        {
                            c.Approved = false;
                            _storageContext.Comment.Update(c);
                        }
                    }
                }
                _storageContext.SaveChanges();
                return Json("ok");
            }
            catch (Exception e)
            {

                return Json(e.Message);
            }

        }

        #endregion


        /*___Send Reply___*/
        #region SendReply
        [HttpPost]
        [Route("[action]")]
        public IActionResult SendReply([FromBody]SendReply rp)
        {
            try
            {
                ReplyComment reply = new ReplyComment
                {
                    CommentId = Convert.ToInt64(rp.Id),
                    Text = rp.Text,
                    Name = "",
                    Approved = true,
                    Email = "",
                    Vip = true
                };
                _storageContext.ReplyComment.Add(reply);
                _storageContext.SaveChanges();
                return Json("ok");
            }
            catch (Exception e)
            {

                return Json(e);
            }

        }
        #endregion


        /*___Upload Editor Images___*/
        #region EditorImage

        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public ActionResult<string> EditorImage()
        {
            try
            {

                var file = Request.Form.Files[0];
                string folderName = "editor-images";
                string webRootPath = _host.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                string imgAddress = "";
                if (!Directory.Exists(newPath)) { Directory.CreateDirectory(newPath); }
                if (file.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    imgAddress = $"{"/editor-images/"}{fileName}";
                }
                return Json(imgAddress);

            }
            catch (Exception e)
            {

                return e.Message;
            }
        }

        #endregion
    }

}
