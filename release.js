const path = require("path");
const fs = require("fs");
const pkg = require("./package.json");
const OSS = require("ali-oss");

const distPath = path.join(__dirname, "dist");
const { OSS_ACCESSKEY_SECRET } = process.env;

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
    client.putStream(
        `public/UEditor/v${pkg.version}${file}`,
        fs.createReadStream(path.join(distPath, file))
    );
});
