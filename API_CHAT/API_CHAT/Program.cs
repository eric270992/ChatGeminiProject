using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// Fitxers config
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

// Afegir el fitxer appsettings.secrets.json
builder.Configuration.AddJsonFile("appsettings.secrets.json", optional: true, reloadOnChange: true);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

// Add CORS services with an "Allow All" policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // Permet qualsevol origen
              .AllowAnyMethod() // Permet qualsevol mètode HTTP (GET, POST, etc.)
              .AllowAnyHeader(); // Permet qualsevol capçalera
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS with the "AllowAll" policy
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
