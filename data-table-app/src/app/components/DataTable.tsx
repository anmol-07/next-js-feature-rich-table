'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
    id: number;
    name: string;
    email: string;
    age: number;
};

const DataTable = () => {
    const [data, setData] = useState<User[]>([]);
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);
    const limit = 5;

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [order, setOrder] = useState<string>('asc');
    const [showFilterOptions, setshowFilterOptions] = useState<boolean>(false);
    const [selectedFilterOption, setSelectedFilterOption] = useState<string>("");

    const fetchData = async () => {
        try {
            const params = {
                _page: page,
                _limit: limit,
                _sort: sortBy,
                _order: order,
                // q: search,
                ...(selectedFilterOption === "emailIdFilter" && { email_like: ".biz" }),
                ...(selectedFilterOption === "ageFilter" && { age_lte: 30 }),
                ...(search.length > 0 && { name_like: search})
            }
            const res = await axios.get('http://localhost:3001/users', {
                params
            });

            setData(res.data);
            setTotal(parseInt(res.headers["x-total-count"] || '1'));
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, search, sortBy, order, selectedFilterOption]);

    const handleSort = (field: string) => {
        let newOrder: string  = 'asc';
    
        if (sortBy === field) {
            newOrder = order === 'asc' ? 'desc' : 'asc';
            setOrder(newOrder);
        } else {
            setOrder('asc');
        }
    
        setSortBy(field); // Or use `newOrder === 'asc' ? field : \`-\${field}\`` if you need to handle `-field`
        setPage(1);
    };

    const toggleFilterState = () => {
        setshowFilterOptions(!showFilterOptions);
        setSelectedFilterOption("ageFilter");
        setPage(1);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFilterOption(event.target.value);
        setPage(1);
        if(event.target.value === "emailIdFilter") {
            setSearch(""); //Empty Search field
        }
    };

    return (
        <div className="p-4">
            <div className="mb-12 flex justify-between">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => {
                        setPage(1); // reset to first page
                        setSearch(e.target.value);
                    }}
                    className="border p-2 rounded w-full max-w-md"
                />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded" onClick={(e) => {
                    toggleFilterState();
                }}>
                   Show Filter Options
                </button>
                {showFilterOptions && (<div className='custom-filter-options'>
                    <select value={selectedFilterOption} onChange={handleFilterChange} className='w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-1 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer'>
                        <option value={"ageFilter"}>Age under 30</option>
                        <option value={"emailIdFilter"}>Email id with .biz</option>
                    </select>
                </div>)}
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
                        <th className="border p-2 cursor-pointer" onClick={() => handleSort('age')}>
                            Age {sortBy === 'age' ? (order === 'asc' ? '▲' : '▼') : ''}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.length ? (
                        data.map((user) => (
                            <tr key={user.id}>
                                <td className="border p-2">{user.name}</td>
                                <td className="border p-2">{user.email}</td>
                                <td className="border p-2">{user.age}</td>
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
