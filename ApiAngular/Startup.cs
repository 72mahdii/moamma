using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using ApiAngular.Models.Authors;
using ApiAngular.Models.Repository;
using ApiAngular.Models;

namespace ApiAngular
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {

            services.AddSingleton<FrontAuthor>();
            services.AddSingleton<IArticleRep, ArticleRepository>();
            services.AddDbContext<AdministrationContext>(options =>
                options.UseSqlServer(Configuration["ConnectionStrings:Author:ConnectionString"]));
            services.AddDbContext<StorageContext>(options =>
                options.UseSqlServer(Configuration["ConnectionStrings:Storage:ConnectionString"]));
            services.AddIdentity<Author, IdentityRole>()
                .AddEntityFrameworkStores<AdministrationContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme =
                            JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme =
                            JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.Authority = "http://authors.moammapey.ir";
                o.Audience = "resourceapi";
                o.RequireHttpsMetadata = false;
            });
            services.AddMvc();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("ApiReader",
                        policy =>
                            policy.RequireClaim(
                                "scope", "api.read"));
                options.AddPolicy("Consumer",
                        policy =>
                            policy.RequireClaim(
                                ClaimTypes.Role, "consumer"));
                options.AddPolicy("moamma_spa",
                    policy =>
                        policy.RequireClaim("scope", "api.read"));
                options.AddPolicy("god_spa", policy =>
                        policy.RequireClaim("scope", "api.read"));
                options.AddPolicy("God",
                        policy =>
                            policy.RequireClaim(
                                ClaimTypes.Role, "god"));

            });
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseHsts();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
