# File-API-Share-Project 
![CodeQL](https://github.com/hookFang/File-Share-Node.js-Express/workflows/CodeQL/badge.svg?branch=master) ![Node.js CI](https://github.com/hookFang/File-Share-Node.js-Express/workflows/Node.js%20CI/badge.svg?branch=master) ![RepoSize](https://img.shields.io/github/repo-size/hookFang/File-Share-Node.js-Express?label=Repo%20Size&style=plastic) [![WebsiteStatus](https://img.shields.io/website?down_color=red&label=Website%20Status&logo=website&style=plastic&up_color=light%20green&url=https%3A%2F%2Ffileshareapp20.herokuapp.com%2F)](https://fileshareapp20.herokuapp.com/)


This a file sharing API application, Users can upload a file and it creates a random URL which they can share.
The current version supports file upload upto 3GB. 
It will allow anyone with this URL to download the uploaded file. No need to Sign Up, easy free file sharing service.

Link to Live Website: https://fileshareapp20.herokuapp.com/

## Disclaimer

Any copyright Files uploaded will be users responsibility.

## Run Project Locally
```sh
# Please make sure to update the .env file before starting the project
# Execute the project using nodemon
npm run dev

#Excute the project without nodemon
npm run start
```
## Share Files Privately

If the user Signs Up for an account, the person who needs to download the file should also sign up in order to access the file.

## Please update the the env.example file with your credentials.

    Remove the .example extension to the file to create the .env file.
    DATABASE_URL=youre_DB_URL_from_MONOGO
    PORT = youre_PORT_number
    ACCESS_TOKEN_SECRET = scecretkeyhere
    ACCESS_TOKEN_LIFE = 2m
    REFRESH_TOKEN_SECRET =  scecretkeyhere
    REFRESH_TOKEN_LIFE = 2m
    SESSION_KEY = scecretkeyhere
    NODEMAILER_USER = smtp_username
    NODEMAILER_PASSWORD = smtp_password
    NODEMAILER_HOST = smtp_hostname
    EMAIL_HOSTNAME = domain_name

## How to use the API ?

### To Sign Up for Private account

    Example for download: localhost:1337/signUpAPI
    "email" should be provided as a JSON form in body in raw format
    "password" should be provided as a JSON form in body in raw format
    "confirmPassword" should be provided as a JSON form in body in raw format

![Alt Text](https://github.com/hookFang/File-API-Project/blob/master/API%20Photos/Login%20API.PNG)

### To Login to Private account

    Example for download: localhost:1337/loginAPI
    "email" should be provided as a JSON form in body in raw format
    "password" should be provided as a JSON form in body in raw format

![Alt Text](https://github.com/hookFang/File-API-Project/blob/master/API%20Photos/SignUpAPI.PNG)

### To Upload a file

    Example for Upload: localhost:1337/uploadAPI
    Also include a form in the API add a file with name "upload" and select the File
    If you need to sepicfy expiry time add a new field "urlExpiryTime" - specify hours.
    If no expiry time is specified by default it will be expiring after 1 hour.

![Alt Text](https://github.com/hookFang/File-API-Project/blob/master/API%20Photos/UploadAPIExample.PNG)

### To Share a Private File

    Example for download: localhost:1337/shareFileAPI/:fileCode/:emailID
    "fileCode" the shortcode which you recieved when you uploaded the file
    "emailID" the E-mail ID of the user to whom you would like to share the file with (The other user should have an account to access this).

![Alt Text](https://github.com/hookFang/File-API-Project/blob/master/API%20Photos/ShareFileAPI.PNG)

### To Download a file

    Example for download: localhost:1337/downloadAPI/shortCode
    "Shortcode" will be provided once the file is uploaded.

![Alt Text](https://github.com/hookFang/File-API-Project/blob/master/API%20Photos/DownloadAPIExample.PNG)

### To Delete a file

    Example for download: localhost:1337/deleteAPI/shortCode
    Replace shortcode with the value recived when you uploaded the file.

![Alt Text](https://github.com/hookFang/File-API-Project/blob/master/API%20Photos/DeleteAPIExample.PNG)

## CRON Job

A Cron Job runs every minute to delete expired files and data from MongoDB. This ensures that no files are left behind in the server after the expiry time.

## Future plans

Encrypt the uploaded files!
Use CDN ot Amazon S3 storage to upload files
