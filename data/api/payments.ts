import { MetaCollection, MetaPaginationLinks } from "@/contracts/models/user.interface";
import { axiosInstance } from "./axios.instance";

export interface PaymentResponse {
    message: string,
    payment_url?: string
}

export interface CreatePaymentRequest {
    bookingId: string,
    paymentMethod: string,
}


export const paymentsApi = {
    createPayment: (data: CreatePaymentRequest) => axiosInstance.post('/api/v1/payments/create-payment', {
        ...data,
        booking_id: data.bookingId,
        payment_method: data.paymentMethod,
    })
}
