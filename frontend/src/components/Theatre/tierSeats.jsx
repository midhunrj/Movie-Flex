// import React, { useEffect, useState } from 'react'
// import TheatreHeader from './TheatreHeader'
// import Footer from '../User/footer'
// import { useLocation } from 'react-router'

// const TierSeats = () => {
//     const location=useLocation()
//     const {tier}=location.state||{}
//     console.log(tier,"tierData");

//     const handleSubmit=(e)=>{
//         e.preventDefault()
//     }
//     const handleTierSeatChange=()=>{

//     }


//     const [rows, setRows] = useState(tier?.rows || 0);
//     //const [columns, setColumns] = useState(tier?.columns || 0);
//     const [partition, setPartition] = useState(tier?.partition || 0);
//     const [seatGrid, setSeatGrid] = useState([]);

    
//     useEffect(() => {
//         generateSeatGrid(rows,tier.seats,partition);
//     }, [rows, columns, partition]);

//     // Generate grid based on rows and columns
//     const generateSeatGrid = (rows,seats,partition) => {
//         const newSeatGrid = [];
//         for(let i=0;i<rows;i++)
//         {
//             for(let j=i;j)
//         }
//         setSeatGrid(newSeatGrid);
//     };


//     const handleRowsChange = (e) => {
//         setRows(parseInt(e.target.value, 10));
//     };

//     const handleColumnsChange = (e) => {
//         setColumns(parseInt(e.target.value, 10));
//     };

//     const handlePartitionChange = (e) => {
//         setPartition(parseInt(e.target.value, 10));
//     };
//   return (
//     <>
//     <TheatreHeader/>
//     <div className="bg-orange-300 min-h-screen flex  ">
//     <div className="flex-col p-2 m-4 bg-indigo-950 w-full mx-20  rounded-lg justify-between text-white">
//         <h1 className="p-2 justify-center text-center text-2xl">Seats Management</h1>
//     <div className='flex justify-start flex-col  text-lg font-mono gap-4 text-white'>
//     <span>Name : {tier.name}</span>
//     <span>Ticket Rate : {tier.ticketRate}</span>
//         <span>Seats : {tier.seats}</span>
//     </div>
//      <form onSubmit={handleSubmit} className="mx-4 mt-12 items-end space-y-4">
//         <div className='flex justify-between gap-6'>
//             <div className='flex items-center gap-4'>
//             <label className='text-md min-w-fit font-medium mb-4'> horizontal partition</label>
//             <input type="text" value={partition} onChange={handlePartitionChange} className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'/>
//         </div>
//         </div>
//         <div  className='flex items-center gap-6'>
              
//                 <div  className='flex  flex-1 items-center gap-4'>
//                     <label className='text-md font-medium min-w-fit mb-4'>No of rows</label>
//                     <input type="text" value={rows}  onChange={handleRowsChange} className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'/>
//                 </div>
//                 <div className='flex flex-1 items-center gap-4'>
//                     <label className='text-md font-medium min-w-fit mb-4'>No of columns</label>
//                     <input type="text" value={columns} onChange={handleColumnsChange} className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'/>
//                 </div>
//                 </div>
//                 <div className="mt-10 grid" style={{
//                             display: 'grid',
//                             gridTemplateColumns: `repeat(${columns}, 60px)`,
//                             gap: '15px',
//                             justifyContent: 'center'
//                         }}>
//                             {seatGrid.map((rowSeats, rowIndex) => (
//                                 <div key={rowIndex} style={{ display: 'flex', gap: '15px' }}>
//                                     {rowSeats.map((seat, colIndex) => (
//                                         <div key={colIndex} className="w-12 h-12 bg-yellow-500 flex items-center justify-center">
//                                             {`R${seat.row + 1}-C${seat.col + 1}`}
//                                         </div>
//                                     ))}
//                                 </div>
//                             ))}
//                         </div>
//          <div className='flex justify-center mt-8 p-4'>       
//         <button type="submit" className='items-center rounded min-w-fit p-2  min-h-8 bg-amber-400 text-base text-indigo-950 hover:text-sm hover:bg-yellow-500 '>Save</button>
     
//      </div>
//      </form>
//      </div>
//     </div>
//     <Footer/>
//     </>
//   )
// }

// export default TierSeats




import React, { useState, useEffect } from 'react';
import TheatreHeader from './TheatreHeader';
import Footer from '../User/footer';
import { useLocation } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCouch } from "@fortawesome/free-solid-svg-icons";
import { useDrag, useDrop } from 'react-dnd';


