import React, { useEffect, useState } from 'react';
import { getUsers } from '../utils/api';
import { Users, Mail, Shield, User } from 'lucide-react';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="p-6 text-gray-400">Loading Users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                    <Users size={24} className="text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">User Management</h1>
                    <p className="text-gray-400 text-sm">View and manage platform users</p>
                </div>
            </div>

            <div className="bg-surface border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-mono border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
                                                {user.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                                                {user.username}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="opacity-50" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${user.role === 'ADMIN'
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                : 'bg-primary/10 text-primary border-primary/20'
                                            }`}>
                                            <Shield size={12} />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{user._id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No users found.</div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;
