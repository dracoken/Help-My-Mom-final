## Help My Mom

This website is intended to help Sons and Daughters outsource tech support.

How To Run
1) set up your localhost database manager to run with MySql. If you don't know how to do this, Download and install the XAMMP Control Panel app. It was the application that the dev team used to handle this process for us. https://www.apachefriends.org/download.html
2) type "npm I or npm install" into the terminal to download all the dependencies within side this node project
3) start your database to listen for a port. If you're using XAMMP, you can do this by opening the app and clicking the start button on the column that says MySQL.
4) type "npx prisma db push" (for first use only) into the terminal to cause the PrismaDB framework to convert the Prisma schema into MySQL and perform a migration into your server's Database.
5) type "npm run dev" into the terminal to start/launch the application locally.
6) Lastly, to interact with the website, type "http://localhost:3000/" into your browser, and you're good to go.

Optional Info/commands
~"npx prisma studio" - lets you see the records of your database.
~"npx prisma db push --force-reset" - forces a migration to your MySQL server (note you will lose all current data within side the database)

   
