The first, because of missing node_modules so you must run below command 
```
npm install
```




Error 

Error: EACCES: permission denied, access '/usr/local/lib/node_modules/react-native-cli'
```
sudo chown -R $(whoami) /usr/local/lib/node_modules/react-native-cli
```


Error: Building and installing the app on the device (cd android && ./gradlew installDebug)...
Could not install the app on the device, read the error above for details.
Make sure you have an Android emulator running or a device connected and have
set up your Android development environment:

```
chmod 755 android/gradlew
```

Error: bundling failed: "TransformError: /Users/ntlong/ShareLocSL/ShareLocSL/index.android.js: Cannot find module 'AccessibilityInfo' (While processing preset: \"/Users/ntlong/ShareLocSL/ShareLocSL/node_modules/react-native/Libraries/react-native/react-native-implementation.js\")"

```
Remove build folder in android/app
npm install -g react-native-git-upgrade
```






Open Shake menu
```
adb shell input keyevent 82
```