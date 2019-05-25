using IdentityServer4.Events;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Authentication.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Controllers
{
    public class AccountController : Controller
    {

        /* Properties */
        #region Properties

        private UserManager<Author> _userManager;
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IAuthenticationSchemeProvider _schemeProvider;
        private readonly IClientStore _clientStore;
        private readonly IEventService _events;

        #endregion

        /* Constructor */
        #region Constructor

        public AccountController(
            UserManager<Author> userManager,
            IIdentityServerInteractionService interaction,
            IAuthenticationSchemeProvider schemeProvider,
            IClientStore clientStore,
            IEventService events
        )
        {
            _userManager = userManager;
            _interaction = interaction;
            _schemeProvider = schemeProvider;
            _clientStore = clientStore;
            _events = events;
        }

        #endregion

        /* Login Action */
        #region Login

        // GET
        [HttpGet]
        public async Task<IActionResult> Login(string returnUrl)
        {
            // build a model so we know what to show on the login page
            var vm = await BuildLoginViewModelAsync(returnUrl);

            if (vm.IsExternalLoginOnly)
            {
                // we only have one option for logging in and it's an external provider
                return RedirectToAction("Challenge", "External", new { provider = vm.ExternalLoginScheme, returnUrl });
            }

            return View(vm);
        }

        // POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginInputModel model, string button)
        {

            var context =
                    await _interaction
                    .GetAuthorizationContextAsync(model.ReturnUrl);
            if (ModelState.IsValid)
            {
                var user = await _userManager
                        .FindByNameAsync(model.Username);
                if (user != null &&
                        await _userManager
                        .CheckPasswordAsync(user, model.Password))
                {
                    await _events
                            .RaiseAsync(
                                new UserLoginSuccessEvent(
                                    user.UserName,
                                    user.Id,
                                    user.NameInPersian));
                    AuthenticationProperties props = null;

                    if (AccountOptions.AllowRememberLogin &&
                                model.RememberLogin)
                    {
                        props = new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTimeOffset.UtcNow
                                    .Add(AccountOptions
                                        .RememberMeLoginDuration)
                        };
                    };

                    await HttpContext.SignInAsync(
                        user.Id,
                        user.UserName,
                        props);
                    User.IsInRole("GOD");
                    var v = _userManager.GetUserAsync(HttpContext.User);

                    if (context != null)
                    {
                        if (await _clientStore
                            .IsPkceClientAsync(context.ClientId))
                        {
                            return View("Redirect",
                                new RedirectViewModel
                                {
                                    RedirectUrl = model.ReturnUrl
                                });
                        }

                        return Redirect(model.ReturnUrl);
                    }

                    if (Url.IsLocalUrl(model.ReturnUrl))
                    {
                        return Redirect(model.ReturnUrl);
                    }
                    else if (string.IsNullOrEmpty(model.ReturnUrl))
                    {
                        return Redirect("~/");
                    }
                    else
                    {
                        throw new Exception("invalid return URL");
                    }
                }

                await _events.RaiseAsync(
                    new UserLoginFailureEvent(
                        model.Username,
                        "invalid credentials"));
                ModelState.AddModelError(
                    string.Empty,
                    AccountOptions.InvalidCredentialsErrorMessage);
            }

            var vm = await BuildLoginViewModelAsync(model);

            return View(vm);
        }

        #endregion

        /* Methods */
        #region Methods
        private async Task<LoginAuthor> BuildLoginViewModelAsync(string returnUrl)
        {
            var context =
            await _interaction.GetAuthorizationContextAsync(
                                                returnUrl);
            if (context?.IdP != null)
            {
                var local = context.IdP ==
                IdentityServer4.IdentityServerConstants
                                    .LocalIdentityProvider;

                // this is meant to short circuit the UI and only trigger the one external IdP
                var vm = new LoginAuthor
                {
                    EnableLocalLogin = local,
                    ReturnUrl = returnUrl,
                    Username = context?.LoginHint,
                };

                if (!local)
                {
                    vm.ExternalProviders =
                            new[] { new ExternalProvider {
                                AuthenticationScheme = context.IdP } };
                }

                return vm;
            }

            var schemes = await _schemeProvider
                                    .GetAllSchemesAsync();

            var providers = schemes.Where(x =>
                        x.DisplayName != null ||
                        (x.Name.Equals(AccountOptions
                                .WindowsAuthenticationSchemeName,
                        StringComparison.OrdinalIgnoreCase))
                )
                .Select(x => new ExternalProvider
                {
                    DisplayName = x.DisplayName,
                    AuthenticationScheme = x.Name
                }).ToList();

            var allowLocal = true;
            if (context?.ClientId != null)
            {
                var client =
                        await _clientStore
                                .FindEnabledClientByIdAsync(
                                    context.ClientId);
                if (client != null)
                {
                    allowLocal = client.EnableLocalLogin;

                    if (client.IdentityProviderRestrictions !=
                                null &&
                                client.IdentityProviderRestrictions
                                                .Any())
                    {
                        providers = providers.Where(
                            provider => client
                            .IdentityProviderRestrictions
                            .Contains(provider.AuthenticationScheme))
                            .ToList();
                    }
                }
            }

            return new LoginAuthor
            {
                AllowRememberLogin = AccountOptions.AllowRememberLogin,
                EnableLocalLogin = allowLocal &&
                                AccountOptions.AllowLocalLogin,
                ReturnUrl = returnUrl,
                Username = context?.LoginHint,
                ExternalProviders = providers.ToArray()
            };
        }

        private async Task<LoginAuthor> BuildLoginViewModelAsync(LoginInputModel model)
        {
            var vm = await BuildLoginViewModelAsync(model.ReturnUrl);
            vm.Username = model.Username;
            vm.RememberLogin = model.RememberLogin;
            return vm;
        }

        #endregion

    }
}
