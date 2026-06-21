import { MetaCollection, MetaPaginationLinks } from "@/contracts/models/user.interface";
import { axiosInstance } from "./axios.instance";

export interface PaymentResponse {
    message: string,
    payment_url?: string
}

export interface CreatePaymentRequest {
    bookingId: number,
    paymentMethod: string,
    platform: 'native' | 'web',
}


export const paymentsApi = {
    createPayment: (data: CreatePaymentRequest) => axiosInstance.post<PaymentResponse>('/api/v1/payments/create-payment-intent', {
        booking_id:     data.bookingId,
        payment_method: data.paymentMethod,
        platform:       data.platform,
    })
}
