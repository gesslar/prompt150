# Prompt 150

[Prompt 150](https://prompt150.gesslar.io) is a prompt generator for writing
complete stories in exactly 150 words. The words in the prompt count toward the
total.

The site has three views:

- `index.html` presents five prompts selected for the current week.
- `generate.html` starts with five random prompts and adds another whenever requested.
- `about.html` explains the 150-word format and the two kinds of prompt selection.

## Development

```sh
npm run dev
```

## Generate the weekly selection

```sh
npm run prompts:weekly
```

This writes five unique prompts and a generation timestamp to
`src/data/weekly-prompts.json`. Schedule that command weekly with the task
runner used by the deployment environment. The command should run from the
project root.

For example, a traditional crontab entry for every Monday at 3:00 a.m. is:

```cron
0 3 * * 1 cd /path/to/prompt150 && /path/to/npm run prompts:weekly
```

When deployed by the included GitHub Actions workflow, the cron script lives
under the site's `cron/` directory and automatically writes to the published
`data/` directory. Its `.htaccess` denies all web requests while still allowing
the DreamHost account to execute it from the filesystem.

DreamHost does not provide Node.js by default on newer servers. After installing
Node under the website's Shell user, connect over SSH and run `which node`. Use
the absolute path it returns in the cron command:

```cron
0 3 * * 1 /absolute/path/from/which/node /home/USERNAME/prompt150.gesslar.io/cron/generate-weekly-prompts.mjs
```

DreamHost cron schedules use the server's Pacific time (PST/PDT), so the entry
above means Monday at 3:00 a.m. Pacific. The same command can instead be added
through the DreamHost panel's Cron Jobs page.

## Deployment

Pushes to `main` deploy the contents of `src/` together with the protected
`cron/` directory over SSH and rsync. The workflow also copies the cron
directory's minimal `package.json` to the site root so Node treats the shared
generator modules as ES modules. The cron-managed `data/weekly-prompts.json`
file is excluded from rsync, so deployments neither overwrite nor delete the
current weekly selection. Configure these GitHub Actions secrets:

- `SSH_PRIVATE_KEY`
- `SFTP_SERVER`
- `SFTP_USERNAME`
- `SFTP_TARGET_DIR`

For DreamHost, `SFTP_SERVER` is the website user's assigned server hostname and
`SFTP_TARGET_DIR` is normally the full domain directory, such as
`/home/USERNAME/prompt150.gesslar.io/`.
