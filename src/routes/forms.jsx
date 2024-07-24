import { Suspense, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _, contract } from './../contexts/AuthContext'
import Icon from './helper/MaterialIcon'
import styles from './Dashboard.module.scss'

export default function About({ title }) {
  Title(title)
  const [form, setForm] = useState([])
  const [respond, setRespond] = useState([])
  const [timestamp, setTimestamp] = useState(0)
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

  const getFormList = async (sender) => await contract.methods.formList(sender).call()
  const getTimestamp = async () => await contract.methods.timestamp().call()
  const getRespondList = async (formId) => await contract.methods.respondList(formId).call()
  const converTimestamp = (unix_timestamp) => {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds
    var date = new Date(unix_timestamp * 1000)

    // Hours part from the timestamp
    var fullyear = date.getFullYear()

    // Minutes part from the timestamp
    var month =date.getMonth()

    // Seconds part from the timestamp
    var day = date.getDay()
    
    // Hours part from the timestamp
    var hours = date.getHours()

    // Minutes part from the timestamp
    var minutes = '0' + date.getMinutes()

    // Seconds part from the timestamp
    var seconds = '0' + date.getSeconds()

    // Will display time in 10:30:23 format
    var formattedTime =`${day}/${month}/${fullyear} `+ hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)

    console.log(formattedTime)
    return formattedTime
  }

  const handleRespond = (formId)=>{
    getRespondList(formId).then((res) => {
      setRespond(res)
      console.log(res)
    })
  }
  useEffect(() => {
    getTimestamp().then((res) => setTimestamp(res))

    getFormList(auth.wallet).then((res) => {
      console.log(res)
      setForm(res)
    })

    // getRespondList(item.id).then((respond) => {
    //   console.log(respond)
    //   res[i].totalRespond = respond.length
    // })
  }, [])

  return (
    <section className={styles.section}>
      <div className={`${styles['container']} __container ms-motion-slideUpIn`} data-width={`medium`}>
        <div className="grid grid--fit" style={{ '--data-width': `200px`, columnGap: `1rem` }}>
          <div className={`card`}>
            <div className={`card__body d-flex align-items-center justify-content-between`}>
              <div>
                <span>Total open form</span>
                <h1>{form.filter((item) => item.endTime > timestamp).length}</h1>
              </div>
              <div className={`${styles['card-icon']}`}>
                <Icon name={`list_alt`} />
              </div>
            </div>
          </div>
          <div className={`card`}>
            <div className={`card__body d-flex align-items-center justify-content-between`}>
              <div>
                <span>Total archived respond</span>
                <h1>{form.filter((item) => item.endTime < timestamp).length}</h1>
              </div>
              <div className={`${styles['card-icon']}`}>
                <Icon name={`mark_chat_read`} />
              </div>
            </div>
          </div>
        </div>

        <h3 className={`mt-40`}>My forms</h3>
        {form &&
          form.map((item, i) => {
            return (
              <div key={i} className={`card`}>
                <div className={`card__body`}>
                  <ul>
                    <li>
                      <p>Start: {converTimestamp(_.toNumber(item.startTime))}</p>
                    </li>
                    <li>
                      <p>End: {converTimestamp(_.toNumber(item.endTime))}</p>
                    </li>
                    <li>
                      <p>Price: {_.fromWei(item.price, `ether`)}</p>
                    </li>
                    <li>
                      <p>Create at: {converTimestamp(_.toNumber(item.dt))}</p>
                    </li>
                    <li>
                      <p>Allowlist: {...item.allowlist}</p>
                    </li>
                  </ul>
                  <button onClick={(e) => handlUpdateForm(e)}>update</button>
                  <button onClick={(e) => handleRespond(item.id)}>responds</button>
                </div>
              </div>
            )
          })}

        <Link to={`d`}>View all</Link>
      </div>
    </section>
  )
}
