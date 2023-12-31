import cn from 'clsx'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import s from './CartSidebarView.module.css'
import CartItem from '../CartItem'
import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import { Bag, Cross, Check } from '@components/icons'
import allData from '@framework/data.json'
import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/product/use-price'
import SidebarLayout from '@components/common/SidebarLayout'
import useRemoveItem from '@framework/cart/use-remove-item'
import { useCart as useCustomCart } from '@components/cartContext'

const CartSidebarView: FC = () => {
  const { closeSidebar, setSidebarView } = useUI()
  const { isLoading, isEmpty } = useCart()
  const { cartInfo, setCartInfo } = useCustomCart()
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const removeItem = useRemoveItem()

  const handleClose = () => closeSidebar()
  const goToCheckout = () => setSidebarView('CHECKOUT_VIEW')

  const error = null
  const success = null

  useEffect(() => {
    let cartItem = localStorage.getItem('cart') ?? '[]'
    cartItem = JSON.parse(cartItem)
    setCartInfo(cartItem as any)
    let cartItemId: any[] = []
    if (Array.isArray(cartItem)) {
      cartItemId = cartItem.map((item) => item.id)
      let cartProduct = allData.products.filter((items: any) => {
        return cartItemId.includes(items.id)
      })
      setData([...cartProduct])
    }
  }, [])

  useEffect(() => {
    let cartTotal = 0
    if (cartInfo.length > 0) {
      for (let i = 0; i < cartInfo.length; i++) {
        cartTotal += cartInfo[i].total
      }
    }
    setTotal(cartTotal)
  }, [cartInfo])

  return (
    <SidebarLayout
      className={cn({
        [s.empty]: error || success || isLoading || isEmpty,
      })}
      handleClose={handleClose}
    >
      {isLoading || data.length <= 0 ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-dashed border-primary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-secondary text-secondary">
            <Bag className="absolute" />
          </span>
          <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
            Your cart is empty
          </h2>
          <p className="text-accent-3 px-10 text-center pt-2">
            Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
          </p>
        </div>
      ) : error ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
            <Cross width={24} height={24} />
          </span>
          <h2 className="pt-6 text-xl font-light text-center">
            We couldn’t process the purchase. Please check your card information
            and try again.
          </h2>
        </div>
      ) : success ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
            <Check />
          </span>
          <h2 className="pt-6 text-xl font-light text-center">
            Thank you for your order.
          </h2>
        </div>
      ) : (
        <>
          <div className="px-4 sm:px-6 flex-1">
            <Link href="/cart">
              <a>
                <Text variant="sectionHeading" onClick={handleClose}>
                  My Cart
                </Text>
              </a>
            </Link>
            <ul className={s.lineItemsList}>
              {data!.map((item: any) => (
                <CartItem key={item.id} item={item} currencyCode={'USD'} />
              ))}
            </ul>
          </div>

          <div className="flex-shrink-0 px-6 py-6 sm:px-6 sticky z-20 bottom-0 w-full right-0 left-0 bg-accent-0 border-t text-sm">
            <ul className="pb-2">
              <li className="flex justify-between py-1">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </li>
              <li className="flex justify-between py-1">
                <span>Shipping</span>
                <span className="font-bold tracking-wide">FREE</span>
              </li>
            </ul>
            <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-2">
              <span>Total</span>
              <span>{total} USD</span>
            </div>
            <div>
              {process.env.COMMERCE_CUSTOMCHECKOUT_ENABLED ? (
                <Button Component="a" width="100%" onClick={goToCheckout}>
                  Proceed to Checkout ({})
                </Button>
              ) : (
                <Button href="/checkout" Component="a" width="100%">
                  Proceed to Checkout
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </SidebarLayout>
  )
}

export default CartSidebarView
