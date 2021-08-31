# myclass-online-classroom

Online class platform where teachers can create new classes and students can join those classes via class code.

##How to build and run

* pull the code and run "npm install"
* Create a .env file with environment variables. The variables we need are:<br>
  * .env file in main folder contains :-<br>
    * "DB_CONNECTION" : For storing mongoDb connection URL<br>
    * "TOKEN_SECRET"  : For storing the JWT secret<br>
    * "PORT"  : for storing the port number<br>
  .env file in myclass-client folder contains:-<br>
  "REACT_APP_BASEURL" : For storing backend base URL<br>
* Create a folder named "uploads" in root folder for storing the attachments<br>
* Run "npm run start-dev" in root folder for running backend<br>
* Run "npm run build" for switching to frontend and building the react production file"
* Run "npm start" to run both backend and frontend<br>
                                     
