import React from 'react'
import { Link } from 'react-router-dom'
import Icon from './../helper/MaterialIcon'
import styles from './Expired.module.scss'

function Expired() {
  return (
    <section className={`${styles['page']} d-f-c`}>
      <div className={`${styles['page__container']} __container d-f-c flex-column`} data-width={`small`}>
        <div className={`${styles['page__icon']} d-f-c`}>
          <Icon name={`schedule`} />
        </div>
        <h1>Expired!</h1>
        <p>The form has now expired.</p>
        <Link to={`/`}>Back to home</Link>
      </div>
    </section>
  )
}

export default Expired
