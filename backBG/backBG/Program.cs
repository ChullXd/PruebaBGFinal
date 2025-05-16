using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using BankBG.Data;
using BankBG.Models;
using BankBG.Services;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configurar Serilog Log.Logger = new LoggerConfiguration() .WriteTo.Console() .WriteTo.File("logs/audit.txt", rollingInterval: RollingInterval.Day) .CreateLogger(); builder.Host.UseSerilog();

// Configurar DbContext builder.Services.AddDbContext(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configurar Identity builder.Services.AddIdentity<ApplicationUser, IdentityRole>() .AddEntityFrameworkStores() .AddDefaultTokenProviders();

// Configurar JWT var jwtSettings = builder.Configuration.GetSection("Jwt"); var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("Jwt:Key no configurado")); builder.Services.AddAuthentication(options => { options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; }) .AddJwtBearer(options => { options.TokenValidationParameters = new TokenValidationParameters { ValidateIssuer = true, ValidateAudience = true, ValidateLifetime = true, ValidateIssuerSigningKey = true, ValidIssuer = jwtSettings["Issuer"], ValidAudience = jwtSettings["Audience"], IssuerSigningKey = new SymmetricSecurityKey(key) }; });

// Configurar servicios builder.Services.AddScoped(); builder.Services.AddScoped(); builder.Services.AddScoped();

// Configurar AutoMapper builder.Services.AddAutoMapper(typeof(Program));

// Configurar CORS builder.Services.AddCors(options => { options.AddPolicy("AllowFrontend", policy => policy.WithOrigins("http://localhost:5173") .AllowAnyMethod() .AllowAnyHeader()); });

// Configurar controladores y Swagger builder.Services.AddControllers(); builder.Services.AddEndpointsApiExplorer(); builder.Services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new OpenApiInfo { Title = "bankBG API", Version = "v1" }); c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme { In = ParameterLocation.Header, Description = "Please enter JWT with Bearer into field", Name = "Authorization", Type = SecuritySchemeType.ApiKey, Scheme = "Bearer" }); c.AddSecurityRequirement(new OpenApiSecurityRequirement { { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, new string[] {} } }); });

var app = builder.Build();

// Configurar middleware if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }

app.UseHttpsRedirection(); app.UseCors("AllowFrontend"); app.UseAuthentication(); app.UseAuthorization(); app.MapControllers();

app.Run();