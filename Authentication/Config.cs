using IdentityServer4.Models;
using System.Collections.Generic;

namespace Authentication
{
    public class Config
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Email(),
                new IdentityResources.Profile(),
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("resourceapi", "Resource API")
                {
                    Scopes = {
                        new Scope("api.read"),
                        new Scope
                        {
                            Name = "api1",
                            DisplayName = "API Access",
                            Description = "God API",
                            UserClaims = {"Name", "Role"}
                        }
                    }
                }
            };
        }

        public static IEnumerable<Client> GetClients()
        {
            return new[]
            {
                new Client {
                    RequireConsent = false,
                    ClientId = "moamma_spa",
                    ClientName = "MoammaPey SPA",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowedScopes = {
                        "openid",
                        "profile",
                        "email",
                        "api.read"
                    },
                    RedirectUris = {"http://moammapey.ir/auth-callback"},
                    PostLogoutRedirectUris = {"http://moammapey.ir/index"},
                    AllowedCorsOrigins = {"http://moammapey.ir"},
                    AllowAccessTokensViaBrowser = true,
                    AccessTokenLifetime = 3600
                },
                new Client {
                    RequireConsent = false,
                    ClientId = "god_spa",
                    ClientName = "God SPa",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowedScopes = {
                        "openid",
                        "profile",
                        "email",
                        "api.read",

                    },
                    RedirectUris = {"http://moammapey.ir/god-back"},
                    PostLogoutRedirectUris = {"http://moammapey.ir/index/"},
                    AllowedCorsOrigins = {"http://moammapey.ir"},
                    AllowAccessTokensViaBrowser = true,
                    AccessTokenLifetime = 3600
                },


            };
        }
    }

}
