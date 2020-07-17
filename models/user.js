const validator = require('validator');
class Users {
    constructor() {
        //Logs all of the variables for the credentials
        this.users = [];
        this.errorMessages = [
            'Not all of the entries were filled out properly. Please fill out all of the entries',
            'The email has already been used. Please log in.',
            "Passwords don't match. Please make sure that the passwords match",
            "The password does not follow the requested format listed above. Please try again.",
            'The email is not in the correct format',
            'User not found. Please try again',
            'Unknown error occured. Please try again'
        ];
    }
    validateSignUpCredentials(credentials) {
        //Validates all of the credentials for the user
        const { name, email, password, repassword } = credentials;
        const allInputsFilledOut = Object.values(credentials).every(credential => credential.trim());
        const passwordsMatch = password === repassword;
        const correctEmailFormat = validator.isEmail(email);
        const correctPasswordSetUp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password) && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(repassword);
        const duplicateUserName = this.users.some(user => user.email === email);
        //If all of the credentials were in the correct format, then log that user in. Otherwise inform them the error
        return new Promise((resolve, reject) => {
            if(allInputsFilledOut && passwordsMatch && correctPasswordSetUp && correctEmailFormat && !duplicateUserName) {
                delete credentials['rePassword'];
                this.users.push(credentials);
                resolve();
            } 
            else if(!allInputsFilledOut) reject(this.errorMessages[0]);
            else if(duplicateUserName) reject(this.errorMessages[1]);
            else if(!passwordsMatch) reject(this.errorMessages[2]);
            else if(!correctPasswordSetUp) reject(this.errorMessages[3]);
            else if(!correctEmailFormat) reject(this.errorMessages[4]);
            reject(this.errorMessages[6]);
        });
    }
    findPassword(email) {
        //Finds the user in the list of arrays
        return new Promise((resolve, reject) => {
            let user = this.users.find(user => user['email'] === email);
            if(user) resolve(user['password']);
            reject(this.errorMessages[5]);
        });
    }
}
module.exports = new Users();