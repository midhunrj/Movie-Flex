import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import TheatreHeader from './TheatreHeader';
import Footer from '../User/footer';
import { useLocation, useNavigate } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCouch } from "@fortawesome/free-solid-svg-icons";
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { saveTierData } from '../../redux/theatre/theatreThunk';
import TierConfigModal from './configModal';
import { useLastIdentifier } from '../../utils/context/identifierContext';
const ItemTypes = {
    SEAT: 'seat',
    COUCH: 'couch',
};
const TierSeats = () => {
    const { lastIdentifier, updateLastIdentifier } = useLastIdentifier();
    const location = useLocation();
    const { tier } = location.state || {};
    console.log(tier, "tierData");
    //let fillseat=0
    const dispatch = useDispatch();
    const { theatre, isSuccess, isLoading, screens } = useSelector((state) => state.theatre);
    const [rows, setRows] = useState(tier?.rows || 0);
    const [tierConfig, setTierConfig] = useState({
        startLetter: "A",
        order: "ascending",
        manualLabels: [],
    });
    const [columns, setColumns] = useState(tier?.columns || 0);
    const [partition, setPartition] = useState(tier?.partition || 0);
    const [seatGrid, setSeatGrid] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [couchOccupied, setCouchOccupied] = useState({});
    const [filledSeats, setFilledSeats] = useState([]);
    const [fillSeat, setFillSeat] = useState(0);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const ItemTypes = {
        SEAT: 'seat',
        COUCH: 'couch',
    };
    const getRowLabel = (index) => {
        let label = '';
        while (index >= 0) {
            label = String.fromCharCode(65 + (index % 26)) + label;
            index = Math.floor(index / 26) - 1;
        }
        return label;
    };
    const generateLabels = () => {
        if (!tier)
            return [];
        const { startLetter, order, manualLabels = [] } = tierConfig; // Provide a default empty array
        console.log(tierConfig, "tierconfig in generate label");
        if (manualLabels.length > 0)
            return manualLabels; // Use custom labels if provided
        let labels = [];
        console.log(lastIdentifier, "last identifier");
        // let lastTemp=lastIdentifier.charCodeAt(0)
        // console.log(lastTemp,"lasttemp");
        let storeTemp = null;
        if (tier.seatLayout && tier.seatLayout.length > 0) {
            for (let column of tier.seatLayout[0]) {
                if (column.label) {
                    storeTemp = column.label.slice(0, 1);
                    break;
                }
            }
        }
        console.log(storeTemp, "store temp");
        let temp = storeTemp ? storeTemp.charCodeAt(0) : startLetter.charCodeAt(0);
        console.log(temp, "temp start letter");
        const startCharCode = temp; // ASCII code for A or Z
        const increment = order === "ascending" && startLetter != "Z" ? 1 : -1;
        console.log(startCharCode, increment, "startcharcode and increment");
        for (let i = 0; i < rows; i++) {
            labels.push(String.fromCharCode(startCharCode + i * increment));
            console.log(startCharCode, "startcharcode", increment, "increment", startCharCode + i * increment);
        }
        console.log(labels, "labels where returning");
        updateLastIdentifier(labels[labels.length - 1]);
        return labels;
    };
    const handleConfigSave = (config) => {
        console.log(config, "config in tier seats modal");
        setTierConfig(config);
        // Close modal after saving
        setIsConfigModalOpen(false);
    };
    useEffect(() => {
        console.log(tier, "tier data check");
        if (tier && tier.seatLayout && tier.seatLayout.length > 0) {
            // If a seat layout exists in the tier, use it to initialize the grid
            setSeatGrid(
            // tier.seatLayout.map(seatRow => 
            //     seatRow.map(seat => ({
            //         ...seat,
            //         filled: seat.isFilled || false,
            //         isPartition: seat.isPartition || false
            //     }))
            // )
            tier.seatLayout);
            // Restore other states based on the layout, if needed
            setFilledSeats(tier.seatLayout
                .flat()
                .filter(seat => seat.isFilled)
                .map(seat => ({ row: seat.row, col: seat.col, label: seat.label })));
            setFillSeat(tier.seatLayout.flat().filter(seat => seat.isFilled).length);
            setCouchOccupied(tier.seatLayout.flat().reduce((acc, seat) => {
                if (seat.isFilled)
                    acc[`${seat.row}-${seat.col}`] = true;
                return acc;
            }, {}));
        }
        else {
            generateSeatGrid(rows, columns, tier.seats, partition);
            setFillSeat(0);
            setFilledSeats([]);
            setCouchOccupied({});
        }
    }, [rows, columns, partition, tier]);
    const generateSeatGrid = (rows, columns, seats, space) => {
        console.log(rows, "rows", seats, "seat", space, "partition");
        let divColumns = Math.ceil((seats + (rows * space)) / rows);
        console.log("div columns", divColumns);
        setColumns(divColumns);
        const newSeatGrid = [];
        let seatNumber = 1;
        for (let row = 0; row < rows; row++) {
            const rowSeats = [];
            const rowLabel = getRowLabel(row);
            let k = 1;
            for (let col = 0; col < divColumns; col++) {
                let tab = Math.ceil(divColumns / (space + 1));
                console.log("tab", tab);
                //  if(col==(tab)*k)
                // //if (space > 0 && col % space === 0 && col !== 0) 
                // {
                // rowSeats.push({isPartition:true})
                //   k++
                // }
                // else
                // {
                rowSeats.push({ row, col, isFilled: false, isPartition: false });
                // }
            }
            newSeatGrid.push(rowSeats);
            console.log(newSeatGrid, "seatgrid values in rows and columns");
        }
        setSeatGrid(newSeatGrid);
    };
    // Implement Drag and Drop functionality
    useEffect(() => {
        // setTimeout(() => {
        if (fillSeat == tier.seats) {
            console.log("kkkkkkk");
            setSeatGrid((prevGrid) => prevGrid.map((rowSeats, rowIndex) => rowSeats.map((seat, colIndex) => {
                const seatKey = `${rowIndex}-${colIndex}`;
                return couchOccupied[seatKey]
                    ? seat // Keep filled seats intact
                    : { ...seat, isPartition: true }; // Mark remaining seats as partitions
            })));
        }
        // },200);
    }, [fillSeat]);
    const openConfigModal = () => setIsConfigModalOpen(true);
    const closeConfigModal = () => setIsConfigModalOpen(false);
    const Seat = React.memo(({ row, col, isFilled, isPartition, className }) => {
        const [, drop] = useDrop({
            accept: ItemTypes.COUCH,
            drop: () => {
                handleSeatClick(row, col);
                // setCouchOccupied((prev) => ({ ...prev, [`${row}-${col}`]: true }));
            },
            canDrop: () => !isPartition && !couchOccupied[`${row}-${col}`], // Check if the seat is not occupied
        });
        // console.log("vanne vanne");
        const handleSeatClick = (row, col) => {
            console.log("handle click worked ", row, col, fillSeat, tier.seats);
            if (couchOccupied[`${row}-${col}`]) {
                console.log("1");
                console.log(fillSeat, "fillseat after undo seat");
                setCouchOccupied((prev) => {
                    const updated = { ...prev };
                    delete updated[`${row}-${col}`];
                    return updated;
                });
                setSeatGrid((prevGrid) => prevGrid.map((rowSeats, rowIdx) => rowSeats.map((seat, colIdx) => {
                    const seatKey = `${rowIdx}-${colIdx}`;
                    return couchOccupied[seatKey]
                        ? seat
                        : { ...seat, isPartition: false };
                })));
                setFillSeat((prev) => prev - 1);
                setFilledSeats((prev) => prev.filter((seat) => !(seat.row === row && seat.col === col)));
            }
            else if (fillSeat < tier.seats) {
                console.log("2");
                const temp = fillSeat + 1;
                setCouchOccupied((prev) => ({ ...prev, [`${row}-${col}`]: true }));
                setFillSeat((prev) => prev + 1);
                const updatedFilledSeats = [...filledSeats, { row, col, isFilled: true }];
                const currentRowSeats = updatedFilledSeats
                    .filter((seat) => seat.row === row)
                    .sort((a, b) => a.col - b.col);
                const updatedRowSeats = currentRowSeats.map((seat, index) => ({
                    ...seat,
                    label: `${generateLabels()[row]}${index + 1}`,
                }));
                const finalSeats = updatedFilledSeats
                    .map((seat) => {
                    if (seat.row === row) {
                        return updatedRowSeats.find((updatedSeat) => updatedSeat?.col === seat.col);
                    }
                    return seat;
                })
                    .filter((seat) => seat !== undefined);
                setFilledSeats(finalSeats);
            }
            console.log(fillSeat, "fillseat after filling seat \n filledSeats in array", filledSeats);
        };
        const seatLabel = filledSeats.find(seat => seat.row === row && seat.col === col)?.label || "";
        // console.log(filledSeats,"filledseat and seatlabel",seatLabel);
        return isPartition ? (_jsx("div", { className: 'w-12 h-12' })) : (_jsx("div", { ref: drop, className: `
            cursor-pointer flex items-center justify-center 
            bg-transparent border border-yellow-500 
            ${couchOccupied[`${row}-${col}`] ? 'bg-indigo-950' : ''}
            ${className} 
            md:w-8 md:h-8 sm:w-6 sm:h-6  lg:w-12 lg:h-12  // Adjust seat size based on viewport
            `, onClick: () => handleSeatClick(row, col), children: couchOccupied[`${row}-${col}`] && (_jsxs(_Fragment, { children: [_jsx(FontAwesomeIcon, { icon: faCouch, size: "2x", className: " border-yellow-500  w-fit h-fit text-yellow-400" }), _jsx("span", { className: "absolute -mt-4 z-10 text-sm  font-semibold text-blue-950", children: seatLabel })] })) }));
    });
    const CouchLogo = () => {
        const [{ isDragging }, dragRef] = useDrag({
            type: ItemTypes.COUCH,
            item: { type: ItemTypes.COUCH }, // Correctly define the item type here
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });
        return (fillSeat < tier.seats ?
            _jsxs("div", { className: 'grid-flow-col space-y-2 ', children: [_jsx("div", { ref: dragRef, className: `cursor-pointer p-2 border-4 w-fit  border-yellow-400 rounded-md ${isDragging ? "opacity-50" : "opacity-100"}`, children: _jsx(FontAwesomeIcon, { icon: faCouch, size: "2x", color: "#FFD700" }) }), _jsxs("div", { className: "text-yellow-500 ", children: [" Seats left: ", tier.seats - fillSeat] })] }) : null);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const handleRowsChange = (e) => {
        setRows(parseInt(e.target.value, 10));
    };
    // const handleColumnsChange = (e) => {
    //     setColumns(parseInt(e.target.value, 10));
    // };
    const handlePartitionChange = (e) => {
        setPartition(parseInt(e.target.value, 10));
    };
    const handleSaveConfiguration = () => {
        const seatsData = seatGrid.map((rowSeats, rowIndex) => rowSeats.map((seat, colIndex) => {
            const seatKey = `${rowIndex}-${colIndex}`;
            const isFilled = couchOccupied[seatKey] ? true : false;
            const isPartition = seat.isPartition;
            // Find label for the current seat based on exact row and column match
            const filledSeat = filledSeats.find(s => s.row === rowIndex && s.col === colIndex);
            const label = filledSeat && !isPartition ? filledSeat.label : ""; // Only assign label if not a partition
            let status = "available";
            if (isPartition) {
                status = "partition";
            }
            else if (isFilled) {
                status = "available";
            }
            return {
                row: rowIndex, // Store row and column for reference
                col: colIndex,
                label: label,
                isFilled: isFilled,
                isPartition: isPartition,
                status: status
            };
        }));
        const updatedTier = {
            ...tier,
            rows,
            columns,
            partition,
            seatLayout: seatsData // Store seatsData in seatLayout field
        };
        console.log(updatedTier, "Updated Tier", filledSeats, "Filled Seats");
        saveTierConfig(updatedTier);
    };
    const navigate = useNavigate();
    const saveTierConfig = async (tierData) => {
        console.log(screens, "screens for in redux state");
        const screen = screens.find((screen) => screen.tiers.some((tier) => tier._id === tierData._id));
        console.log(screen, "data screen");
        const screenId = screen?._id ?? "";
        console.log(screenId);
        dispatch(saveTierData({ tierData, screenId }));
        navigate(-1);
    };
    return (_jsxs(_Fragment, { children: [_jsx(TheatreHeader, {}), _jsx("div", { className: " min-h-screen flex", style: { backgroundColor: "#FEE685" }, children: _jsxs("div", { className: "flex-col p-2 m-4 bg-slate-900 w-full mx-20 rounded-lg justify-between text-white", children: [_jsx("h1", { className: "p-2 justify-center text-center text-2xl", children: "Seats Management" }), _jsxs("div", { className: "flex justify-start flex-col text-lg font-mono gap-4 text-white", children: [_jsxs("span", { children: ["Name: ", tier.name] }), _jsxs("span", { children: ["Ticket Rate: ", tier.ticketRate] }), _jsxs("span", { children: ["Seats: ", tier.seats] }), _jsx("div", { className: 'flex justify-start items-center', children: _jsx(CouchLogo, {}) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "mx-4 mt-12 items-end space-y-4", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "flex flex-1 items-center gap-4", children: [_jsx("label", { className: "text-md font-medium min-w-fit mb-4", children: "No of Rows" }), _jsx("input", { type: "number", value: rows, onChange: handleRowsChange, className: "w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("label", { className: "text-md min-w-fit font-medium mb-4", children: "Horizontal Partition" }), _jsx("input", { type: "number", value: partition, onChange: handlePartitionChange, className: "w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none" })] })] }), _jsxs("div", { className: "mt-10 flex flex-col gap-[5px]", children: [_jsx("div", { className: "flex justify-start mt-8", children: _jsx("button", { type: "button", onClick: openConfigModal, className: "bg-amber-400 min-h-8 text-indigo-950 rounded p-2 hover:bg-yellow-500", children: "identifier configure" }) }), seatGrid.map((rowSeats, rowIndex) => {
                                            const rowLabel = generateLabels()[rowIndex];
                                            return (_jsxs("div", { className: "flex justify-center items-center mb-4", children: [filledSeats.some(seat => seat.row === rowIndex) && (_jsx("div", { className: "text-white w-12 h-12 flex justify-center items-center", children: rowLabel })), _jsx("div", { className: "flex gap-[5px]", children: rowSeats.map((seat, colIndex) => (_jsx(Seat, { row: rowIndex, col: colIndex, isFilled: seat.isFilled, isPartition: seat.isPartition, className: ` ${seat.isFilled ? 'bg-gray-200' : ''}` }, `${rowIndex}-${colIndex}`))) })] }, rowIndex));
                                        })] }), _jsx("div", { className: "flex justify-center mt-8 p-4", children: _jsx("button", { type: "submit", onClick: handleSaveConfiguration, className: "items-center rounded min-w-fit p-2 min-h-8 bg-amber-400 text-base text-indigo-950 hover:text-sm hover:bg-yellow-500", children: "Save" }) })] })] }) }), _jsx(Footer, {}), isConfigModalOpen && (_jsx(TierConfigModal, { onSave: handleConfigSave, onCancel: () => setIsConfigModalOpen(false), initialConfig: tierConfig }))] }));
};
export default TierSeats;
{ /* {seatGrid.map((rowSeats, rowIndex) => {
    
    const rowLabel = generateLabels()[rowIndex]
    return (
    <>
        
    <div key={rowIndex} className="flex  justify-center items-center">
        
        {filledSeats.some(seat => seat.row === rowIndex) && (
        <div className="text-white w-12 h-12 flex justify-center items-center">
            {rowLabel}
        </div>)}
        
            <div
                className="grid gap-[5px]  p-4 max-w-full overflow-auto"
                style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(40px, 1fr))`,
                    // maxWidth: `${columns > 25 ? '100%' : }`,
                    // gridAutoRows: `minmax(40px, 1fr)`
                    
                }}
            >
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
    </div>
    </>)})} */
}
// const handleSeatClick = () => {
//     // Toggle couch occupied state on click
//     // let currentFill=fillSeat
//     //  setFillSeat(++currentFill)
//     //  console.log(currentFill,"fillSeat");
//         if (couchOccupied[`${row}-${col}`]) {
//            // Undo seat filling
//            setCouchOccupied((prev) => {
//               const updated = { ...prev };
//               delete updated[`${row}-${col}`]; // Remove the filled state
//               return updated;
//            });
//            setFillSeat((prev) => prev - 1); // Decrease the count
//            setFilledSeats((prev) => prev.filter((seat) => !(seat.row === row && seat.col === col)));
//         } else if (fillSeat < tier.seats) {
//            // Fill the seat
//            setCouchOccupied((prev) => ({ ...prev, [`${row}-${col}`]: true }));
//            setFillSeat((prev) => prev + 1);
//            const currentRowSeats = filledSeats.filter((seat) => seat.row === row).sort((a,b)=>a.col-b.col);
//            const nextSeatNumber = currentRowSeats.length + 1;
//            setFilledSeats((prev) => [...prev, { row, col, label: `${String.fromCharCode(65 + row)}${nextSeatNumber}` }]);
//             // updateSeatLabels(currentRowSeats)
//             console.log(filledSeats,"filledSeats after named label" ,...filledSeats);
//             setFilledSeats((filledSeats)=>[...filledSeats, filledSeats.sort((a,b)=>a.label.split('')[1]-b.label.split('')[1])])
//         }
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
{ /* <div className="mt-10 grid w-full gap-[10px] items-center justify-center ">
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
                        </div> */
}
{ /* <div className="mt-10 grid" style={{
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
    ))} */
}
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
// setTimeout(() => {
//     if(fillSeat==tier.seats)
//         {
//     setSeatGrid((prevGrid) =>
//         prevGrid.map((rowSeats, rowIdx) =>
//             rowSeats.map((seat, colIdx) => {
//                 const seatKey = `${rowIdx}-${colIdx}`;
//                 return couchOccupied[seatKey]
//                     ? seat // Keep filled seats intact
//                     : { ...seat, isPartition: true }; // Mark remaining seats as partitions
//             })
//         )
//     );
// }
// },200);
// if(fillSeat>1){ updateSeatLabels(row)}
// if (!isPartition && !couchOccupied[`${row}-${col}`]) {
//     setCouchOccupied((prev) => ({ ...prev, [`${row}-${col}`]: true }));
//  setFillSeat((prev)=>prev+1)
// console.log(fillSeat,"fillseat ");
//        setFilledSeats((prev) => {
//     console.log(prev, "previous \n",...prev,"including current"); // Log the previous state here
//     //let nextcol=1
//     let currentRowSeats=prev.filter((seat)=>seat.row==row)
//     const filledCols = new Set(currentRowSeats.map(seat => seat.col));
//     // Find the first empty column by checking from 1 upward
//     let nextCol = 1;
//     while (filledCols.has(nextCol)) {
//         nextCol++; // Keep incrementing until you find an empty column
//     }
//     console.log(nextCol,"col value");
//     const newSeats = [...prev, { row, col: nextCol, label: `${String.fromCharCode(65 + row)}${nextCol}` }];
//     // Now, we need to update the labels for the current row to ensure they are ordered sequentially
//     const updatedSeats = newSeats.map((seat) => {
//         // If the seat is in the current row, sort them by column and update the label
//         if (seat.row === row) {
//             const sortedSeats = currentRowSeats
//             .sort((a, b) => a.col - b.col)
//             .map((seat, index) => {
//                 return {
//                     ...seat,
//                     label: `${String.fromCharCode(65 + seat.row)}${index + 1}` // Assign sequential label
//                 };
//             });
//         return sortedSeats;
//         }
//         return seat;
//     }) // Sort the seats by column number for sequential labeling
//   console.log(updatedSeats,"updatedSeats");
//     return updatedSeats
// });
//     }
//     };
// setFilledSeats((prev) => {
//     console.log(prev, "prev"); // Log the previous state here
//     return [
//         ...prev,
//         { row, col, label: `${String.fromCharCode(65 + row)}${col + 1}` }
//     ];
// });
// useEffect(() => {
//     const updateSeatLabels = () => {
//         // Group seats by rows and sort each row by column
//         const updatedSeats = filledSeats.reduce((acc, seat) => {
//             const { row } = seat;
//             if (!acc[row]) acc[row] = [];
//             acc[row].push(seat);
//             return acc;
//         }, {});
//         // Update the labels sequentially for each row
//         const newFilledSeats = filledSeats.map((seat) => {
//             const currentRowSeats = updatedSeats[seat.row].sort((a, b) => a.col - b.col);
//             const seatIndex = currentRowSeats.findIndex((s) => s.col === seat.col);
//             return {
//                 ...seat,
//                 label: `${String.fromCharCode(65 + seat.row)}${seatIndex + 1}`,
//             };
//         });
//         // Set the updated seats with correct labels
//         setFilledSeats(newFilledSeats);
//     };
//     if (filledSeats.length > 0) {
//         updateSeatLabels();
//     }
// }, [filledSeats]);
// const updateSeatLabels=(row)=>{
//     const currentRow=filledSeats.filter((seat)=>seat.row==row).sort((a,b)=>a.col-b.col)
//    currentRow.forEach((seat,index)=>{
//       seat.label=`${String.fromCharCode(65 + row)}${index + 1}` // Row label + sequential number
//    })
//    setFilledSeats([...filledSeats])
//   }
{ /* Seat Grid Rendering */ }
{ /* <div className="mt-10 grid w-full gap-[5px] items-center justify-center"
style={{
gridTemplateColumns: `repeat(${columns}, 50px)`,

}}>
{seatGrid.map((rowSeats, rowIndex) => (
<React.Fragment key="rowIndex">
{console.log(rowIndex,"rowindex")}

{filledSeats.some(seat => seat.row === rowIndex) && (


<div className="text-white flex justify-center items-center">
{String.fromCharCode(65 + rowIndex)} {/* Convert rowIndex to letter A, B, C, etc. */
}
{ /* </div>

)} */
}
{ /* {rowSeats.map((seat, colIndex) => (
    <Seat
        key={`${rowIndex}-${colIndex}`}
        row={rowIndex}
        col={colIndex}
        filled={seat.filled}
        isPartition={seat.isPartition}
    />
))}
</React.Fragment>
))}
// </div>   */
}
