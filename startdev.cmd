
cd %~dp0/client_code/
start /min tsc -w

cd %~dp0/client_code/
start /min npm run webpackdev

cd %~dp0/
start /min npm run start
