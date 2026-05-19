import { useState, useCallback } from 'react';
import { paymentsApi, CreatePaymentRequest, PaymentResponse } from '@/data/api/payments';

export function usePayments() {
    const [isCreatingPayment, setIsCreatingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const createPayment = useCallback(async (data: CreatePaymentRequest) => {
        setIsCreatingPayment(true);
        setPaymentError(null);
        try {
            const response = await paymentsApi.createPayment(data);
            return response.data as PaymentResponse;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error creating payment';
            setPaymentError(errorMessage);
            console.error('Create payment error:', err);
            throw err;
        } finally {
            setIsCreatingPayment(false);
        }
    }, []);

    return {
        isCreatingPayment,
        paymentError,
        createPayment,
    };
}
