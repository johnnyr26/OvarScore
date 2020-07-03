class Users {
    constructor() {
        //Logs all of the variables for the credentials
        this.signUpCredentials;
        {this.name, this.email, this.password, this.rePassword};
        this.users = [];
        this.errorMessages = [
            'Not all of the entries were filled out properly. Please fill out all of the entries',
            'Username has already signed up. Please log in.',
            "Passwords don't match. Please make sure that the passwords match",
            'Incorrect password. Please try again',
            'User not found. Please try again'
        ];
    }
    validateSignUpCredentials() {
        //Validates all of the credentials for the user
        ({name: this.name, email: this.email, password: this.password, rePassword: this.rePassword} = this.signUpCredentials);
        const allInputsFilledOut = Object.values(this.signUpCredentials).every(credential => credential.trim());
        const passwordsMatch = this.password === this.rePassword;
        const duplicateUserName = this.users.some(user => user.email === this.email);
        //If all of the credentials were in the correct format, then log that user in. Otherwise inform them the error
        return new Promise((resolve, reject) => {
            if(allInputsFilledOut && passwordsMatch && !duplicateUserName) {
                delete this.signUpCredentials['rePassword'];
                delete this.rePassword;
                this.users.push(this.signUpCredentials);
                resolve('Success');
            } 
            else if(!allInputsFilledOut) reject(this.errorMessages[0]);
            else if (duplicateUserName) reject(this.errorMessages[1]);
            reject(this.errorMessages[2]);
        });
    }
    logInUser(email, password) {
        //Finds the user in the list of arrays
        return new Promise((resolve, reject) => {
            let user = this.users.find(user => user['email'] === email && user['password'] === password);
            if(user) resolve();
            else {
                if(this.users.find(user => user['email'] === email)) reject(this.errorMessages[3]);
                else reject(this.errorMessages[4]);
            }
        });
    }
}
module.exports = new Users();