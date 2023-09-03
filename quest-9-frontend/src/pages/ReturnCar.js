import { useEffect, useState } from 'react'

import CarCard from '../components/CarCard'

function ReturnButton ({ nft, returnCar, flag, setFlag }) {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <button
      className='return-btn'
      onClick={async () => {
        setIsLoading(true)
        await returnCar(nft.token_id, nft.serial_number)
        setIsLoading(false)
        setFlag(!flag)
      }}
      disabled={isLoading}
    >
      {isLoading ? 'Returning...' : 'Return'}
    </button>
  )
}

function Return ({ returnCar, address }) {
  const [data, setData] = useState()
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    // Fetching data from Hedera Mirror Node for car that can be returned
    const readData = async () => {
      try {
        await fetch(
          `https://testnet.mirrornode.hedera.com/api/v1/accounts/${address}/nfts?order=asc`
        )
          .then((response) => response.json())
          .then((data) => {
            setData(data)
          })
      } catch (e) {
        console.log(e)
      }
    }

    readData()
  }, [address, flag])

  return (
    <div className='App'>
      <h1>Car Returning Page</h1>

      {data?.nfts?.map((nft, index) => (
        <CarCard
          key={index}
          nft={nft}
          actionButton={
            <ReturnButton
              nft={nft}
              returnCar={returnCar}
              flag={flag}
              setFlag={setFlag}
            />
          }
        />
      ))}
    </div>
  )
}

export default Return
