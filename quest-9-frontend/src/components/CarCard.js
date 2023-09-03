import moment from 'moment'

function CarCard ({ nft, actionButton }) {
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
