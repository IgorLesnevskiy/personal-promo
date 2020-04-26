module.exports = {
    ftp: {
        user: "foo",
        password: "bar",
        host: "192.168.1.1",
        port: 21,
        include: ["**/*"],
        localRoot: __dirname + "/dist",
        remoteRoot: "/www/foo.bar",
        deleteRemote: true,
    },
    github: {
        source: "./dist",
        branch: "gh-pages",
        add: true,
        repo: "git@github.com:repo/repo.git",
    },
};
