const path = require("path");
const fs = require("fs");
const pkg = require("./package.json");
const OSS = require("ali-oss");

const distPath = path.join(__dirname, "dist");
const { OSS_ACCESSKEY_SECRET } = process.env;

const prefix = "public/UEditor";
const date = new Date();
const time = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}`;

const client = new OSS({
    region: "oss-cn-shenzhen",
    accessKeyId: "LTAI4FoHdaH1dEz4SdnK7AkW",
    accessKeySecret: OSS_ACCESSKEY_SECRET,
    bucket: "ihongzhu",
});

function getDirAllFiles(root) {
    const files = [];
    function getDirFiles(dir) {
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                files.push(filePath.replace(root, ""));
            } else if (stats.isDirectory()) {
                getDirFiles(filePath);
            }
        });
    }
    getDirFiles(root);
    return files;
}

getDirAllFiles(distPath).forEach((file) => {
    const rs = fs.createReadStream(path.join(distPath, file));

    client.putStream(`${prefix}/v${pkg.version}/${time}${file}`, rs);
    client.putStream(`${prefix}/v${pkg.version}${file}`, rs);
    client.putStream(`${prefix}${file}`, rs);
});
