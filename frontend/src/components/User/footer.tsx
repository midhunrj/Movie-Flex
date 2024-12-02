import React from 'react';
import { FaPhoneAlt, FaRedoAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#091057] text-[#DCE4C9] py-8">
      <div className="mx-4 px-8">
      
        <div className="flex justify-between flex-wrap">
          
          <div className="w-full md:w-1/4 mb-6">
            <h4 className="text-lg font-bold mb-4 text-white">Movies in Cinema</h4>
            <ul className="space-y-2">
              {['Inception', 'Interstellar', 'Tenet', 'The Dark Knight'].map((movie, index) => (
                <li key={index} className="hover:text-white transition-colors duration-200 cursor-pointer ">
                  {movie}
                </li>
              ))}
            </ul>
          </div>

          
          <div className="w-full md:w-1/4 mb-6">
            <h4 className="text-lg font-bold mb-4 ">Movies by Language</h4>
            <ul className="space-y-2">
              {['English', 'Hindi', 'Spanish', 'French'].map((language, index) => (
                <li key={index} className="hover:text-white transition-colors duration-200 cursor-pointer">
                  {language}
                </li>
              ))}
            </ul>
          </div>

          
          <div className="w-full md:w-1/4 mb-6">
            <h4 className="text-lg font-bold mb-4 ">Movies by Genre</h4>
            <ul className="space-y-2">
              {['Action', 'Drama', 'Comedy', 'Thriller'].map((genre, index) => (
                <li key={index} className="hover:text-white transition-colors duration-200 cursor-pointer">
                  {genre}
                </li>
              ))}
            </ul>
          </div>

          
          <div className="w-full md:w-1/4 mb-6">
            <h4 className="text-lg font-bold mb-4 ">Movies in Location</h4>
            <ul className="space-y-2">
              {['New York', 'Los Angeles', 'Chicago', 'Houston'].map((location, index) => (
                <li key={index} className="hover:text-white transition-colors duration-200 cursor-pointer">
                  {location}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-700" />

        {/* Bottom Section */}
        <div className="flex justify-around bg-slate-900 flex-wrap mx-8">
          {/* Customer Support */}
          <div className="flex items-center space-x-4 hover:text-white transition-colors duration-200">
            <FaPhoneAlt className="text-2xl min-h-8" />
            <div>
              <h4 className="text-lg font-bold">24/7 Customer Support</h4>
              <p className="text-sm">Call us anytime for help</p>
            </div>
          </div>

          {/* Resend Booking Confirmation */}
          <div className="flex items-center space-x-4 hover:text-white transition-colors duration-200">
            <FaRedoAlt className="text-2xl min-h-8" />
            <div>
              <h4 className="text-lg font-bold">Resend Booking Confirmation</h4>
              <p className="text-sm">Didn’t receive your confirmation? Resend it!</p>
            </div>
          </div>

          {/* Subscribe to Newsletter */}
          <div className="flex items-center space-x-4 hover:text-white transition-colors duration-200">
            <FaEnvelope className="text-2xl min-h-8" />
            <div>
              <h4 className="text-lg font-bold">Subscribe to Newsletter</h4>
              <p className="text-sm">Get the latest updates on movies and offers</p>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mt-8 flex justify-center space-x-6">
          <a
            href="#"
            aria-label="Facebook"
            className="text-2xl text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaFacebook />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="text-2xl text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaTwitter />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="text-2xl text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
