const core = require('@actions/core');
const github = require('@actions/github');

// most @actions toolkit packages have async methods
function run() {
  try {
    const webhooks = core.getInput('webhooks');
    const successColor = core.getInput('success-color');
    const failureColor = core.getInput('failure-color');
    const nudgeBlocks = core.getInput('nudge-blocks');

    core.info(`Webhooks: ${webhooks}. Success color: ${successColor}. Failure color: ${failureColor}. Nudge blocks: ${nudgeBlocks}`);
    core.info(`Github context: ${github}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
