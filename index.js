const inquirer = require('inquirer')

const { 
    checkUserExists, 
    authenticateUser, 
    createNewUser, 
    createNewRole, 
    getUserRoles, 
    printRoles, 
    editUserRole 
} = require('./utils')


//------- START -------//
console.log('Hi! Welcome to Role Based Access Control System')

const user_login = [
    {
        type: 'input',
        name: 'user_name',
        message: "Please provide username for login",
        validate(value){
            if(checkUserExists(value))  return true
            return 'User does not exist in system. Please re-enter!'
        }
    },
    {
        type: 'password',
        name: 'password',
        mask: '*',
        message: "Please provide your password"
    }
]

function main(){
    inquirer.prompt(user_login).then((user) => {
        // authenticate user:
        if(!authenticateUser(user.user_name, user.password)){
            console.log('Incorrect password. Please try again')
            main()
        }
        else{
            if(user.user_name == 'Admin'){
                console.log('You are logged in as Admin')
                const admin_actions = [
                    {
                        type: 'list',
                        name: 'action',
                        message: 'What would you like to do?',
                        choices: [
                            'Login as another user', 
                            'Create a new user',
                            'Edit role of a user',
                            'Sign out'
                        ]
                    }
                ]

                inquirer.prompt(admin_actions).then((response) => {
                    // console.log(`You have chosen to: "${response.action}"`)

                    if(response.action == 'Login as another user'){
                        main()
                    }
                    else if(response.action == 'Create a new user'){
                        const add_user = [
                            {
                                type: 'input',
                                name: 'new_user_name',
                                message: "Please provide username to create",
                                validate(value){
                                    if(!checkUserExists(value))  return true
                                    return 'User already exists in system. Please try another name'
                                }
                            },
                            {
                                type: 'password',
                                name: 'password',
                                message: "Please provide password for user",
                                mask: '*',
                                validate(value){
                                    if(true)  return true
                                    return 'Password should be atleast 8 digits & consisting of letters & numbers'
                                }
                            }
                        ]
                        inquirer.prompt(add_user).then((response) => {
                            const new_user = response.new_user_name
                            // create user in userList:
                            createNewUser(new_user, response.password)

                            var roles = {}
                            var user_access = [
                                {
                                    type: 'list',
                                    name: 'resource',
                                    message: "Please select a resource to grant access to:",
                                    choices: [
                                        'Server',
                                        'Database',
                                        'Dashboard'
                                    ]
                                },
                                {
                                    type: 'checkbox',
                                    name: 'permission',
                                    message: `Select access for this resource`,
                                    choices: [
                                        'Read', 
                                        'Write',
                                        'Delete'
                                    ]
                                },
                                {
                                    type: 'confirm',
                                    name: 'askAgain',
                                    message: 'Do you want to add more resources? (just hit enter for Yes)',
                                    default: true,
                                },
                            ]
                            
                            function ask() {
                                inquirer.prompt(user_access).then((response) => {
                                    roles[response.resource] = response.permission
                                    if (response.askAgain) {
                                        // remove resource from the list which has already been selected once
                                        user_access[0].choices = user_access[0].choices.filter(item => item!=response.resource)

                                        if(user_access[0].choices.length == 0){
                                            console.log('No more resources left')
                                            editUserRole(user, roles)
                                            printRoles(roles)
                                        }
                                        else
                                            ask();
                                    }
                                    else{
                                        // insert into our rolesList
                                        createNewRole(new_user, roles)
                                        console.log(`User ${new_user} creared successfully`)
                                        printRoles(roles)
                                    }
                                });
                            }
                            ask()
                        })
                    }
                    else if(response.action == 'Edit role of a user'){
                        const which_user = [
                            {
                                type: 'input',
                                name: 'user_name',
                                message: "Please provide username to create",
                                validate(value){
                                    if(checkUserExists(value))  return true
                                    return 'User with this name does not exist'
                                }
                            }
                        ]
                        inquirer.prompt(which_user).then((response) => {
                            const user = response.user_name
                            var roles = getUserRoles(user)      // can be used to indicate in the prompt what roles are already configured
                            printRoles(roles)

                            var user_access = [
                                {
                                    type: 'list',
                                    name: 'resource',
                                    message: "Please select a resource to grant access to:",
                                    choices: [
                                        'Server',
                                        'Database',
                                        'Dashboard'
                                    ]
                                },
                                {
                                    type: 'checkbox',
                                    name: 'permission',
                                    message: `Select access for this resource`,
                                    choices: [
                                        'Read', 
                                        'Write',
                                        'Delete'
                                    ]
                                },
                                {
                                    type: 'confirm',
                                    name: 'askAgain',
                                    message: 'Do you want to add more resources? (just hit enter for Yes)',
                                    default: true,
                                },
                            ]
                            
                            function ask() {
                                inquirer.prompt(user_access).then((response) => {
                                    roles[response.resource] = response.permission
                                    if (response.askAgain) {
                                        // remove resource from the list which has already been selected once
                                        user_access[0].choices = user_access[0].choices.filter(item => item!=response.resource)

                                        if(user_access[0].choices.length == 0){
                                            console.log('No more resources left')
                                            editUserRole(user, roles)
                                            printRoles(roles)
                                        }
                                        else
                                            ask();
                                    }
                                    else{
                                        // update rolesList
                                        editUserRole(user, roles)
                                        printRoles(roles)
                                    }
                                });
                            }
                            ask()
                        })
                    }
                    else if(response.action == 'Sign out'){
                        console.log('Signed out successfully')
                    }
                })
            }
            else{
                // non-admin users
                console.log(`You are logged in as ${user.user_name}`)
                const user_actions = [
                    {
                        type: 'list',
                        name: 'action',
                        message: 'What would you like to do?',
                        choices: [
                            'Login as another user', 
                            'View your roles',
                            'Check access to resource',
                            'Sign out'
                        ]
                    }
                ]
                inquirer.prompt(user_actions).then((response) => {
                    // console.log(`You have chosen to: "${response.action}"`)

                    if(response.action == 'Login as another user'){
                        main()
                    }
                    else if(response.action == 'View your roles'){
                        printRoles(getUserRoles(user.user_name))
                    }
                    else if(response.action == 'Check access to resource'){
                        const get_resource = [
                            {
                                type: 'checkbox',
                                name: 'resource',
                                message: 'Select resources for which you want to check access',
                                choices: [
                                    'Server', 
                                    'Database',
                                    'Dashboard'
                                ],
                                validate(value){
                                    if(value.length == 0){
                                        console.log('You must select atleast one resource')
                                        return false
                                    }
                                    return true
                                }
                            }
                        ]
                        inquirer.prompt(get_resource).then((response) => {
                            const roles = getUserRoles(user.user_name)
                            for(const item of response.resource){
                                if(roles[item] != undefined)
                                    console.log(`You have following access permissions for ${item}:`, ...roles[item])
                                else
                                    console.log(`You do not have permission to access ${item}`)
                            }
                        })
                    }
                    else if(response.action == 'Sign out'){
                        console.log('Signed out successfully')
                    }
                })
            }
        }
    });
}

main()