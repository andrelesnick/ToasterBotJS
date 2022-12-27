import { Client, ClientOptions, Collection, Events, GatewayIntentBits } from "discord.js";
// run bot with npm run start
// npm install -g ts-node
// or run with npx nodemon bot.ts
require('dotenv').config()

import ready from "./listeners/ready";


console.log("Bot is starting...");
const token = process.env.TOKEN;

// creating 'SuperClient' class to wrap Client class to resolve missing property errors
class SuperClient extends Client {
	commands: Collection<unknown, any>

	constructor(options: ClientOptions){
		super(options);
		this.commands = new Collection();
	}
}


const client = new SuperClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// console.log(client);
ready(client)
client.login(token);

// importing slash commands

client.commands = new Collection();

const fs = require('node:fs');
const path = require('node:path');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: any) => file.endsWith('.ts'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// repeat for all commands in subfolders
const subfolders = fs.readdirSync(commandsPath).filter((file: any) => !file.endsWith('.ts'));
for (const folder of subfolders) {
	const subcommandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter((file: any) => file.endsWith('.ts'));
	for (const file of subcommandFiles) {
		const filePath = path.join(commandsPath, folder, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}



// interact with chat commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction)

	// in the future, if you need to access client outside of this file, you can use interaction.client
	// BUT that won't work, so I think you might need to create a superClient out of client, then use that to access client
	// maybe using client.intents as the param
	const command = client.commands.get(interaction.commandName);
	if (!command) {'No command matching ${interaction.commandName} was found.'}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}) 