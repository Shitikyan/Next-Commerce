import type { GetStaticPropsContext } from 'next'
import useCustomer from '@framework/customer/use-customer'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import CheckoutForm from '@components/checkout/Stripe'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentElement,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise

  return {
    props: { pages, categories },
  }
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? ''
)

export default function Checkout() {
  const { data } = useCustomer()
  return (
    <Container className="pt-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Secure Payment
      </h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </Container>
  )
}

Checkout.Layout = Layout
