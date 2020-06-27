class Users {
    constructor(name, email, password, rePassword) {
        //Logs all of the variables for the credentials
        this.name = name;
        this.email = email;
        this.password = password;
        this.rePassword = rePassword;
        this.signUpCredentials = [];
        this.logInCredentials = [this.email, this.password];
        this.users = [];
        this.errorMessages = [
            'Not all of the entries were fileed out properly. Please fill out all of the entries',
            'Username has already signed up. Please log in.',
            "Passwords don't match. Please make sure that the passwords do match",
            'User not found. Please try again'
        ];
    }
    validateSignUpCredentials() {
        //Validates all of the credentials for the user
        this.signUpCredentials = [this.name, this.email, this.password, this.rePassword];
        const allInputsFilledOut = this.signUpCredentials.every(credential => credential.trim());
        const passwordsMatch = this.password === this.rePassword;
        const duplicateUserName = this.users.some(user => user.email == this.email);
        //If all of the credentials were in the correct format, then log that user in. Otherwise inform them the error
        if(allInputsFilledOut && passwordsMatch && !duplicateUserName) return this.users.push({name: this.name, email: this.email, password: this.password});
        else if(!allInputsFilledOut) return this.errorMessages[0];
        else if (duplicateUserName) return this.errorMessages[1];
        else return this.errorMessages[2];
    }
    logInUser(email, password) {
        //Finds the user in the list of arrays
        let user = this.users.find(user => user['email'] === email && user['password'] === password);
        return user ? user['loggedIn'] = true : this.errorMessages[3];
    }
    checkUser(email) {
        //Checks to see if the user is logged in
        return this.users.some(user => user['email'] == email && user['loggedIn']);
    }
}
module.exports = new Users();