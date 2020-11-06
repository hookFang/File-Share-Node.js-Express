# File-API-Share-Project

This a file sharing API application, Users can upload a file and it creates a random URL which they can share. 
It will allow anyone with this URL to download the uploaded file. No need to Sign Up, easy free file sharing service. 

## Share Files Privately 
If the user Signs Up for an account, the person who needs to download the file should also sign up in order to access the file.

## Please update the the env.example file with your credentials.
	Remove the .example extension to the file to create the .env file.
	DATABASE_URL=youre_DB_URL_from_MONOGO
	PORT = youre_PORT_number
	
## How to use the API ?
###	To Upload a file
	Example for Upload: localhost:1337/uploadAPI
	Also include a form in the API add a file with name "upload" and select the File
	If you need to sepicfy expiry time add a new field "urlExpiryTime" - specify hours.
	If no expiry time is specified by default it will be expiring after 1 hour.
### To Download a file
	Example for download: localhost:1337/downloadAPI/shortCode
	"Shortcode" will be provided once the file is uploaded.
### To Delete a file
	Example for download: localhost:1337/deleteAPI/shortCode
	Replace shortcode with the value recived when you uploaded the file.
