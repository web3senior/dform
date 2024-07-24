import { Suspense, useState, useEffect, useRef } from 'react'
import { Link, Form } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _, contract } from '../contexts/AuthContext'
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
    var month = date.getMonth()

    // Seconds part from the timestamp
    var day = date.getDay()

    // Hours part from the timestamp
    var hours = date.getHours()

    // Minutes part from the timestamp
    var minutes = '0' + date.getMinutes()

    // Seconds part from the timestamp
    var seconds = '0' + date.getSeconds()

    // Will display time in 10:30:23 format
    var formattedTime = `${day}/${month}/${fullyear} ` + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)

    console.log(formattedTime)
    return formattedTime
  }

  const handleRespond = (formId) => {
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
        <div className="grid grid--fit mb-20" style={{ '--data-width': `200px`, columnGap: `1rem` }}>
          <div className={`card`}>
            <div className={`card__body`}>
              <Form className="form">
                <div className={`d-flex flex-column`}>
                  <label htmlFor="">Start Date</label>
                  <input type={`date`} name={`startTime`} />
                </div>
                <div className={`d-flex flex-column`}>
                  <label htmlFor="">End Date</label>
                  <input type={`date`} name={`startTime`} />
                </div>
                <div className={`d-flex flex-column`}>
                  <label htmlFor="">Price (wei)</label>
                  <input type={`number`} name={`startTime`} />
                </div>
                <div className={`d-flex flex-column`}>
                  <label htmlFor="">Allowlist</label>
                  <textarea name="" id="" placeholder={`0x0, 0x1`}></textarea>
                </div>
                <div>
                  <button onClick={(e) => handlUpdateForm(e)}>Submit</button>
                </div>
              </Form>
            </div>
          </div>
        </div>

        <div className={`card mb-20`}>
          <div className={`card__body d-flex align-items-center justify-content-between`}>
            <select name="" id="">
              <option value="q">Question</option>
              <option value="">select</option>
              <option value="">choice</option>
            </select>
            <button>Add</button>
          </div>
        </div>

        {/* QuestionType */}
        <div className={`card form`}>
          <div className={`card__body d-f-c flex-column`}>
            <input type="text" name="" id="" placeholder={`Question`} />
            <input type="text" name="" id="" placeholder={`Hint`} />
            <select name="" id="">
              <option value="">Optional</option>
              <option value="">Requirement</option>
            </select>
          </div>
        </div>

        {/* SelectType */}
        <div className={`card form`}>
          <div className={`card__body d-f-c flex-column`}>
            <input type="text" name="" id="" placeholder={`Question`} />
            <input type="text" name="" id="" placeholder={`Hint`} />

            <textarea name="" id="" placeholder={`select1,select2,...`}></textarea>

            <select name="" id="">
              <option value="">Optional</option>
              <option value="">Requirement</option>
            </select>
          </div>
        </div>

        {/* ChoiceType */}
        <div className={`card form`}>
          <div className={`card__body d-f-c flex-column`}>
            <input type="text" name="" id="" placeholder={`Question`} />
            <input type="text" name="" id="" placeholder={`Hint`} />

            <textarea name="" id="" placeholder={`choice1,choice2,...`}></textarea>

            <select name="" id="">
              <option value="">Optional</option>
              <option value="">Requirement</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}
