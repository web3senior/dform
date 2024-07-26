import { Suspense, useState, useEffect, useRef } from 'react'
import { Link, Form } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _, contract } from '../contexts/AuthContext'
import Icon from './helper/MaterialIcon'
import styles from './Dashboard.module.scss'

export default function About({ title }) {
  Title(title)
  const [form, setForm] = useState()
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

  const handleAddNew = (type) => {
    let newItem
    switch (type) {
      case `question`:
        newItem = {
          type: 'question',
          q: '',
          hint: '',
          optional: true,
        }
        break
      case `select`:
        newItem = {
          type: 'select',
          q: '',
          hint: '',
          select: `select1,select2`,
          optional: true,
        }
        break
      case `choice`:
        newItem = {
          type: 'choice',
          q: '',
          hint: '',
          choice: `choice1,choice2`,
          optional: true,
        }
        break

      default:
        break
    }

    const newItems = form.list.concat(newItem)
    setForm({ list: newItems })
    localStorage.setItem(`newForm`, JSON.stringify({ list: [...newItems] }))
    toast.success(`New question has been added`)
  }

  const handleRemove = (e, i) => {
    const newItems = form.list.filter((item) => item !== null)
    delete newItems[i]
    console.log(newItems)
    setForm({ list: newItems })
    localStorage.setItem(`newForm`, JSON.stringify({ list: newItems }))
  }

  const handleChangeValue = (field, e, i) => {
    console.log(form)
    const newItems = form.list.filter((item) => item !== null).filter((filterItem, filterIndex) => filterIndex === i)
newItems[0][`${field}`] =e.target.value
    setForm({ list: newItems })
    localStorage.setItem(`newForm`, JSON.stringify({ list: newItems }))
  }
  useEffect(() => {
    getTimestamp().then((res) => setTimestamp(res))
    console.log(JSON.parse(localStorage.getItem(`newForm`)))
    setForm(JSON.parse(localStorage.getItem(`newForm`)))

    // getRespondList(item.id).then((respond) => {
    //   console.log(respond)
    //   res[i].totalRespond = respond.length
    // })
  }, [])

  return (
    <section className={styles.section}>
      <div className={`${styles['container']} __container ms-motion-slideUpIn`} data-width={`medium`}>
        <div className={`card mb-20`}>
          <div className={`card__body d-flex align-items-center justify-content-between`}>
            <select name="" id={`questionType`}>
              <option value="question">Question</option>
              <option value="select">Select</option>
              <option value="choice">Choice</option>
            </select>
            <button onClick={() => handleAddNew(document.querySelector(`#questionType`).value)}>Add</button>
          </div>
        </div>

        {form &&
          form.list &&
          form.list.length > 0 &&
          form.list
            .filter((item) => item !== null)
            .reverse()
            .map((item, i) => {
              if (item === null) return
              return (
                <div key={i} className={`card form mt-20`}>
                  <div className={`card__body d-f-c flex-column`} style={{ rowGap: '.5rem' }}>
                    <div className={`d-flex align-items-center w-100`} style={{ columnGap: '1.5rem' }}>
                      <span>{i + 1})</span>
                      <div className={`d-flex flex-column w-100`} style={{ rowGap: '.5rem' }}>
                        <input type="text" name="" id="" placeholder={`Question`} defaultValue={item.q} onChange={(e) => handleChangeValue(`question`,e, i)} />
                        <input type="text" name="" id="" placeholder={`Hint`} defaultValue={item.hint} onChange={(e) => handleChangeValue(`hint`, e, i)} />

                        {item.type === 'select' && <textarea name="" id="" placeholder={`select1,select2,...`} defaultValue={item.select} onChange={(e) => handleChangeValue(`select`,e, i)}></textarea>}
                        {item.type === 'choice' && <textarea name="" id="" placeholder={`choice1,choice2,...`} defaultValue={item.choice} onChange={(e) => handleChangeValue(`choice`,e, i)}></textarea>}

                        <select name="" id="" defaultValue={item.optional} onChange={(e) => handleChangeValue(`optional`, e, i)}>
                          <option value={true}>Optional</option>
                          <option value={false}>Requirement</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={(e) => handleRemove(e, i)}>Remove</button>
                  </div>
                </div>
              )
            })}

        <button onClick={() => console.log(form)}>Log Form</button>

        <div className="grid grid--fit mt-40" style={{ '--data-width': `200px`, columnGap: `1rem` }}>
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
      </div>
    </section>
  )
}
