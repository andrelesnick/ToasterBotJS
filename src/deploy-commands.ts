import { REST, Routes } from 'discord.js'

require('dotenv').config()
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const fs = require('node:fs');

const commands: any = [];

// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter((file: any) => file.endsWith('.ts'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// repeat for all commands in subfolders
const subfolders = fs.readdirSync('./commands').filter((file: any) => !file.endsWith('.ts'));
for (const folder of subfolders) {
    const subcommandFiles = fs.readdirSync(`./commands/${folder}`).filter((file: any) => file.endsWith('.ts'));
    for (const file of subcommandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        commands.push(command.data.toJSON());
    }
}

console.log("Commands to deploy: ", commands)

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token!); // ! asserts that token is not null

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
            Routes.applicationCommands(clientId!),
            { body: commands },
        );

		// console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();