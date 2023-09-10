import { useEffect, useState } from 'react'
import moment from 'moment'
import { ethers } from 'ethers'

import MerchantBackend from '../MerchantBackend.json'

function CarCard ({ nft, actionButton }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    const signer = provider.getSigner()
    const contract = new ethers.Contract(process.env.REACT_APP_SC_ADDRESS, MerchantBackend.abi, signer)

    const fetchData = async () => {
      if (!contract?.cars) {
        return null
      }
      try {
        const tx = await contract.cars(nft.serial_number)
        setData(tx)
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [nft.serial_number])

  const dailyRate = data?.dailyRate && Number(ethers.utils.formatEther(data.dailyRate)).toFixed(0)
  const lateRate = data?.lateRate && Number(ethers.utils.formatEther(data.lateRate)).toFixed(0)

  return (
    <div className='card'>
      <div className='box'>
        <div>
          {/* Car Image */}
          <img
            src='https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=250&h=140&dpr=1'
            alt='car'
            style={{ borderRadius: '5px' }}
          />
        </div>

        <div className='item'>
          <table>
            <tbody>
              <tr>
                <td className='title' style={{ fontWeight: 'bold' }}>
                  Token ID:
                </td>
                <td className='desc' style={{ fontWeight: 'bold' }}>
                  {nft.token_id}
                </td>
              </tr>
              <tr>
                <td className='title'>Serial Number:</td>
                <td className='desc'>{nft.serial_number}</td>
              </tr>
              <tr>
                <td className='title'>Current Holder:</td>
                <td className='desc'>{nft.account_id}</td>
              </tr>
              <tr>
                <td className='title'>Updated at:</td>
                <td className='desc'>
                  {
                    moment
                      .unix(nft.modified_timestamp)
                      .format('DD MMMM YYYY, h:mm:ss A')
                  }
                </td>
              </tr>
              <tr>
                <td className='title'>Daily Rate:</td>
                <td className='desc'>{dailyRate} HBAR/day</td>
              </tr>
              <tr>
                <td className='title'>Current Holder:</td>
                <td className='desc'>{lateRate} HBAR/day</td>
              </tr>
            </tbody>
          </table>
          {/* Button for returning the car */}
          <div className='btn-container'>
            {actionButton}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarCard
