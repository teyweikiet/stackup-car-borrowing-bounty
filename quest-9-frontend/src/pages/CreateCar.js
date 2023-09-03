import { useState, useEffect } from 'react'
import CarCard from '../components/CarCard'
import { AccountId } from '@hashgraph/sdk'

const nftId = AccountId.fromSolidityAddress(process.env.REACT_APP_NFT_ADDRESS).toString()
const isAvailable = (currentHolderId) => currentHolderId === process.env.REACT_APP_SC_ID

function CreateCar ({ createCar }) {
  const [data, setData] = useState()
  const [flag, setFlag] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetching data from Hedera Mirror Node for cars created
    const readData = async () => {
      try {
        await fetch(
          `https://testnet.mirrornode.hedera.com/api/v1/tokens/${nftId}/nfts?order=asc`
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
  }, [nftId, flag])

  return (
    <div className='App'>
      <h1>Add New Car</h1>

      {/* Form for creating a new car NFT */}
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setIsLoading(true)
          await createCar(document.getElementById('cid').value)
          setIsLoading(false)
          setFlag(!flag)
        }}
        className='box'
      >
        <input type='text' id='cid' placeholder='Content ID (CID)' required />
        <div style={{ width: '100%' }}>
          {/* Submit button to create a new car NFT */}
          <button type='submit' className='primary-btn' disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      {/* List of car NFTs created */}
      {data?.nfts?.map((nft, index) => (
        <CarCard
          key={index}
          nft={nft}
          actionButton={
            <div
              className={isAvailable(nft.account_id) ? 'primary-btn' : 'return-btn'}
              style={{
                cursor: 'initial'
              }}
            >
              {
                isAvailable(nft.account_id)
                  ? 'Available'
                  : 'Borrowed'
              }
            </div>
          }
        />
      ))}
    </div>
  )
}

export default CreateCar
