import { useState, useEffect } from 'react'
import CarCard from '../components/CarCard'
import { AccountId } from '@hashgraph/sdk'
import MintCarNftForm from '../components/MintCarNftForm'
import { Group, Center, Stack } from '@mantine/core'

const nftId = AccountId.fromSolidityAddress(process.env.REACT_APP_NFT_ADDRESS).toString()
const scId = process.env.REACT_APP_SC_ID
const isAvailable = (currentHolderId) => currentHolderId === scId

const accountIdFilterOptions = [
  {
    value: '',
    label: 'All'
  },
  {
    value: `account.id=eq%3A${scId}&`,
    label: 'Available'
  },
  {
    value: `account.id=ne%3A${scId}&`,
    label: 'Borrowed'
  }
]

function CreateCar ({ createCar }) {
  const [data, setData] = useState()
  const [flag, setFlag] = useState(false)
  const [accountIdFilter, setAccountIdFilter] = useState('')

  useEffect(() => {
    // Fetching data from Hedera Mirror Node for cars created
    const readData = async () => {
      try {
        await fetch(
          `https://testnet.mirrornode.hedera.com/api/v1/tokens/${nftId}/nfts?${accountIdFilter}order=asc`
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
  }, [accountIdFilter, flag])

  return (
    <div className='App'>
      <Group
        position='center'
      >
        <h1>List of Cars</h1>

        {/* Form for creating a new car NFT */}
        <MintCarNftForm
          isLoading
          onSubmit={async (form) => {
            const { cid, deposit, dailyRate } = form.values
            await createCar(cid, deposit, dailyRate)
            setFlag(!flag)
          }}
        />
      </Group>

      {/* Filters for list of cars to display */}
      <div
        className='flex-center radio-filter'
      >
        {
          accountIdFilterOptions.map(({ value, label }) => (
            <div
              key={label}
            >
              <input
                type='radio'
                className='invisible'
                name='accountIdFilter'
                onChange={() => setAccountIdFilter(value)}
                id={label}
                value={value}
                checked={accountIdFilter === value}
              />
              <label htmlFor={label}>
                {label}
              </label>
            </div>
          ))
        }
      </div>

      {/* List of car NFTs created */}
      <Center>
        <Stack>
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
        </Stack>
      </Center>
    </div>
  )
}

export default CreateCar
