"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommits = void 0;
const core = require("@actions/core");
const github = require("@actions/github");
const process_1 = require("process");
const parser_1 = require("@conventional-commits/parser");
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
        let response = yield github.getOctokit(process_1.env.GITHUB_TOKEN || "").request(event.pull_request.commits_url);
        let commitResponse = response.data;
        let commits = commitResponse.map((response) => { return response.commit; });
        validateCommits(commits);
    });
}
function ignore(message) {
    return message.match(/merge/i);
}
function validateCommits(commits) {
    commits.forEach((commit) => {
        const firstLine = commit.message.split('\n')[0];
        if (ignore(firstLine)) {
            core.info(`🤫 Ignoring '${firstLine}'`);
            return;
        }
        try {
            (0, parser_1.parser)(firstLine);
            core.info(`✅ ${firstLine}`);
        }
        catch (error) {
            core.error(`❌ ${firstLine}`);
            core.setFailed(error);
        }
    });
}
exports.validateCommits = validateCommits;
run();
