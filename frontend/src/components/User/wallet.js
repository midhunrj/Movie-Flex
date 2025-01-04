import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Header from './header';
import Footer from './footer';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { format } from 'date-fns';
const Wallet = () => {
    const [walletBalance, setWalletBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.user);
    console.log(user?._id, "user id");
    const userId = user?._id;
    const fetchWalletData = async () => {
        try {
            const response = await userAuthenticate.get('/wallet', {
                params: { userId: userId },
            });
            console.log(response.data, "wallet response");
            setWalletBalance(response.data.balance);
            setTransactions(response.data.transactions);
        }
        catch (error) {
            console.error('Error fetching wallet data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchWalletData();
    }, [userId]);
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs("div", { className: "bg-white shadow-md rounded-lg p-6 w-full max-w-6xl mx-auto mt-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "My Wallet" }), _jsxs("div", { className: "bg-gray-100 p-4 rounded-md mb-6", children: [_jsx("h3", { className: "text-lg font-bold", children: "Wallet Balance:" }), _jsxs("p", { className: "text-xl font-semibold text-green-500", children: ["\u20B9", walletBalance.toFixed(2)] })] }), _jsx("h3", { className: "text-lg font-bold mb-2", children: "Transaction History:" }), loading ? (_jsx("p", { children: "Loading transactions..." })) : transactions.length === 0 ? (_jsx("p", { children: "No transactions found." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full table-auto border-collapse border border-gray-300", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-200", children: [_jsx("th", { className: " border-gray-300 px-4 py-2 text-left", children: "Date" }), _jsx("th", { className: " border-gray-300 px-4 py-2 text-left", children: "Description" }), _jsx("th", { className: " border-gray-300 px-4 py-2 text-left", children: "Type" }), _jsx("th", { className: " border-gray-300 px-4 py-2 text-left", children: "Amount" })] }) }), _jsx("tbody", { children: transactions.map((transaction) => (_jsxs("tr", { className: "hover:bg-gray-100", children: [_jsx("td", { className: " border-gray-300 px-4 py-2", children: format(new Date(transaction.date), 'PPpp') }), _jsx("td", { className: " border-gray-300 px-4 py-2", children: transaction.description }), _jsx("td", { className: ` border-gray-300 px-4 py-2 font-semibold ${transaction.type === 'Credit' ? 'text-green-500' : 'text-red-500'}`, children: transaction.type }), _jsxs("td", { className: " border-gray-300 px-4 py-2", children: ["\u20B9", transaction.amount.toFixed(2)] })] }, transaction._id))) })] }) }))] }), _jsx(Footer, {})] }));
};
export default Wallet;
