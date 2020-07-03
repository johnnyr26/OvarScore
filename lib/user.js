'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Users = function () {
    function Users() {
        _classCallCheck(this, Users);

        //Logs all of the variables for the credentials
        this.signUpCredentials;
        {
            this.name, this.email, this.password, this.rePassword;
        };
        this.users = [];
        this.errorMessages = ['Not all of the entries were filled out properly. Please fill out all of the entries', 'Username has already signed up. Please log in.', "Passwords don't match. Please make sure that the passwords match", 'Incorrect password. Please try again', 'User not found. Please try again'];
    }

    _createClass(Users, [{
        key: 'validateSignUpCredentials',
        value: function validateSignUpCredentials() {
            var _this = this;

            var _signUpCredentials = this.signUpCredentials;
            //Validates all of the credentials for the user

            this.name = _signUpCredentials.name;
            this.email = _signUpCredentials.email;
            this.password = _signUpCredentials.password;
            this.rePassword = _signUpCredentials.rePassword;

            var allInputsFilledOut = Object.values(this.signUpCredentials).every(function (credential) {
                return credential.trim();
            });
            var passwordsMatch = this.password === this.rePassword;
            var duplicateUserName = this.users.some(function (user) {
                return user.email === _this.email;
            });
            //If all of the credentials were in the correct format, then log that user in. Otherwise inform them the error
            return new Promise(function (resolve, reject) {
                if (allInputsFilledOut && passwordsMatch && !duplicateUserName) {
                    delete _this.signUpCredentials['rePassword'];
                    delete _this.rePassword;
                    _this.users.push(_this.signUpCredentials);
                    resolve('Success');
                } else if (!allInputsFilledOut) reject(_this.errorMessages[0]);else if (duplicateUserName) reject(_this.errorMessages[1]);
                reject(_this.errorMessages[2]);
            });
        }
    }, {
        key: 'logInUser',
        value: function logInUser(email, password) {
            var _this2 = this;

            //Finds the user in the list of arrays
            return new Promise(function (resolve, reject) {
                var user = _this2.users.find(function (user) {
                    return user['email'] === email && user['password'] === password;
                });
                if (user) resolve();else {
                    if (_this2.users.find(function (user) {
                        return user['email'] === email;
                    })) reject(_this2.errorMessages[3]);else reject(_this2.errorMessages[4]);
                }
            });
        }
    }]);

    return Users;
}();

module.exports = new Users();