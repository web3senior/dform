import { Suspense, useState, useEffect, useRef } from 'react'
import { useLoaderData, defer, Form, Await, useRouteError, Link, useNavigate, useParams } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'

import MaterialIcon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import Loading from './components/Loading'
import Expired from './components/Expired'
import { getTournamentList } from '../util/api'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _, contract } from '../contexts/AuthContext'
import ABI from '../abi/dform.json'
import Coin from './../../src/assets/coin.png'
import Slide1 from './../../src/assets/slide1.png'
import Slide2 from './../../src/assets/slide1.png'
import Logo from './../../src/assets/logo.svg'
import Icon from './helper/MaterialIcon'
import party from 'party-js'
import styles from './Form.module.scss'
import pinataSDK from '@pinata/sdk'

const pinata = new pinataSDK({ pinataJWTKey: import.meta.env.VITE_PINATA_API_KEY })
party.resolvableShapes['coin'] = `<img src="${Coin}" style='width:24px'/>`

const WhitelistFactoryAddr = web3.utils.padLeft(`0x2`, 64)

export const loader = async () => {
  return defer({ key: 'val' })
}

function Home({ title }) {
  Title(title)
  const [loaderData, setLoaderData] = useState(useLoaderData())
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState([])
  const [data, setData] = useState([])
  const [respond, setRespond] = useState([])
  const [respondIPFS, setRespondIPFS] = useState()
  const [activeQ, setActiveQ] = useState(0)
  const [isExpired, setIsExpired] = useState(false)

  const auth = useAuth()
  const navigate = useNavigate()
  const formWrapperRef = useRef()
  const progressRef = useRef()
  const answerRef = useRef()
  const params = useParams()

  const getFormList = async (sender) => await contract.methods.formList(sender).call()
  const getForm = async (id) => await contract.methods.form(id).call()
  const getTotalRespond = async () => await contract.methods._respondCounter().call()
  const getFee = async () => await contract.methods.fee().call()
  const getResolveList = async (wallet) => await contract.methods.getDomainList(wallet).call()
  const getIsExpired = async (fromId) => await contract.methods.isExpired(fromId).call()
  const getCouncilMintExpiration = async () => await contract.methods.councilMintExpiration().call()
  const getMaxSupply = async () => await contract.methods.MAX_SUPPLY().call()

  const handleUpload = async (obj) => {
    console.log(obj)
    const t = toast.loading(`Uploading respond`)
    try {
      return await pinata.pinJSONToIPFS(obj).then((result) => {
        console.log(result)
        setRespondIPFS(result.IpfsHash)
        toast.dismiss(t)
        return result.IpfsHash
      })
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      toast.dismiss(t)
    }
  }

  const handleDownload = async (CID) => {
    let loadingToast = toast.loading(`Downloading....`)
    try {
      let requestOptions = {
        method: 'GET',
        redirect: 'follow',
      }

      const response = await fetch(`https://rose-eldest-koala-728.mypinata.cloud/ipfs/${CID}`, requestOptions)
      if (!response.ok) throw new Response('Failed to get data', { status: 500, statusText: 'Not found' })
      await response.json().then((obj) => {
        console.log(obj)
      })
      toast.dismiss(loadingToast)
    } catch (error) {
      console.log(error)
      toast.error(error.statusText)
      toast.dismiss(loadingToast)
    }
  }
  const handleRegister = async (e) => {
    const t = toast.loading(`Waiting for transaction's confirmation`)
    if (typeof window.lukso === 'undefined') window.open('https://chromewebstore.google.com/detail/universal-profiles/abpickdkkbnbcoepogfhkhennhfhehfn?hl=en-US&utm_source=candyzap.com', '_blank')

    try {
      contract.methods
        .register(`amir`, `0x0000000000000000000000000000000000000000000000000000000000000001`) //txtSearchRef.target.value_.padLeft(`0x1`, 63)
        .send({
          from: auth.wallet,
          value: web3.utils.toWei(1, 'ether'),
        })
        .then((res) => {
          console.log(res) //res.events.tokenId

          // Run partyjs
          // party.confetti(document.querySelector(`#egg`), {
          //   count: party.variation.range(20, 40),
          //   shapes: ['egg', 'coin'],
          // })

          toast.dismiss(t)
        })
        .catch((error) => {
          console.log(error)
          toast.dismiss(t)
        })
    } catch (error) {
      console.log(error)
      toast.dismiss(t)
    }
  }

  const fetchIPFS = async (CID) => {
    try {
      const response = await fetch(`https://api.universalprofile.cloud/ipfs/${CID}`)
      if (!response.ok) throw new Response('Failed to get data', { status: 500 })
      const json = await response.json()
      // console.log(json)
      return json
    } catch (error) {
      console.error(error)
    }

    return false
  }

  const animateCSS = (node, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`

      node.classList.add(`${prefix}animated`, animationName)

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event) {
        event.stopPropagation()
        node.classList.remove(`${prefix}animated`, animationName)
        resolve('Animation ended')
      }

      node.addEventListener('animationend', handleAnimationEnd, { once: true })
    })

  const handleMove = (action) => {
    animateCSS(formWrapperRef.current, 'fadeInUp').then((message) => {})
    let currectActiveQ = activeQ

    if (action === `next`) {
      currectActiveQ += 1
      // Update progressbar
      progressRef.current.style.setProperty('--w', `${100 / (data.length - currectActiveQ)}%`)
    } else {
      currectActiveQ -= 1
      // Update progressbar
      progressRef.current.style.setProperty('--w', `${100 / (data.length - currectActiveQ)}%`)
    }

    setActiveQ(currectActiveQ)
    // Has filled out the input already?
    respond[currectActiveQ] !== undefined ? (answerRef.current.value = respond[currectActiveQ]) : (answerRef.current.value = '')
  }

  const getRespond = () => JSON.parse(localStorage.getItem(`${params.formId}`))

  const handleInput = (e) => {
    let inputValue = e.target.value
    if (inputValue.length < 1) return

    let newRespond = getRespond()

    if (respond[activeQ] !== undefined) {
      newRespond[activeQ] = inputValue
    } else {
      newRespond.push(inputValue)
    }

    setRespond(newRespond)
    localStorage.setItem(`${params.formId}`, JSON.stringify(newRespond))
  }

  const handleSubmit = async (e) => {
    handleUpload({ respond: respond }).then((CID) => {
      localStorage.setItem(`respond${params.formId}`, CID)

      const t = toast.loading(`Waiting for transaction's confirmation`)
      console.log(auth.wallet)
      try {
        contract.methods
          .newRespond(params.formId, `${CID}`)
          .send({
            from: auth.wallet,
            value: 0,
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
    })
  }

  useEffect(() => {
    getFormList(auth.wallet).then((res) => {
      console.log(res)
      setForm(res)
    })

    // Create an object on localStorage if doesn't exsist
    if (getRespond() === null) localStorage.setItem(`${params.formId}`, JSON.stringify([]))
    else setRespond(getRespond())

    getIsExpired(params.formId).then((res) => {
      setIsExpired(res)
      setIsLoading(false)
    })

    // Get form
    getForm(params.formId).then((res) => {
      console.log(res)
      setForm(res)
      if (res.metadata === '') return
      fetchIPFS(res.metadata).then((data) => {
        console.log(data)
        setData(data)
      })
    })
  }, [])

  if (isLoading) return <Loading />

  if (isExpired) return <Expired/>

  return (
    <>
      <Toaster />
      <div ref={progressRef} className={`${styles['progress']}`} count={`${activeQ + 1}/${data.length}`} style={{ '--w': `${data && data.length > 0 && 100 / data.length}%` }} />
      <section className={`${styles.section} d-f-c flex-row ms-motion-slideDownIn`}>
        <div className={`__container`} data-width={`small`}>
          {data && data.length > 0 && (
            <>
              <ul className={`${styles['nav']}`}>
                <li>
                  <button className={`d-f-c`} disabled={activeQ === 0 ?? true} onClick={() => handleMove(`back`)}>
                    <Icon name={`arrow_back_ios`} />
                    Back
                  </button>
                </li>
                <li>
                  <button className={`d-f-c`} disabled={activeQ === data.length - 1 ?? true} onClick={() => handleMove(`next`)}>
                    Next
                    <Icon name={`arrow_forward_ios`} />
                  </button>
                </li>
              </ul>
              {data
                .filter((item, i) => i === activeQ)
                .map((item, i) => {
                  return (
                    <div key={i} ref={formWrapperRef} className={`${styles['form-wrapper']} d-flex flex-column `}>
                      <div className={`d-flex flex-row`}>
                        {i + 1}.
                        <div className={`d-flex flex-column`}>
                          <b>{item.q}</b>
                          <small>{item.hint}</small>
                        </div>
                      </div>
                      {console.log(respond)}
                      <input ref={answerRef} placeholder={`Type your answer here...`} defaultValue={`${respond[activeQ] || ``}`} onChange={(e) => handleInput(e)} />
                      {activeQ !== data.length - 1 && <button onClick={() => handleMove(`next`)}>Ok</button>}
                      {activeQ === data.length - 1 && <button onClick={(e) => handleSubmit(e)}>Submit</button>}
                    </div>
                  )
                })}
            </>
          )}
        </div>
      </section>
      <Link to={`/`} className={`${styles['copyright']}`}>
        Powered by <img src={Logo} />
      </Link>
    </>
  )
}

export default Home
