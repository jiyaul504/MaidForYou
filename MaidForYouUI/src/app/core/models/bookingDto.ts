export interface BookingDto {
    id: number;
    maidId: number;
    customerId: number;
    customerName: string;
    maidName: string;
    bookingDate: string;
    serviceType: string;
    status: string;
}