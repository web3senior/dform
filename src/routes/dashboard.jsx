import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import Icon from './helper/MaterialIcon'
import styles from './Dashboard.module.scss'

export default function About({ title }) {
  Title(title)

  useEffect(() => {
    document.querySelector(`#pageTitle`).innerText = title
  }, [])

  return (
    <section className={styles.section}>
      <h3 id={`pageTitle`} />
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

        <h3 className={`mt-40`}>Claimed Transactions</h3>
        <div className={`card`}>
          <div className={`card__body`}>
            <span>alo</span>
            <span>200</span>
            <span>Buy</span>
            <span>140$</span>
            <span>Amir</span>
            <span>07/07/2024</span>
          </div>
        </div>
        <div className={`card`}>
          <span>alo</span>
          <span>200</span>
          <span>140$</span>
          <span>Amir</span>
          <span>07/07/2024</span>
        </div>
        <div className={`card`}>
          <span>alo</span>
          <span>200</span>
          <span>140$</span>
          <span>Amir</span>
          <span>07/07/2024</span>
        </div>

        <Link to={`d`}>View all</Link>
      </div>
    </section>
  )
}
