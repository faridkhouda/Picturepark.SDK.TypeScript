pushd "%~dp0/../src/picturepark-sdk-v1-angular"
cmd /c call "node_modules/.bin/ng" test --watch=false || goto :error
popd

pushd "%~dp0/../src/picturepark-sdk-v1-angular-ui"
cmd /c call "node_modules/.bin/ng" test --watch=false || goto :error
popd

pushd "%~dp0/../src/picturepark-sdk-v1-angular-app"
cmd /c call "node_modules/.bin/ng" test --watch=false || goto :error
popd

goto :EOF
:error
echo Failed with error #%errorlevel%.
exit /b %errorlevel%