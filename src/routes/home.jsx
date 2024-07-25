import { Suspense, useState, useEffect, useRef } from 'react'
import { useLoaderData, defer, Form, Await, Link, useNavigate } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'

import MaterialIcon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import Heading from './helper/Heading'
import { getTournamentList } from './../util/api'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _, contract } from './../contexts/AuthContext'
import ABI from './../abi/dform.json'
import Coin from './../../src/assets/coin.png'
import Slide1 from './../../src/assets/slide1.png'
import Slide2 from './../../src/assets/slide1.png'
import Hero from './../../src/assets/hero.svg'
import Ecosystem from './../../src/assets/ecosystem.svg'
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
  const [recordType, setRecordType] = useState([])

  const [faq, setFaq] = useState([
    {
      q: `What is a decentralized form?`,
      a: `A decentralized form is a form that exists and operates on a blockchain. Unlike traditional forms that rely on centralized servers, decentralized forms are transparent, immutable, and resistant to censorship.`,
    },
    {
      q: `Why build a decentralized form like Typeform?`,
      a: `Decentralized forms offer several advantages over traditional ones:
<p><b>Transparency:</b> All form data is publicly accessible and verifiable.</p>
<p><b>Security:</b> Data is immutable and cannot be altered or deleted.</p>
<p><b>Censorship resistance:</b> Forms cannot be taken down or manipulated by a central authority.</p>
<p><b>Trustlessness:</b> No intermediary is required to manage the form or data.</p>
      `,
    },
    {
      q: `What blockchain should I use for my decentralized form?`,
      a: ` The choice of blockchain depends on various factors, including scalability, cost, and specific features. Popular options include LUKSO, Arbitrum, and Polygon.`,
    },
    {
      q: `How do I store form data on-chain?`,
      a: `Form data can be stored as smart contracts or as data within existing smart contracts. The choice depends on the complexity of the form and the desired level of interaction with the data.`,
    },
  ])
  const [why, setWhy] = useState([
    {
      title: `Security First`,
      description: `Dform secures your data and gives you control.`,
    },
    {
      title: `Efficiency Boost`,
      description: `Build forms faster and save money with Dform.`,
    },
    {
      title: `Future-Proof`,
      description: `Dform is the future of form building, powered by blockchain.`,
    },
    {
      title: `User-Friendly`,
      description: `Easy to use for everyone.`,
    },
  ])
  const [ecosystem, setEcosystem] = useState([
    {
      name: `Ethereum`,
    },
    {
      name: `Arbitrum`,
    },
    {
      name: `LUKSO`,
    },
    {
      name: `Morph`,
    },
  ])
  const [totalSupply, setTotalSupply] = useState(0)
  const [distance, setDistance] = useState(0)
  const [toggleCustom, setToggleCustom] = useState(false)
  const [councilMintExpiration, setCouncilMintExpiration] = useState('')
  const [councilMintExpirationDate, setCouncilMintExpirationDate] = useState('')
  const [maxSupply, setMaxSupply] = useState(0)
  const [candySecondaryColor, setCandySecondaryColor] = useState('#0E852E')
  const auth = useAuth()
  const navigate = useNavigate()
  const txtSearchRef = useRef()

  const addMe = async () => {
    const t = toast.loading(`Loading`)
    try {
      web3.eth.defaultAccount = auth.wallet

      const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET, {
        from: auth.wallet,
      })
      console.log(whitelistFactoryContract.defaultChain, Date.now())
      await whitelistFactoryContract.methods
        .addUser(WhitelistFactoryAddr)
        .send()
        .then((res) => {
          console.log(res)
          toast.dismiss(t)
          toast.success(`You hav been added to the list.`)
          party.confetti(document.querySelector(`h4`), {
            count: party.variation.range(20, 40),
          })
        })
    } catch (error) {
      console.error(error)
      toast.dismiss(t)
    }
  }

  const addUserByManager = async () => {
    const t = toast.loading(`Loading`)
    try {
      web3.eth.defaultAccount = auth.wallet

      const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET, {
        from: auth.wallet,
      })

      await whitelistFactoryContract.methods
        .addUserByManager(WhitelistFactoryAddr)
        .send()
        .then((res) => {
          console.log(res)
          toast.dismiss(t)
          toast.success(`You hav been added to the list.`)
          party.confetti(document.querySelector(`h4`), {
            count: party.variation.range(20, 40),
          })
        })
    } catch (error) {
      console.error(error)
      toast.dismiss(t)
    }
  }

  const updateWhitelist = async () => {
    web3.eth.defaultAccount = `0x188eeC07287D876a23565c3c568cbE0bb1984b83`

    const whitelistFactoryContract = new web3.eth.Contract('', `0xc407722d150c8a65e890096869f8015D90a89EfD`, {
      from: '0x188eeC07287D876a23565c3c568cbE0bb1984b83', // default from address
      gasPrice: '20000000000',
    })
    console.log(whitelistFactoryContract.defaultChain, Date.now())
    await whitelistFactoryContract.methods
      .updateWhitelist(web3.utils.utf8ToBytes(1), `q1q1q1q1`, false)
      .send()
      .then((res) => {
        console.log(res)
      })
  }

  const createWhitelist = async () => {
    console.log(auth.wallet)
    web3.eth.defaultAccount = auth.wallet

    const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET)
    await whitelistFactoryContract.methods
      .addWhitelist(``, Date.now(), 1710102205873, `0x0D5C8B7cC12eD8486E1E0147CC0c3395739F138d`, [])
      .send({ from: auth.wallet })
      .then((res) => {
        console.log(res)
      })
  }

  const handleSearch = async () => {
    await contract.methods
      .isFreeToRegister(_.keccak256(`${txtSearchRef.current.value}`))
      .call()
      .then((res) => {
        setIsFreeToRegister(res)
      })
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

  useEffect(() => {}, [])

  return (
    <>
      <section className={`${styles.section} ms-motion-slideDownIn`}>
        <div className={`${styles['__container']} __container`} data-width={`xlarge`}>
          <div className={`${styles['hero']} grid grid--fit`} style={{ '--data-width': '400px', gap: '1rem' }}>
            <div className={`grid__item d-flex flex-column align-items-start justify-content-center`} style={{ rowGap: '2.4rem' }}>
              <h1 className={`text-uppercase`}>
                Data forms you can <b className={`color-primary`}>trust</b>
              </h1>

              <p className={``}>
                Trustworthy forms, secure, transparent data management— <b>All on blockchain</b>
              </p>
              <button onClick={() => auth.connectWallet()}>Get started—it's free</button>
            </div>
            <figure className={`grid__item `}>
              <img alt={`Form`} src={Hero} />
            </figure>
          </div>
        </div>

        <section className={`${styles['ecosystem']}`}>
          <div className={`${styles['ecosystem__container']} __container d-f-c flex-column`} data-width={`xlarge`} style={{  gap: '1rem' }}>
            <h2>Works with your favorite chain!</h2>
           
            <div className={` __container `} data-width={`small`}>
              <div className={`grid grid--fit`} style={{ '--data-width': '200px', gap: '1rem' }}>
                {ecosystem.map((item, i) => (
                  <div className={`card`} key={i}>
                    <div className={`card__body`} dangerouslySetInnerHTML={{ __html: `<b>${item.name}</b>` }} />
                  </div>
                ))}
              </div>
            </div>

            <Link to={`/ecosystem`}>Browse ecosystems</Link>
          </div>
        </section>

        <div className={`__container ${styles['']}`} data-width={`xlarge`}>
          <Heading title={`Why ${import.meta.env.VITE_NAME}?`} subTitle={`Your data, your way, decentralized`}></Heading>

          <div className={`grid grid--fit mt-50`} style={{ '--data-width': '300px', gap: '1rem' }}>
            {why.map((item, i) => (
              <div className={`card`} key={i}>
                <div className={`card__header`} dangerouslySetInnerHTML={{ __html: `<b>${item.title}</b>` }} />
                <div className={`card__body`} dangerouslySetInnerHTML={{ __html: item.description }} />
              </div>
            ))}
          </div>
        </div>

        <div className={`__container ${styles['']}`} data-width={`xlarge`}>
          <Heading title={`FAQs`} subTitle={`Frequently Asked Questions`}></Heading>
          {faq.map((item, i) => (
            <details className={`transition`} key={i}>
              <summary>{item.q}</summary>
              <div dangerouslySetInnerHTML={{ __html: item.a }} />
            </details>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
