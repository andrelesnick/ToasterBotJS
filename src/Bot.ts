import { Client, ClientOptions } from "discord.js";
// run bot with npm run start
// npm install -g ts-node

require('dotenv').config()


console.log("Bot is starting...");
console.log(process.env.TOKEN)
const token = process.env.TOKEN;

const client = new Client({
    intents: []
});

// console.log(client);

client.login(token);
