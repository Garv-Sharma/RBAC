/**
 * Helper file to perform authentication as well as access & modify files/database (implements abstraction)
 */
var fs = require('fs')

function loadUserList(){
    try{
        const data = fs.readFileSync('userList.json', 'utf8')
        return JSON.parse(data)
    }
    catch{
        return []
    }
}

function getUser(name){
    const userList = loadUserList()
    let foundUser
    for(const user of userList){
        if(user.username == name){
            foundUser = user
            break
        }
    }
    return foundUser
}

function checkUserExists(name){
    const user = getUser(name)
    return user != undefined
}

function authenticateUser(name, password){
    const user = getUser(name)
    return user["password"] == password
}

function saveUserList(list){
    const newList = JSON.stringify(list)
    fs.writeFileSync('userList.json', newList)
}

function createNewUser(name, password){
    // we have already checked for duplicate user in the prompt
    const users = loadUserList()
    users.push({
        "username": name,
        "password": password
    })
    saveUserList(users)
}

function loadRolesList(){
    try{
        const data = fs.readFileSync('rolesList.json', 'utf8')
        return JSON.parse(data)
    }
    catch{
        return []
    }
}

function saveRoleList(list){
    const newList = JSON.stringify(list)
    fs.writeFileSync('rolesList.json', newList)
}

function createNewRole(username, access){
    // we have already checked that a user with username does not exist in list
    const list = loadRolesList()
    list.push({
        "username": username,
        "permissions": access
    })
    saveRoleList(list)
}

function getUserRoles(name){
    const users = loadRolesList()
    let userRoles = {}
    if(users.length > 0){
        for(const user of users){
            if(user.username == name){
                userRoles = user.permissions
                break
            }
        }
    }
    return userRoles
}

function printRoles(roles){
    console.log(`The current roles assigned are:`)
    if(Object.keys(roles).length == 0){
        console.log('There are no roles assigned to you!')
        return
    }
    for(const resource of Object.keys(roles)){
        console.log(`${resource}:`)
        for(const permission of roles[resource]){
            console.log(`\t${permission}`)
        }
    }
}

function editUserRole(user, role){
    let roles = loadRolesList()
    let index = 0
    for(const item of roles){
        if(item.username == user){
            break
        }
        index++
    }
    roles[index] = {
        "username": user,
        "permissions": role
    }
    saveRoleList(roles)
}

module.exports = {
    checkUserExists,
    authenticateUser,
    createNewUser,
    createNewRole,
    getUserRoles,
    printRoles,
    editUserRole
}