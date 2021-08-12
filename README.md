Entities:
* USER         - Admin, User1 (initial state)
* ACTION TYPE  - READ, WRITE, DELETE
* RESOUCRE     - Server, Database, Dashboard
* ROLE         - E.g.: Admin - { Server: [READ, WRITE, DELETE], Database: [READ, WRITE, DELETE], Dashboard: [READ, WRITE, DELETE]}, User1 - { Server: [READ, WRITE], Database: [READ], Dashboard: []}

Assumptions:
* Role specifies which resource a user can interact with & at what level (action types)