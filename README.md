# Hoodie Integration Tests
[![Build Status](https://travis-ci.org/hoodiehq/hoodie-integration-test.svg)](https://travis-ci.org/hoodiehq/hoodie-integration-test)
[![Dependency Status](https://david-dm.org/hoodiehq/hoodie-integration-test.svg)](https://david-dm.org/hoodiehq/hoodie-integration-test)
[![devDependency Status](https://david-dm.org/hoodiehq/hoodie-integration-test/dev-status.svg)](https://david-dm.org/hoodiehq/hoodie-integration-test#info=devDependencies)

This repo includes a test scenario that mirrors the Hoodie end-user-experience from install & setup to first run. It exists to ensure that Hoodie is usable at all times by all users.

Tests are run on [Travis](https://travis-ci.org) and are configured in `.travis.yml`.

Since travis only starts a test build when pushing commits to a repo, and since we want to run the full integration test when anything changes in any of the components we control, we needed to come up with a trick.

That trick is called [Hoodie Test Hook Server](https://github.com/hoodiehq/hoodie-test-hook-server). It receives a GitHub WebHook request and then pings the Travis build hook for this repo. For any component of Hoodie, we configured this Hook to be a WebHook target, so that we run the tests every time we make a change.

The one downside is that a breaking change will be reported to the person who last committed to this repo instead of the one that includes the braking change, but a quick look at the commit history for the projects should reveal the culprit.

It would be nice if Travis would allow for dependency-change-started-builds, but we understand that it is a bit out of left field and this works good enough for now.