const TierSeats = () => {
    const location = useLocation();
    const { tier } = location.state || {};
    console.log(tier, "tierData");
   //let fillseat=0
    const [rows, setRows] = useState(tier?.rows || 0);
    const [columns, setColumns] = useState(tier?.columns || 0);
    const [partition, setPartition] = useState(tier?.partition || 0);
    const [seatGrid, setSeatGrid] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [couchOccupied, setCouchOccupied] = useState({}); 
    const[fillSeat,setFillSeat]=useState(0)
    const ItemTypes = {
        SEAT: 'seat',
        COUCH: 'couch', // Define a new type for the couch
    };


    // Update seat grid when rows, columns, or partition changes
    useEffect(() => {
        generateSeatGrid(rows, columns,tier.seats,partition);
    }, [rows, columns, partition]);

    const generateSeatGrid = (rows, columns,seats,space) => {
        console.log(rows,"rows",seats,"seat",space,"partition");
        
        let divColumns=Math.ceil((seats+(rows*space))/rows)
        console.log("div columns",divColumns);
        setColumns(divColumns)
        const newSeatGrid = [];
        for (let row = 1; row <= rows; row++) {
            const rowSeats = [];
            let k=1
            for (let col = 1; col <=divColumns; col++) {
                let tab=Math.ceil(divColumns/(space+1))
                if(col==(tab+1)*k)
                {
                rowSeats.push({isPartition:true})
                  k++
                }
                else
                {
                rowSeats.push({ row, col, filled: false ,isPartition:false});
                }
            }
            newSeatGrid.push(rowSeats);
            console.log(newSeatGrid,"seatgrid values in rows and columns");
            
        }
        setSeatGrid(newSeatGrid);
    };

    // Handle seat selection (click to select or fill)
    // const handleSeatClick = (row, col) => {
    //     const updatedGrid = seatGrid.map((rowSeats, rowIndex) =>
    //         rowSeats.map((seat, colIndex) =>
    //             rowIndex === row && colIndex === col
    //                 ? { ...seat, filled: !seat.filled } // Toggle filled state
    //                 : seat
    //         )
    //     );
    //     setSeatGrid(updatedGrid);
    // };

// Implement Drag and Drop functionality
const Seat = ({ row, col, filled, isPartition }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.COUCH,
        drop: () => {
            handleSeatClick(row,col)
            // setCouchOccupied((prev) => ({ ...prev, [`${row}-${col}`]: true }));
        },
        canDrop: () => !isPartition && !couchOccupied[`${row}-${col}`], // Check if the seat is not occupied
    });

    const handleSeatClick = () => {
        // Toggle couch occupied state on click
        // let currentFill=fillSeat
        //  setFillSeat(++currentFill)
        //  console.log(currentFill,"fillSeat");
       
         
        if (!isPartition && !couchOccupied[`${row}-${col}`]) {
            setCouchOccupied((prev) => ({ ...prev, [`${row}-${col}`]: true }));
        }

         setFillSeat((prev)=>prev+1)
        console.log(fillSeat,"fillseat ");
        
    };

    return isPartition ? (
        <div className='w-12 h-12'></div>
    ) : (
        <div
            ref={drop}
            className={`w-12 h-12 ${couchOccupied[`${row}-${col}`] ? 'bg-indigo-950' : 'bg-transparent'} flex items-center border border-yellow-500 justify-center cursor-pointer`}
            onClick={handleSeatClick} // Call handleSeatClick on click
        >
            {couchOccupied[`${row}-${col}`] && (
                <FontAwesomeIcon
                    icon={faCouch}
                    size="2x"
                    className=" border-yellow-500  text-yellow-400" // Add yellow border
                />
            )}
        </div>
    );
};



    // Implement Drag and Drop functionality
    // const Seat = ({ row, col,filled, isPartition }) => {
    //     const [{ canDrop, isOver }, drop] = useDrop({
    //         accept: ItemTypes.COUCH,
    //         drop: () => {
    //             // Update occupied seats
    //             setCouchOccupied((prev) => ({ ...prev, [`${row}-${col}`]: true }));
    //         },
    //         canDrop: () => !isPartition && !couchOccupied[`${row}-${col}`], // Check if the seat is not occupied
    //         collect: (monitor) => ({
    //             isOver: !!monitor.isOver(),
    //             canDrop: !!monitor.canDrop(),
    //         }),
    //     });

    //     return isPartition ? (
    //         <div className='w-12 h-12'></div>
    //     ) : (
    //         <div
    //             ref={drop}
    //             className={`w-12 h-12 ${couchOccupied[`${row}-${col}`]|| filled ? 'bg-yellow-300' : 'bg-transparent'} flex items-center border border-yellow-500 justify-center cursor-pointer`}
    //         >
    //             {couchOccupied[`${row}-${col}`] &&  (
    //             <FontAwesomeIcon
    //                 icon={faCouch}
    //                 size="2x"
    //                 className="border-2 border-yellow-500" // Add yellow border
    //             />
    //         )}
    //         </div>
    //     );
    // };

    const CouchLogo = () => {
        const [{isDragging}, dragRef] = useDrag({
            type: ItemTypes.COUCH,
            item: {}, // You can add additional data if needed
        });

        return (
            fillSeat<tier.seats ?
            <div
            ref={dragRef}
            className={`cursor-pointer p-2 border-4 border-yellow-400 rounded-md ${
              isDragging ? "opacity-50" : "opacity-100"
            }`}
          >
            <FontAwesomeIcon icon={faCouch} size="2x" color="#FFD700" />
          </div>
          :<></>
        );
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Save or submit seat configuration here
    };

    const handleRowsChange = (e) => {
        setRows(parseInt(e.target.value, 10));
    };

    const handleColumnsChange = (e) => {
        setColumns(parseInt(e.target.value, 10));
    };

    const handlePartitionChange = (e) => {
        setPartition(parseInt(e.target.value, 10));
    };
    const SeatLogo = () => {
        const [, dragRef] = useDrag({
            type: ItemTypes.SEAT,
            item: {},
        });

        return (
            <div
                ref={dragRef}
                className="w-12 h-12 bg-yellow-500 flex items-center justify-center border border-yellow-500 cursor-pointer"
            >
                Seat
            </div>
        );
    };
    return (
        <>
            <TheatreHeader />
            <div className="bg-orange-300 min-h-screen flex">
                <div className="flex-col p-2 m-4 bg-indigo-950 w-full mx-20 rounded-lg justify-between text-white">
                    <h1 className="p-2 justify-center text-center text-2xl">Seats Management</h1>
                    <div className="flex justify-start flex-col text-lg font-mono gap-4 text-white">
                        <span>Name: {tier.name}</span>
                        <span>Ticket Rate: {tier.ticketRate}</span>
                        <span>Seats: {tier.seats}</span>
                       <div className='flex justify-start items-center'>
                        <CouchLogo/>
                       </div>
                    </div>
                    <form onSubmit={handleSubmit} className="mx-4 mt-12 items-end space-y-4">
                        <div className="flex justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <label className="text-md min-w-fit font-medium mb-4">Horizontal Partition</label>
                                <input
                                    type="number"
                                    value={partition}
                                    onChange={handlePartitionChange}
                                    className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-1 items-center gap-4">
                                <label className="text-md font-medium min-w-fit mb-4">No of Rows</label>
                                <input
                                    type="number"
                                    value={rows}
                                    onChange={handleRowsChange}
                                    className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                                />
                            </div>
                            <div className="flex flex-1 items-center gap-4">
                                <label className="text-md font-medium min-w-fit mb-4">No of Columns</label>
                                <input
                                    type="number"
                                    value={columns}
                                    onChange={handleColumnsChange}
                                    className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Seat Grid Rendering */}
                   
                        <div className="mt-10 grid w-full gap-[5px] items-center justify-center" 
                        style={{
    gridTemplateColumns: `repeat(${columns}, 50px)`, 
    
}}>
    {seatGrid.map((rowSeats, rowIndex) => (
        rowSeats.map((seat, colIndex) => (
            <Seat
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                filled={seat.filled}
                isPartition={seat.isPartition}
            />
        ))
    ))}
