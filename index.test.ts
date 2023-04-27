import * as core from '@actions/core'

import {validateCommits} from "./index"

jest.mock('@actions/core');

test("should handle conventional commits",() => {
    const commits = [
        { message: 'fix: foo' },
        { message: 'chore: foo' }
    ]
    validateCommits(commits)
})

test("should ignore (not throw) merge commits",() => {
    const commits = [
        { message: 'Merge foo into bar' },
        { message: 'Backmerge of foo into barar' }
    ]
    validateCommits(commits)
})

test("should handle merge commits with quotes",() => {
    const commits = [
        { message: `Backmerge of 'foo/internal-dash-dash' into barar` }
    ]
    validateCommits(commits)
})

test("should handle merge commits with many lines",() => {
    const commits = [
        { message: `Backmerge of 'foo/internal-dash-dash' into barar

Some details foo

# CONFLICTS
# Foo
# bar
            ` }
    ]
    validateCommits(commits)
})

test("should only pass on first line to core.info when ignoring", () => {
    validateCommits([{message: 'Merge something\nfoo\nbar'}])
    expect(core.info).toHaveBeenCalledWith("🤫 Ignoring 'Merge something'")
})
