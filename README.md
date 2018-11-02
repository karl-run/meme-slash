[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2189b8d81b08468c9a477b9e39730872)](https://www.codacy.com/app/karloveraa/meme-slash?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=karl-run/meme-slash&amp;utm_campaign=Badge_Grade)

# meme bot for slack

## Development

0. `npm i`
1. 
2. `npm run start:dev`
3. Execute a POST request to `localhost:3000` with body:
```
&text=help
&response_url=https://hooks.slack.com/commands/1234/5678
```

## Deployment

This bot has been configured to be very easily deployed to [zeit's now](https://zeit.co/now)

If you have `now-cli` installed simply deploy with the `now` command, and configure a custom integration in Slack.
