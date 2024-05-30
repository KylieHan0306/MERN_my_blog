function validPassword(password) {
    const minLength = 8; 
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (password.length < minLength) {
        return false;
    }

    return regex.test(password);
}

function validUsername(username) {
    const maxLength = 20;
    const regex = /^[a-zA-Z0-9_]+$/;

    if (username.length > maxLength || username.length === 0) {
        return false;
    }
    return regex.test(username);
}

function validEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = {
    validPassword,
    validUsername,
    validEmail
}
