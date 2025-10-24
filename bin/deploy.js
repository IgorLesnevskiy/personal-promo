const FtpDeploy = require("ftp-deploy");
const ghpages = require("gh-pages");

const ftpDeploy = new FtpDeploy();
const config = require("../deploy.config.js");

ftpDeploy
  .deploy(config.ftp)
  .then((res) => console.log("finished upload with ftp"))
  .then((res) => {
    ghpages.publish(
      config.github.source,
      {
        ...config.github,
      },
      function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("finished upload with gh-page");
        }
      }
    );
  })
  .catch((err) => console.log(err));
