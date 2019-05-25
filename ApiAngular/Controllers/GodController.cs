using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using ApiAngular.Models.Authors;
using ApiAngular.Models;
using ApiAngular.Models.Repository;

namespace ApiAngular.Controllers
{
    [Authorize(Policy = "God")]
    [Route("api/[controller]")]
    public class GodController : Controller
    {
        /* Conxtructor and Private property */
        #region ConstructorAndProperties

        private UserManager<Author> _userManager;
        private SignInManager<Author> _signInManager;
        private RoleManager<IdentityRole> _roleManager;
        private StorageContext _storageContext;
        private IArticleRep _articleRepository;
        private IHostingEnvironment _host;
        private IPasswordValidator<Author> _passwordValidator;
        private IPasswordHasher<Author> _passwordHasher;
        private readonly string[] ACCEPTED_FILE_TYPES = new[] { ".jpg", ".jpeg", ".png" };

        public GodController(
            UserManager<Author> userMng,
            SignInManager<Author> signInMng,
            StorageContext strgContext,
            IArticleRep artRep,
            IHostingEnvironment hst,
            IPasswordValidator<Author> pswVld,
            IPasswordHasher<Author> pswHs,
            RoleManager<IdentityRole> rolemng
            )
        {
            _userManager = userMng;
            _signInManager = signInMng;
            _storageContext = strgContext;
            _articleRepository = artRep;
            _host = hst;
            _roleManager = rolemng;
            this._passwordValidator = pswVld;
            this._passwordHasher = pswHs;

        }
        #endregion

        #region Create
        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<string>> Create([FromBody]AuthorModel author)
        {
            if (ModelState.IsValid)
            {
                Author user = new Author
                {
                    UserName = author.UserName,
                    Email = author.Email,
                    Category = author.Category,
                    NameInPersian = author.NameInPersian
                };
                IdentityResult result = await _userManager.CreateAsync(user, author.Password);
                if (result.Succeeded)
                {
                    FrontAuthor interfaceAuthor = new FrontAuthor
                    {
                        Id = user.Id,
                        Name = author.NameInPersian,
                        UserName = user.UserName,
                        Category = author.Category,
                        ImgAddress = ""
                    };
                    this._storageContext.Author.Add(interfaceAuthor);
                    await this._storageContext.SaveChangesAsync();
                    await _signInManager.SignOutAsync();
                    return Json("ok");
                }
                else
                {
                    foreach (IdentityError error in result.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                }
            }
            return Json("Error");
        }

        #endregion

        #region Change-Password
        [HttpPost("[action]")]
        public async Task<ActionResult> ChangePassword([FromBody]ChangePasswordG password)
        {
            Author author = await _userManager.FindByIdAsync(password.Id);
            if (User.IsInRole("god"))
            {

            }
            IdentityResult validPass = null;
            if (!string.IsNullOrEmpty(password.Password))
            {
                validPass = await _passwordValidator.ValidateAsync(_userManager, author, password.Password);
                if (validPass.Succeeded)
                {
                    author.PasswordHash = _passwordHasher.HashPassword(author, password.Password);
                }
                else
                {
                    return Json(validPass.Errors);

                }
            }
            if (password.Password != string.Empty && validPass.Succeeded)
            {
                IdentityResult result = await _userManager.UpdateAsync(author);
                if (result.Succeeded)
                {
                    await _signInManager.SignOutAsync();
                    return Json("ok");
                }
                else
                {
                    return Json(result.Errors);
                }
            }
            return Json("ERROR");
        }
        #endregion

        #region Change-Profile
        [HttpPost("[action]")]
        public async Task<ActionResult> ChangeProfile([FromBody]ChangeProfG profile)
        {
            Author author = await _userManager.FindByIdAsync(profile.Id);
            FrontAuthor frontAuthor = _storageContext.Author.FirstOrDefault(u => u.Id == author.Id);

            if (!string.IsNullOrWhiteSpace(profile.Usr) && !string.IsNullOrEmpty(profile.Usr))
            {
                author.UserName = profile.Usr;
                frontAuthor.UserName = profile.Usr;
            }

            IdentityResult result = await _userManager.UpdateAsync(author);
            if (result.Succeeded)
            {
                _storageContext.Author.Update(frontAuthor);
                await _storageContext.SaveChangesAsync();
                return Json("ok");
            }
            else
            {
                return Json(result.Errors);
            }
        }
        #endregion

        #region FetchAuthor
        [HttpGet]
        [Route("[action]")]
        [Authorize(Policy = "God")]

        public List<FrontAuthor> FetchAuthor()
        {
            List<FrontAuthor> fAuthor = _storageContext
                .Author.Where(a => a.UserName != "Fox__").ToList();
            return fAuthor;
        }
        #endregion

        #region RemoveAuthor
        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<string>> RemoveAuthor([FromBody]RemoveAuthor id)
        {
            try
            {
                Author author = await _userManager.FindByIdAsync(id.Id);
                if (author != null)
                {
                    FrontAuthor fAuthor = _storageContext.Author.FirstOrDefault(a => a.Id == id.Id);
                    await _userManager.DeleteAsync(author);
                    _storageContext.Author.Remove(fAuthor);
                    _storageContext.Article.RemoveRange(
                        _storageContext.Article.Where(a => a.AuthorId == id.Id).ToList());
                    _storageContext.SaveChanges();
                    return Json("ok");
                }
                else
                {
                    return "not found";
                }

            }
            catch (Exception e)
            {

                return e.Message;
            }

        }
        #endregion
    }
    
}
