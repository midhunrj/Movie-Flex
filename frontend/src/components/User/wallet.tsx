import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { userAuthenticate } from '@/utils/axios/userInterceptor';
import { format } from 'date-fns';
import Header from './header';
import Footer from './footer';

interface WalletTransaction {
  _id: string;
  type: 'Credit' | 'Debit';
  amount: number;
  date: string;
  description: string;
}

const Wallet = () => {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
  const transactionsPerPage = 10; // Fetch 20 transactions per page

  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?._id;

  const fetchWalletData = async (page: number) => {
    setLoading(true);
    try {
      const response = await userAuthenticate.get('/wallet', {
        params: {
          userId,
          page,
          limit: transactionsPerPage,
        },
      });

      const { balance, transactions: newTransactions } = response.data;

      if (page === 1) {
        setWalletBalance(balance); 
      }

      if (newTransactions.length < transactionsPerPage) {
        setHasMore(false); 
      }

      setTransactions((prevTransactions) => {
     const updatedTransactions=[...prevTransactions,
        ...newTransactions]
        const uniqueTransactions=Array.from(
          new Map(updatedTransactions.map((t)=>[t._id,t])).values()
        )
        return uniqueTransactions
    });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Load the next page
  };

  useEffect(() => {
    if (userId) {
      fetchWalletData(currentPage);
    }
  }, [userId, currentPage]);

  return (
    <>
      <Header searchQuery="" setSearchQuery={()=>{}} />

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">My Wallet</h2>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h3 className="text-lg font-bold">Wallet Balance:</h3>
          <p className="text-xl font-semibold text-green-500">
            ₹{walletBalance.toFixed(2)}
          </p>
        </div>

        <h3 className="text-lg font-bold mb-2">Transaction History:</h3>

        {transactions.length === 0 && !loading ? (
          <p>No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border-gray-300 px-4 py-2 text-left">
                    Description
                  </th>
                  <th className="border-gray-300 px-4 py-2 text-left">Type</th>
                  <th className="border-gray-300 px-4 py-2 text-left">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-100">
                    <td className="border-gray-300 px-4 py-2">
                      {format(new Date(transaction.date), 'PPpp')}
                    </td>
                    <td className="border-gray-300 px-4 py-2">
                      {transaction.description}
                    </td>
                    <td
                      className={`border-gray-300 px-4 py-2 font-semibold ${
                        transaction.type === 'Credit'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {transaction.type}
                    </td>
                    <td className="border-gray-300 px-4 py-2">
                      ₹{transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {loading && <p>Loading transactions...</p>}

        {!loading && hasMore && (
          <div className='flex justify-end'><button
            className="mt-4 px-4 py-2 w-fit h-fit bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleShowMore}
          >
            Show More
          </button>
          </div>
        )}

        {!hasMore && (
          <p className="mt-4 text-gray-500">
            You have reached the end of the transaction history.
          </p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Wallet;