</div>


                        <div className="flex justify-center mt-8 p-4">
                            <button
                                type="submit"
                                className="items-center rounded min-w-fit p-2 min-h-8 bg-amber-400 text-base text-indigo-950 hover:text-sm hover:bg-yellow-500"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TierSeats;




// const Seat = ({ row, col, filled ,isPartition}) => {
//     // if(isPartition)
//     // {
//     //     return<>
//     //         <div className='w-12 h-12'>
//     //             </div>
//     //     </>
//     // }
//     const [, dragRef] = useDrag(() => ({
//         type: 'seat',
//         item: { row, col },
//         canDrag:!isPartition
//     }));

//     return  isPartition?
//         <>
//             <div className='w-12 h-12'>
//                 </div>
//         </>:(
//         <div
//             ref={dragRef}
//             className={`w-12 h-12 ${filled ? 'bg-yellow-500' : 'bg-transparent'} flex items-center border border-yellow-500 justify-center cursor-pointer`}
//             onClick={() => handleSeatClick(row, col)}
//         >
            
//         </div>
//     );
// };


{/* <div className="mt-10 grid w-full gap-[10px] items-center justify-center ">
                            {
                                seatGrid.map((seats,rowIndex)=>(
                                   <div className=' flex justify-evenly  '>
                                   {  seats.map((seat,colIndex)=>(
                                        // <h1 key={i}>index : {i}</h1>
                                        <Seat
                                        key={`${rowIndex}-${colIndex}`}
                                        row={rowIndex}
                                        col={colIndex}
                                        filled={seat.filled}
                                    />
                                    ))}
                                   </div>
                                ))
                            }
                        </div> */}



