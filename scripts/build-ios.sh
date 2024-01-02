#!/bin/bash

cd $(dirname $0)
cd ..

source .env

CONFIGURATION="Release"
EXPORT_OPTIONS_FILE="exportOptions.plist"

mkdir ~/.private_keys
echo "$APPLE_AUTHKEY" > ~/.private_keys/AuthKey_$APP_STORE_CONNECT_KEY_IDENTIFIER.p8

if [[ "$DEV" == "true" ]]
then
    EXPORT_OPTIONS_FILE="exportOptions.dev.plist"
fi

npx react-native bundle --minify --platform ios --dev "$DEV" --entry-file index.js --bundle-output ios/main.jsbundle --sourcemap-output ios/main.jsbundle.map --assets-dest ./ios

cd ios
pod install --repo-update

xcodebuild -quiet archive -workspace $XCODE_WORKSPACE -scheme $XCODE_SCHEME -configuration "$CONFIGURATION" -archivePath $XCODE_SCHEME.xcarchive
xcodebuild -quiet -exportArchive -archivePath $XCODE_SCHEME.xcarchive -exportOptionsPlist "$EXPORT_OPTIONS_FILE" -exportPath "export"

if [[ "$DEV" != "true" ]]
then
    BUNDLE_VERSION=$(agvtool what-version -terse)
    VERSION=$(agvtool what-marketing-version -terse1)

    cd "export"
    xcrun swinfo -f $XCODE_SCHEME.ipa -o AppStoreInfo.plist -plistFormat binary

    xcrun altool --validate-app -f $XCODE_SCHEME.ipa -t ios \
        --apiKey $APP_STORE_CONNECT_KEY_IDENTIFIER \
        --apiIssuer $APP_STORE_CONNECT_ISSUER_ID

    xcrun altool --upload-package $XCODE_SCHEME.ipa \
        -t ios \
        --apple-id $APPLE_ID \
        --bundle-id $BUNDLE_ID \
        --bundle-short-version-string "$MAJOR_VERSION.$MINOR_VERSION.$PATCH_VERSION" \
        --bundle-version "$BUILD_NUMBER" \
        --apiKey $APP_STORE_CONNECT_KEY_IDENTIFIER \
        --apiIssuer $APP_STORE_CONNECT_ISSUER_ID

    cd ..
fi