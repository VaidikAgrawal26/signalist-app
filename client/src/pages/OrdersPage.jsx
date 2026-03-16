import React, { useEffect, useState } from 'react';
import { getOrders } from '../utils/api';
import { ClipboardList, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-6 text-gray-400">Loading Orders...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                    <ClipboardList size={24} className="text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Order History</h1>
                    <p className="text-gray-400 text-sm">Execution log and active orders</p>
                </div>
            </div>

            <div className="bg-surface border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-mono border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Symbol</th>
                                <th className="px-6 py-4">Side</th>
                                <th className="px-6 py-4 text-right">Qty</th>
                                <th className="px-6 py-4 text-right">Price</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-400 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} />
                                            {new Date(order.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">{order.asset_id?.symbol || 'UNKNOWN'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1 font-bold text-xs ${order.type === 'BUY' ? 'text-success' : 'text-danger'}`}>
                                            {order.type === 'BUY' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                            {order.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-gray-300">{order.quantity}</td>
                                    <td className="px-6 py-4 text-right font-mono text-white">${order.price?.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase ${order.status === 'FILLED' ? 'bg-success/10 text-success border-success/20' :
                                                order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                    'bg-gray-700/30 text-gray-400 border-white/10'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No orders found.</div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
