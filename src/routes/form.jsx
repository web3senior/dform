import { Suspense, useState, useEffect, useRef } from 'react'
import { useLoaderData, defer, Form, Await, useRouteError, Link, useNavigate, useParams } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'

import MaterialIcon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import { getTournamentList } from '../util/api'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _, contract } from '../contexts/AuthContext'
import ABI from '../abi/dform.json'
import Coin from './../../src/assets/coin.png'
import Slide1 from './../../src/assets/slide1.png'
import Slide2 from './../../src/assets/slide1.png'
import Hero from './../../src/assets/hero.svg'

import party from 'party-js'
import styles from './Home.module.scss'

party.resolvableShapes['coin'] = `<img src="${Coin}" style='width:24px'/>`

const WhitelistFactoryAddr = web3.utils.padLeft(`0x2`, 64)

export const loader = async () => {
  return defer({ key: 'val' })
}

function Home({ title }) {
  Title(title)
  const [loaderData, setLoaderData] = useState(useLoaderData())
  const [isLoading, setIsLoading] = useState(true)
  const [form,setForm] = useState([])
  const [totalForm, setTotalForm] = useState(0)
  const [totalRespond, setTotalRespond] = useState(0)
  const auth = useAuth()
  const navigate = useNavigate()
  const txtSearchRef = useRef()
  const params = useParams()

  const getForm = async (id) => await contract.methods.getform(id).call()
  const getTotalRespond = async () => await contract.methods._respondCounter().call()
  const getFee = async () => await contract.methods.fee().call()
  const getResolveList = async (wallet) => await contract.methods.getDomainList(wallet).call()
  const getTotalSupply = async () => await contract.methods.totalSupply().call()
  const getCouncilMintExpiration = async () => await contract.methods.councilMintExpiration().call()
  const getMaxSupply = async () => await contract.methods.MAX_SUPPLY().call()

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

  useEffect(() => {
    getForm(params.formId).then((res) => {
      console.log(res)
      setForm(res)
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <section className={`${styles.section} ms-motion-slideDownIn`}>
        test
      </section>
    </>
  )
}

export default Home
