var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as core from '@actions/core';
import * as github from '@actions/github';
import { parser } from '@conventional-commits/parser';
import { env } from 'process';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('🤨 Validating conventional commits');
        if (github.context.eventName === 'push') {
            validatePush(github.context.payload);
        }
        if (github.context.eventName == 'pull_request') {
            validatePullRequest(github.context.payload);
        }
        core.info('🎉 Success');
    });
}
function validatePush(event) {
    validateCommits(event.commits);
}
function validatePullRequest(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield github.getOctokit(env.GITHUB_TOKEN || "").request(event.pull_request.commits_url);
        let commitResponse = response.data;
        let commits = commitResponse.map((response) => { return response.commit; });
        validateCommits(commits);
    });
}
function ignore(commit) {
    return commit.message.match('merge');
}
function validateCommits(commits) {
    commits.forEach((commit) => {
        if (ignore(commit)) {
            core.info(`🤫 Ignoring '${commit.message}'`);
            return;
        }
        try {
            parser(commit.message);
            core.info(`✅ ${commit.message}`);
        }
        catch (error) {
            core.error(`❌ ${commit.message}`);
            core.setFailed(error);
        }
    });
}
run();
