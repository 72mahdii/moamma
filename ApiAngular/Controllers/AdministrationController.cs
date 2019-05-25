using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ApiAngular.Models;
using ApiAngular.Models.Authors;
using ApiAngular.Models.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ApiAngular.Controllers
{
    [Authorize(Policy = "moamma_spa")]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class AdministrationController : Controller
    {

        /* Conxtructor and Private property */
        #region ConstructorAndProperties

        private UserManager<Author> _userManager;
        private SignInManager<Author> _signInManager;
        private StorageContext _storageContext;
        private IArticleRep _articleRepository;
        private IHostingEnvironment _host;
        private IPasswordValidator<Author> _passwordValidator;
        private IPasswordHasher<Author> _passwordHasher;
        private readonly string[] ACCEPTED_FILE_TYPES = new[] { ".jpg", ".jpeg", ".png" };

        public AdministrationController(
            UserManager<Author> userMng,
            SignInManager<Author> signInMng,
            StorageContext strgContext,
            IArticleRep artRep,
            IHostingEnvironment hst,
            IPasswordValidator<Author> pswVld,
            IPasswordHasher<Author> pswHs
            )
        {
            _userManager = userMng;
            _signInManager = signInMng;
            _storageContext = strgContext;
            _articleRepository = artRep;
            _host = hst;
            this._passwordValidator = pswVld;
            this._passwordHasher = pswHs;

        }
        #endregion


        #region Avatar-Setting
        [HttpPost("[action]"), DisableRequestSizeLimit]
        public async Task<ActionResult> UploadImage()
        {
            try
            {
                var file = Request.Form.Files[0];
                string folderName = "author-images";
                string webRootPath = _host.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    Author author = await _userManager.GetUserAsync(HttpContext.User);
                    FrontAuthor frontAuthor = this._storageContext.Author.FirstOrDefault(a => a.Id == author.Id);
                    frontAuthor.ImgAddress = "/author-images/" + fileName;
                    this._storageContext.Author.Update(frontAuthor);
                    await this._storageContext.SaveChangesAsync();
                }
                return Json("ok");
            }
            catch (System.Exception ex)
            {
                return Json("Error:" + ex.Message);
            }
        }
        #endregion

        #region Change-Password
        [HttpPost("[action]")]
        public async Task<ActionResult> ChangePassowrd([FromBody]Password password)
        {
            Author author = await _userManager.GetUserAsync(HttpContext.User);
            IdentityResult validPass = null;
            if (!string.IsNullOrEmpty(password.NewPass))
            {
                validPass = await _passwordValidator.ValidateAsync(_userManager, author, password.NewPass);
                if (validPass.Succeeded)
                {
                    author.PasswordHash = _passwordHasher.HashPassword(author, password.NewPass);
                }
                else
                {
                    return Json(validPass.Errors);

                }
            }
            if (password.NewPass != string.Empty && validPass.Succeeded)
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
        public async Task<ActionResult> ChangeProfile([FromBody]Profile profile)
        {
            Author author = await _userManager.GetUserAsync(HttpContext.User);
            FrontAuthor frontAuthor = _storageContext.Author.FirstOrDefault(u => u.Id == author.Id);
            if (!string.IsNullOrEmpty(profile.Email) &&
                        !string.IsNullOrWhiteSpace(profile.Email))
            {
                author.Email = profile.Email;
            }
            if (!string.IsNullOrWhiteSpace(profile.UserName) && !string.IsNullOrEmpty(profile.UserName))
            {
                author.UserName = profile.UserName;
                frontAuthor.UserName = profile.UserName;
            }
            if (!string.IsNullOrEmpty(profile.PersianName) && !string.IsNullOrWhiteSpace(profile.PersianName))
            {
                author.NameInPersian = profile.PersianName;
                frontAuthor.Name = profile.PersianName;
            }
            if (!string.IsNullOrEmpty(profile.Category) && !string.IsNullOrWhiteSpace(profile.Category))
            {
                author.Category = profile.Category;
                frontAuthor.Category = profile.Category;
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
        public async Task<Profile> FetchAuthor()
        {
            Author author = await _userManager.GetUserAsync(HttpContext.User);
            FrontAuthor fAuthor = _storageContext.Author.FirstOrDefault(a => a.Id == author.Id);
            if (author != null)
            {
                Profile comingAuthor = new Profile
                {
                    Email = author.Email,
                    UserName = author.UserName,
                    PersianName = author.NameInPersian,
                    Category = fAuthor.Category,
                    ImageAddress = fAuthor.ImgAddress
                };
                return comingAuthor;
            }
            return null;
        }
        #endregion

    }

}
