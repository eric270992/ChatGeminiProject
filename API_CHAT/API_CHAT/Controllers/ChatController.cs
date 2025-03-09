using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using System.Text;
using RestSharp;
using System.Runtime.InteropServices.JavaScript;
using Newtonsoft.Json.Linq;
using API_CHAT.DTO;
using AutoGen.Gemini;
using AutoGen.Core;

namespace API_CHAT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private string ApiKey = "";
        private string ApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
        private readonly string SystemPrompt = "Ets un assistent virtual útil i concís que respon en català." +
            " El teu public són alumnes d'un institut. " +
            "Només pots contestar pensant en que són alumnes, no es poden donar respostes inapropiades."; // Prompt del sistema
        MiddlewareStreamingAgent<GeminiChatAgent> agent;

        public ChatController(IConfiguration _configuration)
        {
            ApiKey = _configuration["ApiKey"] ?? throw new ArgumentNullException("API key is missing");
            ApiUrl += ApiKey;

            agent = new GeminiChatAgent(
                name: "gemini",
                model: "gemini-2.0-flash",
                apiKey: ApiKey,
                systemMessage: SystemPrompt)
                .RegisterMessageConnector()
                .RegisterPrintMessage();

        }

        [HttpGet("/oldChat/{pregunta}")]
        public async Task<IActionResult> GetPreguntaAmbAPI(string pregunta)
        {
            var client = new RestClient(ApiUrl);
            var request = new RestRequest("?key=" + ApiKey, Method.Post);
            request.AddHeader("Content-Type", "application/json");

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[] {
                            new { text = SystemPrompt },
                            new { text = pregunta }

                        }
                    }
                }
            };

            request.AddJsonBody(requestBody);

            var response = await client.ExecuteAsync(request);

            if (!response.IsSuccessful)
            {
                return StatusCode((int)response.StatusCode, new Wrapper { Resposta = response.Content, StatusCode = (int)response.StatusCode });
            }

            string text = "";

            JObject jObject = JObject.Parse(response.Content);

            try
            {
                text = jObject["candidates"][0]["content"]["parts"][0]["text"].ToString();
            }
            catch (Exception err)
            {
                text = "Error processant la resposta";
            }

            return Ok(new Wrapper { Resposta = text, StatusCode = 200 });
        }

        [HttpGet("{pregunta}")]
        public async Task<IActionResult> GetPregunta(string pregunta)
        {

            #region Commentat, declaració inline
            //var geminiAgent = new GeminiChatAgent(
            //    name: "gemini",
            //    model: "gemini-2.0-flash",
            //    apiKey: ApiKey,
            //    systemMessage: SystemPrompt);
            //geminiAgent.RegisterMessageConnector();
            //geminiAgent.RegisterPrintMessage();
            #endregion

            // Enviar el missatge a geminiAgent
            var reply = await agent.SendAsync(pregunta);

            string text = "";

            text = reply.GetContent() ?? "Error processant resposta";

            return Ok(new Wrapper { Resposta = text, StatusCode = 200 });
        }
    }
}

