

import React from 'react';
import { ScreenData } from './EditScreen';
interface ScreenLayoutProps {
  screenData: ScreenData | null;
}

const ScreenLayout:React.FC<ScreenLayoutProps> = ({ screenData }) => {
    if (!screenData || !screenData.tiers) return <div>Loading...</div>;
    
    return (
      <div className="mx-4 mt-4">
        <h2 className="text-lg font-semibold">{screenData.screenName} - Screen Layout</h2>
        <div className="mt-4">
          {[...screenData.tiers].reverse().map((tier, tierIndex) => (
            <div key={tierIndex} className="mb-6">
              <h3 className="font-medium text-center mb-2 text-yellow-500">{tier.name} - ₹{tier.ticketRate}</h3>
              {[...(tier?.seatLayout??[])]?.reverse().map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1 mb-1 flex-wrap">
                  {row.map((seat) => (
                    <div
                      key={seat.label}
                      className={`md:w-10 md:h-10 sm:w-5 sm:h-5 flex items-center justify-center md:text-sm  text-xs rounded-md sm:rounded-md ${
                        seat.isPartition
                          ? 'bg-transparent border-none'
                          : seat.isFilled
                          ? 'bg-yellow-200 text-blue-950'
                          : 'bg-green-200'
                      } border border-gray-400`}
                    >
                      {seat.isPartition ? '' : seat.label}
                    </div>
                  ))}
                </div>
              ))}
              {tierIndex < screenData.tiers.length - 1 && (
                <div className="h-2 bg-gray-200 my-4"></div>
              )}
            </div>
          ))}
        </div>
        <div className="relative w-[75%] mx-auto h-8 bg-gray-700 rounded-t-xl overflow-hidden">
  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-600 to-gray-400 opacity-60"></div>
  <p className="text-center text-white text-xs uppercase tracking-wider absolute inset-0 flex items-center justify-center">
    Screen
  </p>
</div>

        <h3 className="mt-6 font-medium text-center">Speakers Layout</h3>
        <div className="flex flex-wrap justify-around mt-2">
          {screenData.speakers.map((speaker, index) => (
            <div key={index} className="text-center w-full sm:w-auto">
              <div className="w-20 h-20 border border-gray-300 bg-gray-200 flex items-center justify-center">
                Speaker {index + 1}
              </div>
              <span className="text-sm">{speaker.type}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

export default ScreenLayout;
