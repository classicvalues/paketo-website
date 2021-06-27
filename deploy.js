firebase = require('firebase-tools');

module.exports = async ({ context, github } = {}) => {
  const { GITHUB_HEAD_REF, FIREBASE_TOKEN} = process.env;
  // overkill... probably.
  const branch = GITHUB_HEAD_REF.split('/')
      .filter(item => item.trim().length > 0)
      .pop();

  firebase
    .hosting
    .channel
    .deploy(branch, { json: true, e: '24h', only: 'paketo-staging', token: FIREBASE_TOKEN})
    .then((data) => {
      if (context !== undefined && github !== undefined) {
        console.log(`Lets create a comment`)
        github.issues.createComment({
          issues_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: `PR deployed to: ${data['paketo-staging'].url}`
        }).then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(`createComment: ${err}`);
        });
      }
      console.log(data);
    })
    .catch((err) => {
      console.log(`deploy: ${err}`);
    });
}


