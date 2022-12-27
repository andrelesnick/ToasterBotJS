import Snoowrap from "snoowrap";


const snoowrap = require('snoowrap');

require('dotenv').config()

const r: Snoowrap = new snoowrap({
    userAgent: 'Discord Bot',
    clientId: process.env.REDDIT_CLIENT,
    clientSecret: process.env.REDDIT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

const getRecentHotPosts = async (subreddit: string, limit: number) => {
    const posts = await r.getSubreddit(subreddit).getHot({limit: limit});
    return posts;
}
