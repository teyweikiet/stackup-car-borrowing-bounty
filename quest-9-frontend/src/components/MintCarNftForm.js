import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Group, Box, TextInput, NumberInput } from '@mantine/core'
import { useForm } from '@mantine/form'

const rateInputFormatter = (value) => !Number.isNaN(parseFloat(value))
  ? `${value} HBAR/day`
  : ' HBAR/day'

function MintCarNftForm ({ onSubmit }) {
  const [opened, { open, close }] = useDisclosure(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    initialValues: {
      cid: '',
      dailyRate: 100,
      lateRate: 120
    },

    validate: {
      cid: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid CID')
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
        title='Add New Car'
      >
        <Box maw={300} mx='auto'>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setIsLoading(true)
              await onSubmit(form)
              setIsLoading(false)
              close()
            }}
          >
            <TextInput
              required
              label='Content ID (CID)'
              placeholder='https://bafkreifrenossw7hozgz57i32rnletjkstbunmnvpu2ikk7lom4s5o52su.ipfs.dweb.link/'
              {...form.getInputProps('cid')}
            />

            <NumberInput
              label='Daily Rate'
              required
              min={1}
              formatter={rateInputFormatter}
              {...form.getInputProps('dailyRate')}
            />

            <NumberInput
              label='Late Rate'
              required
              min={1}
              formatter={rateInputFormatter}
              {...form.getInputProps('lateRate')}
            />

            <Group position='right' mt='md'>
              <Button
                type='submit'
                disabled={isLoading}
              >
                Submit
              </Button>
            </Group>
          </form>
        </Box>
      </Modal>

      <Group position='center'>
        <Button onClick={open}>Add Car</Button>
      </Group>
    </>
  )
}

export default MintCarNftForm
