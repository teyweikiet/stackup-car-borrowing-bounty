import { useEffect, useState } from 'react'

import CarCard from '../components/CarCard'

function BorrowButton ({ nft, borrowCar, flag, setFlag }) {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <button
      className='primary-btn'
      onClick={async () => {
        setIsLoading(true)
        await borrowCar(nft.token_id, nft.serial_number)
        setIsLoading(false)
        setFlag(!flag)
      }}
      disabled={isLoading}
    >
      {isLoading ? 'Borrowing...' : 'Borrow'}
    </button>
  )
}

function Borrow ({ borrowCar }) {
  const [data, setData] = useState()
  const [flag, setFlag] = useState(false)

  const contractAddress = process.env.REACT_APP_SC_ADDRESS

  useEffect(() => {
    // Fetching data from Hedera Mirror Node for car that can be borrowed
    const readData = async () => {
      try {
        await fetch(`https://testnet.mirrornode.hedera.com/api/v1/accounts/${contractAddress}/nfts?order=asc`)
          .then((response) => response.json())
          .then((data) => {
            setData(data)
          })
      } catch (e) {
        console.log(e)
      }
    }

    readData()
  }, [contractAddress, flag])

  return (
    <div className='App'>
      <h1>Car Borrowing Page</h1>

      {data?.nfts?.map((nft, index) => (
        <CarCard
          key={index}
          nft={nft}
          actionButton={
            <BorrowButton
              nft={nft}
              borrowCar={borrowCar}
              flag={flag}
              setFlag={setFlag}
            />
          }
        />
      ))}
    </div>
  )
}

export default Borrow
