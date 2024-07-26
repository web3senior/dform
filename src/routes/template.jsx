import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import Icon from './helper/MaterialIcon'
import styles from './Dashboard.module.scss'

export default function About({ title }) {
  Title(title)
  const [totalForm, setTotalForm] = useState(0)
  const [totalRespond, setTotalRespond] = useState(0)
  const [fee, setFee] = useState(0)

  const getTotalForm = async () => await contract.methods._formCounter().call()
  const getTotalRespond = async () => await contract.methods._respondCounter().call()
  const getFee = async () => await contract.methods.fee().call()

  useEffect(() => {
    getTotalForm().then((res) => {
      setTotalForm(_.toNumber(res))
      setIsLoading(false)
    })

    getTotalRespond().then((res) => {
      setTotalRespond(_.toNumber(res))
      setIsLoading(false)
    })

    getFee().then((res) => {
      setFee(_.fromWei(res, `ether`))
      setIsLoading(false)
    })
  }, [])

  return (
    <section className={styles.section}>
      <h3 id={`pageTitle`} />
      <div className={`${styles['container']} __container ms-motion-slideUpIn`} data-width={`medium`}>
        <h3 className={`mt-40`}>Coming soon</h3>
      </div>
    </section>
  )
}
