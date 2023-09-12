import { useEffect, useState } from 'react'

import CarCard from '../components/CarCard'
import { Box, Button, Center, Group, Modal, NumberInput, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'

function BorrowButton ({ nft, borrowCar, flag, setFlag, dailyRate, deposit }) {
  const [opened, { open, close }] = useDisclosure(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    initialValues: {
      duration: 1
    }
  })

  return (
    <>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={() => {
          close()
          form.reset()
        }}
        title='Borrow Car'
      >
        <Box maw={300} mx='auto'>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setIsLoading(true)
              await borrowCar(nft.token_id, nft.serial_number, form.values.duration, dailyRate, deposit)
              setIsLoading(false)
              setFlag(!flag)
              close()
            }}
          >
            <NumberInput
              label='Duration'
              required
              min={1}
              formatter={(v) => `${v} day${v > 1 ? 's' : ''}`}
              {...form.getInputProps('duration')}
            />
            <Group position='right' mt='md'>
              <Button
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? 'Borrowing...' : 'Borrow'}
              </Button>
            </Group>
          </form>
        </Box>
      </Modal>
      <Group position='center'>
        <Button onClick={open}>Borrow</Button>
      </Group>
    </>
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
      <Center>
        <Stack>
          {
            data?.nfts?.map((nft, index) => (
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
            ))
          }
        </Stack>
      </Center>
    </div>
  )
}

export default Borrow
