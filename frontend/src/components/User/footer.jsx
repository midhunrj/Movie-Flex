// import React from 'react'

// const Footer = () => {
//   return (
//     <>
//     <div className='flex-wrap bg-blue-950'>
//         <div className='flex-col bg-slate-900 gap-4  justify-between'>
//             <h4 className='mx-2 px-4'> 24*7 Customer Support</h4>
//             <h4 className='mx-2 px-4'>Resend booking confirmation </h4>
//             <h4 className='mx-2 px-4'>Subscribe to the news letter</h4>
//         </div>
//     </div>
//     </>
//   )
// }

// export default Footer
import React from 'react';
import { FaPhoneAlt, FaRedoAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-indigo-950 text-white py-8 ">
      <div className=" mx-4 px-8">
        {/* Top Section */}
        <div className="flex justify-between flex-wrap">
          {/* Movies by Category */}
          <div className="w-full md:w-1/4 mb-6">
            <h4 className="text-lg font-bold mb-4">Movies in Cinema</h4>
            <ul className="space-y-2">
              <li>Inception</li>
              <li>Interstellar</li>
              <li>Tenet</li>
              <li>The Dark Knight</li>
            </ul>
          </div>

          {/* Movies by Language */}
          <div className="w-full md:w-1/4 mb-6">
            <h4 className="text-lg font-bold mb-4">Movies by Language</h4>
            <ul className="space-y-2">
              <li>English</li>
              <li>Hindi</li>
              <li>Spanish</li>
              <li>French</li>
            </ul>
          </div>

          {/* Movies by Genre */}
          <div className="w-full md:w-1/4 mb-6">
            <h4 className="text-lg font-bold mb-4">Movies by Genre</h4>
            <ul className="space-y-2 flex-col">
              <li>Action</li>
              <li>Drama</li>
              <li>Comedy</li>
              <li>Thriller</li>
            </ul>
          </div>

          {/* Movies by Location */}
          <div className="w-full md:w-1/4 mb-6">
            <h4 className="text-lg font-bold mb-4">Movies in Location</h4>
            <ul className="space-y-2">
              <li>New York</li>
              <li>Los Angeles</li>
              <li>Chicago</li>
              <li>Houston</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-700" />

        {/* Bottom Section */}
        <div className="flex justify-around bg-slate-900 flex-wrap mx-8">
          {/* Customer Support */}
          <div className="flex  space-x-4">
            <FaPhoneAlt className="text-2xl min-h-8" />
            <div>
              <h4 className="text-lg font-bold">24/7 Customer Support</h4>
              <p className="text-sm">Call us anytime for help</p>
            </div>
          </div>

          {/* Resend Booking Confirmation */}
          <div className="flex items-center space-x-4">
            <FaRedoAlt className="text-2xl min-h-8" />
            <div>
              <h4 className="text-lg font-bold">Resend Booking Confirmation</h4>
              <p className="text-sm">Didn’t receive your confirmation? Resend it!</p>
            </div>
          </div>

          {/* Subscribe to Newsletter */}
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-2xl min-h-8" />
            <div>
              <h4 className="text-lg font-bold">Subscribe to Newsletter</h4>
              <p className="text-sm">Get the latest updates on movies and offers</p>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" aria-label="Facebook" className="text-2xl text-white hover:text-blue-500">
            <FaFacebook />
          </a>
          <a href="#" aria-label="Twitter" className="text-2xl text-white hover:text-blue-400">
            <FaTwitter />
          </a>
          <a href="#" aria-label="Instagram" className="text-2xl text-white hover:text-pink-500">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
