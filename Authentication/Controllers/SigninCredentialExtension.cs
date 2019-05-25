using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Cryptography.X509Certificates;
using System.IO;

namespace Authentication.Controllers
{
    public static class SigninCredentialExtension
    {
        private const string KeyFilePath = "KeyFilePath";
        private const string KeyFilePassword = "KeyFilePassword";

        public static IIdentityServerBuilder AddSigninCredentialFromConfig(
            this IIdentityServerBuilder builder,
            IConfigurationSection options
            )
        {
            var keyFilePath = options.GetValue<string>(KeyFilePath);
            var keyFilePassword = options.GetValue<string>(KeyFilePassword);

            if (File.Exists(keyFilePath))
            {
                builder.AddSigningCredential(new X509Certificate2(
                    keyFilePath, keyFilePassword,
                    X509KeyStorageFlags.MachineKeySet
                    ));
            }
            return builder;
        }
    }
}
