import { useEffect, useState } from 'react'
import { Center, Stack } from '@mantine/core'
import { AccountId } from '@hashgraph/sdk'

import CarCard from '../components/CarCard'

function ReturnButton ({ nft, returnCar, flag, setFlag, returnBy }) {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <button
      className='return-btn'
      onClick={async () => {
        setIsLoading(true)
        await returnCar(nft.token_id, nft.serial_number, returnBy)
        setIsLoading(false)
        setFlag(!flag)
      }}
      disabled={isLoading}
    >
      {isLoading ? 'Returning...' : 'Return'}
    </button>
  )
}

const tokenId = AccountId.fromSolidityAddress(process.env.REACT_APP_NFT_ADDRESS).toString()

function Return ({ returnCar, address }) {
  const [data, setData] = useState()
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    // Fetching data from Hedera Mirror Node for car that can be returned
    const readData = async () => {
      try {
        await fetch(
          `https://testnet.mirrornode.hedera.com/api/v1/accounts/${address}/nfts?order=asc&token.id=${tokenId}`
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

      <Center>
        <Stack>
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
        </Stack>
      </Center>
    </div>
  )
}

export default Return
