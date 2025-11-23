export interface MaidAddressDto {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface MaidDto {
    id: number;
    fullName: string;
    isAvailable: boolean;
    email: string;
    phone: string;
    experience: string;
    address: MaidAddressDto;
}
