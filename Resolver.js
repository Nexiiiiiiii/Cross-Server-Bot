'use strict';

const REGEXES = {
    userMention: /<@!?([0-9]+)>$/,
    roleMention: /<@&([0-9]+)>$/,
    channelMention: /<#([0-9]+)>$/,
    id: /^[0-9]+$/,
}

/**
 * Resolver class for AxonClient
 *
 * @author KhaaZ
 *
 * @static
 * @class Resolver
 */
class Resolver {
    /**
     * Resolve a user within all the users the bot has.
     *
     * @param {Object<Eris.Client>} client - The bot client
     * @param {Array/String} args - Array of arguments resolved by the command.
     * @returns {Object|null} The user object / Null if not found / Error
     */
    static user(client, args) {
        // Checking if all the arguments are supplied.
        if (!args.length) {
            throw new Error('RESOLVER [user]: All the arguments are either not given or false.');
        }
        // Checking if args is an array, if it is not, converting it to an array.
        if (!Array.isArray(args) ) {
            args = `${args}`.split(' ');
        }

        args.all = args.join(' ');
        args.lower = args.all.toLowerCase();
        const users = client.users;

        const mention = REGEXES.userMention.exec(args[0] );

        const user = ( (mention && mention[1] ) && users.get(mention[1] ) ) // User mention
            || (REGEXES.id.test(args[0] ) && users.get(args[0] ) ) // User ID
            || (args.all.indexOf('#') > -1 && users.find(u => `${u.username}#${u.discriminator}` === args.all) ) // Username + discrim
            || users.find(u => u.username === args.all) // Username
            || users.find(u => u.username.toLowerCase() === args.lower) // Username lowercase
            || users.find(u => u.username.includes(args.all) ) // Username includes
            || users.find(u => u.username.toLowerCase().includes(args.lower) ) // Username lowercase includes
            || null;// No users found

        return user; // Return the user object.
    }

    /** Resolve a member within a guild.
     *
     * @param {Object<Guild>} guild - Object Guild resolved by the command.
     * @param {Array/String} args - Array of arguments resolved by the command.
     * @returns {Object|null} The member object / Null if not found / Error
     */
    static member(guild, args) {
        // Checking if all the arguments are supplied.
        if (!guild || !args.length) {
            throw new Error('RESOLVER [member]: All the arguments are either not given or false.');
        }
        // Checking if args is an array, if it is not, converting it to an array.
        if (!Array.isArray(args) ) {
            args = `${args}`.split(' ');
        }

        args.all = args.join(' ');
        args.lower = args.all.toLowerCase();
        const members = guild.members;

        const mention = REGEXES.userMention.exec(args[0] );

        const member = ( (mention && mention[1] ) && members.get(mention[1] ) ) // User mention
            || (REGEXES.id.test(args[0] ) && members.get(args[0] ) ) // User ID
            || (args.all.indexOf('#') > -1 && members.find(m => `${m.username}#${m.discriminator}` === args.all) ) // Username + discrim
            || members.find(m => m.username === args.all) // Username
            || members.find(m => m.nick === args.all) // nickname
            || members.find(m => m.username.toLowerCase() === args.lower) // Username lowercase
            || members.find(m => m.nick && m.nick.toLowerCase() === args.lower) // nickname lowercase
            // members.find(m => m.username.includes(args.all) ) || // Username includes
            // members.find(m => m.nick && m.nick.includes(args.all) ) || // nickname includes
            || members.find(m => m.username.toLowerCase().includes(args.lower) ) // username lowercase includes
            || members.find(m => m.nick && m.nick.toLowerCase().includes(args.lower) ) // nickname lowercase includes
            || null; // No member found

        return member; // Return the member object.
    }

    /**
     * Resolve a role within a guild.
     *
     * @param {Object<Guild>} guild - Object Guild resolved by the command.
     * @param {Array/String} args - Array of arguments resolved by the command.
     * @returns {Object|null} The role object / Null if not found / Error
     */
    static role(guild, args) {
        // Checking if all the arguments are supplied.
        if (!guild || !args.length) {
            throw new Error('RESOLVER [role]: All the arguments are either not given or false.');
        }

        // Checking if args is an array, if it is not, converting it to an array.
        if (!Array.isArray(args) ) {
            args = `${args}`.split(' ');
        }

        args.all = args.join(' ');
        args.lower = args.all.toLowerCase();
        const roles = guild.roles;

        const mention = REGEXES.roleMention.exec(args[0] );

        const role = ( (mention && mention[1] ) && roles.get(mention[1] ) ) // mention
            || (REGEXES.id.test(args[0] ) && roles.get(args[0] ) ) // id
            || roles.find(m => m.name === args.all) // name
            || roles.find(m => m.name.toLowerCase() === args.lower) // name lower
            || roles.find(m => m.name.includes(args.all) ) // name includes
            || roles.find(m => m.name.toLowerCase().includes(args.lower) ) // name loxer includes
            || null; // no role found

        return role;
    }

    /**
     * Resolve a channel within a guild.
     *
     * @param {Object<Guild>} guild - Object Guild resolved by the command.
     * @param {Array/String} args - Array of arguments resolved by the command.
     * @returns {Object|null} The channel object / Null if not found / Error
     */
    static channel(guild, args) {
        // Checking if all the arguments are supplied.
        if (!guild || !args.length) {
            throw new Error('RESOLVER [channel]: All the arguments are either not given or false.');
        }

        // Checking if args is an array, if it is not, converting it to an array.
        if (!Array.isArray(args) ) {
            args = `${args}`.split(' ');
        }

        args.all = args.join(' ');
        args.lower = args.all.toLowerCase();
        const channels = guild.channels;

        const mention = REGEXES.channelMention.exec(args[0] );

        const channel = ( (mention && mention[1] ) && channels.get(mention[1] ) )
            || (REGEXES.id.test(args[0] ) && channels.get(args[0] ) )
            || channels.find(c => c.name === args.all) // name
            || channels.find(c => c.name.toLowerCase() === args.lower) // name lower
            || channels.find(c => c.name.includes(args.all) ) // name includes
            || channels.find(c => c.name.toLowerCase().includes(args.lower) ) // name lower includes
            || null; // no channel found

        return channel;
    }

    /**
     * Resolve a guild within all guilds the bot is in.
     *
     * @param {Object<Eris.Client>} client - The bot client
     * @param {Array} args - Array with guild name/ID
     * @returns {Object|null} The guild object / Null if not found / Error
     */
    static guild(client, args) {
        // Checking if all the arguments are supplied.
        if (!args.length) {
            throw new Error('RESOLVER [guild]: All the arguments are either not given or false.');
        }

        const guilds = client.guilds;
        args.all = args.join(' ');
        args.lower = args.all.toLowerCase();

        const guild = (REGEXES.id.test(args[0] ) && guilds.find(g => g.id === args[0] ) ) // ID
            || guilds.find(g => g.name === args.all) // Name
            || guilds.find(g => g.name.toLowerCase() === args.lower) // Lowercase name
            || guilds.find(g => g.name.includes(args.all) ) // Includes name
            || guilds.find(g => g.name.toLowerCase().includes(args.lower) ) // Includes lowercase name
            || null;

        return guild;
    }
}

module.exports = Resolver;
