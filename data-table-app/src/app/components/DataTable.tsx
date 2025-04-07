'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
    id: number;
    name: string;
    email: string;
};

const DataTable = () => {
    const [data, setData] = useState<User[]>([]);
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);
    const limit = 5;

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'email'>('name');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:3001/users', {
                params: {
                    _page: page,
                    _limit: limit,
                    _sort: sortBy,
                    _order: order,
                    q: search,
                },
            });

            setData(res.data);
            setTotal(parseInt(res.headers['x-total-count'] || '0'));
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, search, sortBy, order]);

    const handleSort = (field: 'name' | 'email') => {
        if (sortBy === field) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setOrder('asc');
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => {
                        setPage(1); // reset to first page
                        setSearch(e.target.value);
                    }}
                    className="border p-2 rounded w-full max-w-md"
                />
            </div>

            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border p-2 cursor-pointer" onClick={() => handleSort('name')}>
                            Name {sortBy === 'name' ? (order === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="border p-2 cursor-pointer" onClick={() => handleSort('email')}>
                            Email {sortBy === 'email' ? (order === 'asc' ? '▲' : '▼') : ''}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.length ? (
                        data.map((user) => (
                            <tr key={user.id}>
                                <td className="border p-2">{user.name}</td>
                                <td className="border p-2">{user.email}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="text-center p-4">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                    Page {page} of {Math.ceil(total / limit)}
                </span>
                <button
                    disabled={page >= Math.ceil(total / limit)}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DataTable;
