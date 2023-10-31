# Animal Adoption Dating App - Pawfect Match
Hosted website:
https://www.pawfectmatcheroo.com  

Login Credentials:  
Regular user: wallace@cheese.com  
Regular password: Welcome123$  
  
Admin user: admin@cheese.com  
Admin password: Welcome123$  
## INSTALLATION
 
This application is hosted on Google Cloud through the website above. A regular and admin user has been set up for guest access to explore the application. In order to set up the application to run locally the following steps can be done. Note: There is a dependency on having Google Datastore configured along with gcloud CLI at minimum to run this project locally.

1.	Clone repository.
2.	Run “npm install” within each folder (animal-ui and animal-api).
3.	Follow instructions to setup gcloud CLI (https://cloud.google.com/sdk/docs/install).
4.	Configure a project on Google Cloud and allow access to API and Google Datastore.
5.	Use “gcloud config set” and assign your Google Cloud project with the Datastore to your local installation.
a.	Repeat this step in both animal-ui and animal-api folders.
6.	In animal-api startup the server with the command “npm start.”
7.	In the animal-ui folder navigate to the vite.config.ts file and comment out the “https: true” code.
8.	In the animal-ui folder build the application with “npm run build.”
9.	In the animal-ui folder start the application with “npm run preview” which will start the application on http://localhost:4173 by default.
