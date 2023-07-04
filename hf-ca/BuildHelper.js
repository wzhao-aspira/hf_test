const fs = require("fs");

function addVersion() {
    const json = fs.readFileSync("app.json", "utf8");
    const appJson = JSON.parse(json);

    const buildNumStr = appJson.expo.ios.buildNumber;
    const splits = buildNumStr.split(".");
    const { length } = splits;
    // build num ++
    splits[length - 1] = `${Number(splits[length - 1]) + 1}`;
    const buildNum = splits.join(".");
    appJson.expo.ios.buildNumber = buildNum;
    let { versionCode } = appJson.expo.android;
    versionCode += 1;
    appJson.expo.android.versionCode = versionCode;
    try {
        fs.writeFileSync("app.json", JSON.stringify(appJson, null, 2));
    } catch (err) {
        console.error(err);
    }

    console.log(
        `${appJson.expo.ios.bundleIdentifier}-${appJson.expo.version}-${appJson.expo.ios.buildNumber}-${versionCode}-${appJson.expo.name}`
    );
}

addVersion();
