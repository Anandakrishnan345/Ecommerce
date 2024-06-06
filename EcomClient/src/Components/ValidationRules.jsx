function validateEmail(email) {
    if (!email.trim()) {
        return 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        return 'Invalid email address';
    }
    return '';
}

function validatePassword(password) {
    if (!password.trim()) {
        return 'Password is required';
    } else if (password.length < 6) {
        return 'Password must be at least 6 characters';
    }
    return '';
}

// function validatePhoneNumber(phoneNumber) {
//     if (!phoneNumber.trim()) {
//         return 'Phone number is required';
//     } else if (!/^\d{10}$/.test(phoneNumber)) {
//         return 'Invalid phone number';
//     }
//     return '';
// }

// function validateAddress(address) {
//     if (!address.trim()) {
//         return 'Address is required';
//     }
//     return '';
// }

// function validatePincode(pincode) {
//     if (!pincode.trim()) {
//         return 'Pincode is required';
//     } else if (!/^\d{6}$/.test(pincode)) {
//         return 'Invalid pincode';
//     }
//     return '';
// }

export { 
    validateEmail, 
    validatePassword, 
    // validatePhoneNumber, 
    // validateAddress, 
    // validatePincode 
};
