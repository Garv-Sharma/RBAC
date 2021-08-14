ABOUT:
* Problem Statement: https://github.com/bluestacks/backend-developer-assignment
* This is a basic command-line based implementation of a Role Based Access System which is a security mechanism used to restrict access to any authorized system. It involves creating user roles & assigning them different access permissions/levels to resources of a system. This protects sensitive data & ensures only designated employees/customers can access the specificed resources.

Entities:
* USER         - Admin, User1 (initial state)
* ACTION TYPE  - READ, WRITE, DELETE
* RESOUCRE     - Server, Database, Dashboard
* ROLE         - Admin - { Server: [READ, WRITE, DELETE], Database: [READ, WRITE, DELETE], Dashboard: [READ, WRITE, DELETE]}, User1 - { Server: [READ, WRITE], Database: [READ], Dashboard: []}

Assumptions:
* Role specifies which resource a user can interact with & at what level (action types)
* For real-life applications, user credentials & role details should be kept in a safe location in a database. For the purpose of this assignment, 'userList.json' & 'rolesList.json' files have been used respectively to simulate a document based NoSQL database.
* For production applications, passwords should be hashed & stored using a secure library like 'crypto'

External/third-party packages used: 
* inquirer.js (https://www.npmjs.com/package/inquirer)

How to run the application:
* Ensure NodeJS is installed in system
* Clone the code repository into a project folder
* Open a terminal at the project folder
* Run: "npm install" to install dependencies
* Run: "node index.js" 
* Follow the instructions in terminal & use arrow keys, enter to interact with the application