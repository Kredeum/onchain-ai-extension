if (!secrets.openaiKey) throw Error("Need OPENAI_KEY environment variable");

const data = {
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: args[0] }],
};

const openAiResponse = await Functions.makeHttpRequest({
  url: "https://api.openai.com/v1/chat/completions",
  method: "POST",
  headers: {
    "Content-Type": `application/json`,
    Authorization: `Bearer ${secrets.openaiKey}`,
  },
  data: data,
});

const result = openAiResponse.error
  ? `ERROR ${openAiResponse.message}`
  : openAiResponse.data.choices[0].message.content;
console.log("result:", result);

return Functions.encodeString(result);
