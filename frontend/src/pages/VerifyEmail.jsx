import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const VerifyEmail = () => {

  const { token } = useParams()
  const navigate = useNavigate()

  const [status, setStatus] = useState("Verifying...")



  const verifyEmail = async () => {

    try {

      // For GET request: send token as query parameter
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/verify?token=${token}`
      )


      if (res.data.success) {

        setStatus("Email Verified Successfully ✅")

        setTimeout(() => {

          navigate("/login")

        }, 2000)

      }

    }
    catch (error) {

      console.log(error)

      setStatus(
        error?.response?.data?.message ||
        "Verification failed. Please try again ❌"
      )

    }

  }


  useEffect(() => {

    if (token) {
      verifyEmail()
    }

  }, [token])



  return (

    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50'>

      <div className='bg-white p-8 rounded-2xl shadow-md text-center w-[90%] max-w-md'>

        <h2 className='text-xl font-semibold text-gray-800'>

          {status}

        </h2>

      </div>

    </div>

  )

}

export default VerifyEmail
