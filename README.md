This package enforces the conventional commits are used for a github project.

# Usage
```yaml
name: presubmit
on: [push, pull_request, workflow_dispatch]
jobs:
  presubmit:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: diffia/conventional-commits@v0.0.5
```

# Release new version
Run `npm version [major|minor|patch]`