{/* <div className="mt-10 grid" style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${Math.ceil(tier.seats / rows) + partition}, 50px)`,
    gap: '5px',
    justifyContent: 'center',
    justifyItems: 'center'
}}>
    {seatGrid.map((rowSeats, rowIndex) => (
        <div key={rowIndex} style={{ display: 'grid', gap: '5px' }}>
            {rowSeats.map((seat, colIndex) => (
                <Seat
                    key={`${rowIndex}-${colIndex}`}
                    row={rowIndex}
                    col={colIndex}
                    filled={seat.filled}
                    isPartition={seat.isPartition}
                />
            ))}
        </div>
    ))} */}

// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// const SeatLogo = () => {
//   // This is the seat logo that can be dragged
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: 'seat',
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div
//       ref={drag}
//       className={`p-4 w-16 h-16 bg-blue-500 rounded ${isDragging ? 'opacity-50' : 'opacity-100'}`}
//     >
//       🪑 {/* Seat Emoji */}
//     </div>
//   );
// };

// const Seat = ({ row, col, filled, onDrop }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: 'seat',
//     drop: () => onDrop(row, col),
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   return (
//     <div
//       ref={drop}
//       className={`w-16 h-16 border-2 border-gray-300 ${filled ? 'bg-green-500' : 'bg-white'} ${
//         isOver ? 'bg-yellow-200' : ''
//       }`}
//     >
//       {filled ? '🪑' : ''}
//     </div>
//   );
// };

// const SeatGrid = ({ rows, columns }) => {
//   const [seatGrid, setSeatGrid] = useState([]);

//   useEffect(() => {
//     // Generate initial empty seat grid
//     const newSeatGrid = [];
//     for (let row = 0; row < rows; row++) {
//       newSeatGrid.push([]);
//       for (let col = 0; col < columns; col++) {
//         newSeatGrid[row].push({ row, col, filled: false });
//       }
//     }
//     setSeatGrid(newSeatGrid);
//   }, [rows, columns]);

//   const handleDrop = (row, col) => {
//     const updatedGrid = seatGrid.map((r, rowIndex) =>
//       r.map((seat, colIndex) =>
//         rowIndex === row && colIndex === col ? { ...seat, filled: true } : seat
//       )
//     );
//     setSeatGrid(updatedGrid);
//   };

//   return (
//     <div
//       className="grid gap-2"
//       style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
//     >
//       {seatGrid.map((row) =>
//         row.map((seat) => (
//           <Seat
//             key={`${seat.row}-${seat.col}`}
//             row={seat.row}
//             col={seat.col}
//             filled={seat.filled}
//             onDrop={handleDrop}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// const TierSeats = () => {
//   const [rows, setRows] = useState(5);
//   const [columns, setColumns] = useState(5);

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="min-h-screen flex flex-col items-center bg-orange-300">
//         <h1 className="text-2xl mb-4">Seats Management</h1>
        
//         {/* Seat Logo */}
//         <div className="mb-4">
//           <SeatLogo />
//           <p>Drag the seat onto the grid below</p>
//         </div>

//         {/* Input Fields for Rows and Columns */}
//         <div className="mb-6">
//           <label className="mr-2">Rows: </label>
//           <input
//             type="number"
//             value={rows}
//             onChange={(e) => setRows(Number(e.target.value))}
//             className="p-2 border"
//           />
//           <label className="ml-4 mr-2">Columns: </label>
//           <input
//             type="number"
//             value={columns}
//             onChange={(e) => setColumns(Number(e.target.value))}
//             className="p-2 border"
//           />
//         </div>

//         {/* Seat Grid */}
//         <SeatGrid rows={rows} columns={columns} />
//       </div>
//     </DndProvider>
//   );
// };

// export default TierSeats;
