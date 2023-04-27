import * as core from '@actions/core'
import * as github from '@actions/github'

import { Commit, PullRequestEvent, PushEvent } from '@octokit/webhooks-definitions/schema'

import { env } from 'process'
import { parser } from '@conventional-commits/parser'

type WithMessage = Pick<Commit, 'message'>

async function run() {
    core.info('🤨 Validating conventional commits')
    if (github.context.eventName === 'push') {
        validatePush(github.context.payload as PushEvent)
    }
    if (github.context.eventName == 'pull_request') {
        validatePullRequest(github.context.payload as PullRequestEvent)
    }
    core.info('🎉 Success')
}

function validatePush(event: PushEvent) {
    validateCommits(event.commits)
}

async function validatePullRequest(event: PullRequestEvent) {
    let response = await github.getOctokit(env.GITHUB_TOKEN || "").request(event.pull_request.commits_url)
    let commitResponse: { commit: Commit }[] = response.data
    let commits = commitResponse.map((response) => { return response.commit })
    validateCommits(commits)
}

function ignore(commit:WithMessage){
    return commit.message.match(/merge/i)
}

export function validateCommits(commits: WithMessage[]) {
    commits.forEach((commit) => {
        if(ignore(commit)){
            core.info(`🤫 Ignoring '${commit.message.split('\n')[0]}'`)
            return
        }

        try {
            parser(commit.message)
            core.info(`✅ ${commit.message}`)
        } catch (error) {
            core.error(`❌ ${commit.message}`)
            core.setFailed(error as Error)
        }
    })
}

run()
