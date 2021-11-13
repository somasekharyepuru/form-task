export interface User {
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    dateOfBirth: string;
    password: string;
    address: UserAddress
}

export interface UserAddress {
    country: string;
    city: string;
    state: string;
}