Developed this web-app as part of the Sabre India Bootcamp Demo Presentation 2022.

**Zeus Agent** is a Sticky Notes App meant to solve a hypothetical situation of Zeus Fly employees wanting to share time sensitive information with other employees and customers.

The various features it has include:

1. Login and Register with hashing of passwords for security.
2. Creating your sticky note with several options to stylize the text, attach images, and also set the expiry time.
3. Generate a public URL to be shared once the sticky note is generated.
4. View previously created notes that haven't expired yet.

**Tech Stack Used:**

1. HTML
2. CSS
3. JS
4. NodeJS
5. Express
6. MongoDB

MongoDB Atlas was used for a cloud based database environment, and the entire project was dockerized and deployed on GCP.

You can access the website at [Zeus Agent](https://zeus-agent-ob6jn6iixq-el.a.run.app/)

If the deployed application is unavailable/taken down, you can locally run the app following the below steps:

1. Clone the git repository onto your local system. Ensure you have node and npm installed.
2. Run the command `npm install` to download all the dependencies.
3. Change the DB_PASSWORD field in the index.js file to connect with your own database.
4. Run `npm run start` or `npm run dev` and the application should be good to go on localhost.
