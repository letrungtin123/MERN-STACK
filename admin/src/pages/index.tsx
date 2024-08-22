import useCounter from '@/contexts/counter-context'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

const HomePage = () => {
  // useContext là gì? Tại sao phải sử dụng nó?
  // useContext giúp chúng ta truy cập vào các giá trị của context mà không cần sử dụng Provider
  const { counter, handleDecrement, handleIncrement } = useCounter()
  const { t } = useTranslation()

  return (
    <div>
      HomePage
      <p className='px-10'>Counter: {counter}</p>
      <p>{t('title')}</p>
      <Button onClick={() => handleIncrement()}>Increament</Button>
      <Button onClick={() => handleDecrement()}>Decreament</Button>
    </div>
  )
}

export default HomePage
