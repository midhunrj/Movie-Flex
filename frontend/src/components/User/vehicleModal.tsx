import React from "react";
import { Modal } from "@mui/material";

// Mocked vehicle data
const vehicles = [
  { type: "Bicycle", seatCount: 1, image: "/uploads/Bicycle.png" },
  { type: "Scooter", seatCount: 2, image: "/uploads/scooter.svg" },
  { type: "Bike", seatCount: 3, image: "/uploads/bike.png" },
  { type: "Car", seatCount: 5, image: "/uploads/Car.png" },
  { type: "Mini-Van", seatCount: 7, image: "/uploads/mini-van.jpeg" },
  { type: "Van", seatCount: 8, image: "/uploads/van.jpeg" },
  { type: "Bus", seatCount: 10, image: "/uploads/bus.svg" },
];

const getVehicleDetails = (seatCount: number) => {
  const vehicle = vehicles.find((v) => seatCount <= v.seatCount);
  return vehicle
    ? {
        icon: vehicle.image.endsWith(".svg") ? (
          <img src={vehicle.image} alt={vehicle.type} className="w-40 h-40" />
        ) : (
          <img
            src={vehicle.image ? vehicle.image : "/uploads/fallback_profile.jpeg"}
            alt={vehicle.type}
            className="w-40 h-40 object-cover rounded"
          />
        ),
        color: seatCount <= 5 ? "green" : seatCount <= 8 ? "orange" : "red",
      }
    : {
        icon: (
          <img
            src="/uploads/fallback_profile.jpeg"
            alt="Fallback"
            className="w-40 h-40 object-cover rounded"
          />
        ),
        color: "gray",
      };
};

const VehicleModal = ({
  open,
  onClose,
  ticketCount,
  setTicketCount,
}: {
  open: boolean;
  onClose: () => void;
  ticketCount: number;
  setTicketCount: (count: number) => void;
}) => {
  const { icon, color } = getVehicleDetails(ticketCount);

  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Light grey overlay with reduced opacity
      }}
    >
      <div className="p-6 bg-white rounded shadow-md w-1/2 h-auto relative">
        <h2 className="text-xl font-bold mb-4 text-center">
          Choose Number of Tickets
        </h2>
        <p className="mb-4 text-center">
          Select a ticket count to see the associated vehicle.
        </p>
        <div className="flex justify-center items-center mb-6">
          <div
            className=" rounded p-4 flex justify-center items-center"
            style={{ color, borderColor: color }}
          >
            {icon}
          </div>
        </div>
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setTicketCount(num)}
              className={`p-2 w-10 h-10 text-center rounded ${
                ticketCount === num
                  ? "bg-[#2c698d] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
        <button
          onClick={onClose}
          className="bg-[#090910] text-white opacity-90 mt-8 w-36 hover:opacity-100  text-center min-h-12   p-4  rounded hover:bg-red-600"
        >
          select seats
        </button>
        </div>
      </div>
    </Modal>
  );
};

export default VehicleModal;
