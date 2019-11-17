# Arduino controller Client & Server implementation with Node and React
Server will notify all clients for all changes made in server side (Arduino's server).

## CLIENT
Client will listen ws for changes made in server side and this changes will be rendered in the view.
#### Install project
```
npm i
```
## Commands
Before build, change ipServer property in Arduino component with your ip address and port 8090.
#### Build, Run web server and open client.
```
npm start
```
#### Generate dist folder
```
webpack
```

## SERVER

#### Install project
```
npm i
```
## Commands

#### Run ws server on port 8090.
```
node index.js
```


