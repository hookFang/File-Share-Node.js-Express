# File-API-Share-Project

This a file sharing API application, Users can upload a file and it creates a random URL which they can share. 
It will allow anyone with this URL to download the uploaded file. No need to Sign Up, easy free file sharing service. 

Link to Live Website: https://fileshareapp20.herokuapp.com/ (Testing still in progress not yet complete)

## Disclaimer
Any copyright Files uploaded will the users responsibility.
Currently the Main Page after Sign Up Only Supports uploading a file and displaying it. You can also copy the LINK for download.
The EDIT and DELETE button aree still work in progress.

## Share Files Privately 
If the user Signs Up for an account, the person who needs to download the file should also sign up in order to access the file.

## Please update the the env.example file with your credentials.
	Remove the .example extension to the file to create the .env file.
	DATABASE_URL=youre_DB_URL_from_MONOGO
	PORT = youre_PORT_number
	
## How to use the API ?
### To Sign Up for  Private account
	Example for download: localhost:1337/signUpAPI
	"email" should be provided as a JSON form in body in raw format
	"password" should be provided as a JSON form in body in raw format
	"confirmPassword" should be provided as a JSON form in body in raw format
![Alt Text](https://github.com/hookFang/File-API-Project/blob/master/API%20Photos/Login%20API.PNG)
### To Login to  Private account
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
