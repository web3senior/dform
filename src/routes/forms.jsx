import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _, contract } from './../contexts/AuthContext'
import Icon from './helper/MaterialIcon'
import styles from './Dashboard.module.scss'

export default function About({ title }) {
  Title(title)
  const auth = useAuth()

  const handlUpdateForm = async (e) => {
    const t = toast.loading(`Waiting for transaction's confirmation`)

    try {
      contract.methods
        .updateForm(web3.utils.padLeft(`0x1`, 64), 'QmW7CNGVEDscVJALD1Cn3nA5tW5ocTikJkkh5LAYYNbwcw', _.toWei(`0`, `ether`), [], false)
        .send({
          from: auth.wallet,
        })
        .then((res) => {
          console.log(res)
          toast.dismiss(t)
        })
        .catch((error) => {
          console.error(error)
          toast.dismiss(t)
        })
    } catch (error) {
      console.error(error)
      toast.dismiss(t)
    }
  }

  useEffect(() => {}, [])

  return (
    <section className={styles.section}>
      <div className={`${styles['container']} __container ms-motion-slideUpIn`} data-width={`xxlarge`}>
        <div className="grid grid--fit" style={{ '--data-width': `200px`, columnGap: `1rem` }}>
          <div className={`card`}>
            <div className={`card__body d-flex align-items-center justify-content-between`}>
              <div>
                <span>Total gift card</span>
                <h1>400</h1>
              </div>
              <div className={`${styles['card-icon']}`}>
                <Icon name={`loyalty`} />
              </div>
            </div>
          </div>
          <div className={`card`}>
            <div className={`card__body d-flex align-items-center justify-content-between`}>
              <div>
                <span>Total claimed</span>
                <h1>1</h1>
              </div>
              <div className={`${styles['card-icon']}`}>
                <Icon name={`storefront`} />
              </div>
            </div>
          </div>
        </div>

        <h3 className={`mt-40`}>My forms</h3>
        <div className={`card`}>
          <div className={`card__body`}>
            update form
            <button onClick={(e) => handlUpdateForm(e)}>update</button>
          </div>
        </div>

        <Link to={`d`}>View all</Link>
      </div>
    </section>
  )
}
