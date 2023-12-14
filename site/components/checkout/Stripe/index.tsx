import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { ToastContainer, toast } from 'react-toastify'
import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { setModalView, closeModal } = useUI()
  const [cardNumberError, setCardNumberError] = useState()
  const [cardExpiryError, setCardExpiryError] = useState()
  const [cardCvcError, setCardCvcError] = useState()

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardNumber = elements.getElement(CardNumberElement)
    const cardExpiry = elements.getElement(CardExpiryElement)
    const cardCvc = elements.getElement(CardCvcElement)

    if (cardExpiryError || cardCvcError || cardNumberError) {
      handleError('Credit card processing error occurred')
    } else {
      handleSuccess()
    }
  }

  const handleSuccess = () => {
    toast.success('Payment successful!', {
      position: 'top-center',
      autoClose: 5000,
    })
  }

  const handleError = (errorMessage: string) => {
    toast.error(`Payment failed: ${errorMessage}`, {
      position: 'top-center',
      autoClose: 5000,
    })
  }

  const handleCardNumber = (value: any) => {
    if (value.error) {
      setCardNumberError(value.error.code)
    } else {
      setCardNumberError(undefined)
    }
  }

  const handleCardExpiry = (value: any) => {
    if (value.error) {
      setCardExpiryError(value.error.code)
    } else {
      setCardExpiryError(undefined)
    }
  }

  const handleCardCvc = (value: any) => {
    if (value.error) {
      setCardCvcError(value.error.code)
    } else {
      setCardCvcError(undefined)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-600 rounded shadow-md"
    >
      <Text className="block text-sm font-medium text-gray-700 mb-2">
        Card Information
      </Text>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Text className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </Text>
          <CardNumberElement id="cardNumber" onChange={handleCardNumber} />
        </div>
        <div>
          <Text className="block text-sm font-medium text-gray-700 mb-2">
            Expiration Date
          </Text>
          <CardExpiryElement id="cardExpiry" onChange={handleCardExpiry} />
        </div>
        <div>
          <Text className="block text-sm font-medium text-gray-700 mb-2">
            CVC
          </Text>
          <CardCvcElement id="cardCvc" onChange={handleCardCvc} />
        </div>
      </div>
      <Button
        type="submit"
        disabled={!stripe}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
      >
        Pay Now
      </Button>
      <ToastContainer />
    </form>
  )
}

export default CheckoutForm
