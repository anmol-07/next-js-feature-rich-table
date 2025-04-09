'use client';

import React, { useEffect, useState } from 'react';
import UserModal from '@/app/components/UserModal';
import {  getUsers,
    createUser,
    updateUser,
    deleteUser } from '@/services/apiService';

const DataTable = () => {
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);
    const limit = 5;

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [order, setOrder] = useState<string>('asc');
    const [showFilterOptions, setshowFilterOptions] = useState<boolean>(false);
    const [selectedFilterOption, setSelectedFilterOption] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [deleteUserAction, setDeleteUserAction] = useState<boolean>(false);
    const allColumns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'age', label: 'Age' }
    ];  
    const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns.map(col => col.key));

    /**
     * Initial API call made to fetch users as per the params
     */
    const fetchData = async () => {
        try {
            const params = {
                _page: page,
                _limit: limit,
                _sort: sortBy,
                _order: order,
                ...(selectedFilterOption === "emailIdFilter" && { email_like: ".biz" }),
                ...(selectedFilterOption === "ageFilter" && { age_lte: 30 }),
                ...(search.length > 0 && { name_like: search})
            }
            
            const res = await getUsers(params);

            setData(res?.data);
            setTotal(parseInt(res?.headers["x-total-count"] || '1'));

        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    //useEffect hook used to check change in certain variables
    useEffect(() => {
        fetchData();
    }, [page, search, sortBy, order, selectedFilterOption]);

    /**
     * 
     * @param field 
     * Handling sort by particular field
     */
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

    /**
     * Open or close the filter select menu
     */
    const toggleFilterState = () => {
        setshowFilterOptions(!showFilterOptions);
        setSelectedFilterOption("ageFilter");
        setPage(1);
    };

    /**
     * 
     * @param event 
     * Select options event used to change and apply the filter
     */
    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFilterOption(event.target.value);
        setPage(1);
        if(event.target.value === "emailIdFilter") {
            setSearch(""); //Empty Search field
        }
    };

    /**
     * 
     * @param userData 
     * Handling create or update user calls 
     * if selectedUser is not null we update the user
     * else create a new user
     */
    const handleSave = async (userData: any) => {
        try {
          if (selectedUser) {
            await updateUser(selectedUser.id, userData);
          } else {
            await createUser(userData);
          }
          fetchData();
          setModalOpen(false);
          setSelectedUser(null);
        } catch (err) {
          alert('Failed to save user');
        }
    };


    /**
     * 
     * @param userData 
     * Handling delete user as per data got from modal
     */
    const handleDelete = async (userData: any) => {
        try {
          await deleteUser(userData.id);
          fetchData();
          setModalOpen(false);
          setSelectedUser(null);
        } catch (err) {
          alert('Failed to save user');
        }
    };

    /**
     * 
     * @param userId 
     * opening modal to update a user
     */
    const openUpdateUserModal = (userId: number) => {
        setModalOpen(true);
        setSelectedUser(data.filter((x) => x.id === userId)[0]);
    };

    /**
     * 
     * @param userId 
     * opening modal to delete a user
     */
    const openDeleteUserModal = (userId: number) => {
        setModalOpen(true);
        setDeleteUserAction(true);
        setSelectedUser(data.filter((x) => x.id === userId)[0]);
    };

    return (
        <div className="p-4">
            <div>
                <button onClick={() => {
                    setSelectedUser(null); 
                    setModalOpen(true);
                }} className="bg-green-600 text-white px-4 py-2 rounded mb-4">Add User</button>
            </div>
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

            <div className="flex gap-4 mb-4">
                {allColumns.map((col) => (
                    <label key={col.key} className="flex items-center gap-1">
                    <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => {
                        setVisibleColumns((prev) =>
                            prev.includes(col.key)
                            ? prev.filter((k) => k !== col.key)
                            : [...prev, col.key]
                        );
                        }}
                    />
                    {col.label}
                    </label>
                ))}
            </div>


            <table className="w-full border">
                <thead>
                    <tr>
                        {allColumns.map(
                        (col) =>
                            visibleColumns.includes(col.key) && (
                            <th
                                key={col.key}
                                className="border p-2 cursor-pointer"
                                onClick={() => handleSort(col.key)}
                            >
                                {col.label}{' '}
                                {sortBy === col.key ? (order === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            )
                        )}
                        <th className="border p-2">Options</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length ? (
                        data.map((user: any) => (
                            <tr key={user.id}>
                                {allColumns.map(
                                    (col) =>
                                    visibleColumns.includes(col.key) && (
                                        <td key={col.key} className="border p-2 text-center">
                                        {user[col.key]}
                                        </td>
                                    )
                                )}
                                <td className="border p-2 text-center">
                                    <div className='flex items-center justify-center gap-2'>
                                        <button className="cursor-pointer text-center" onClick={() => openUpdateUserModal(user.id)}>
                                            <img src='/editIcon.svg'/>
                                        </button>
                                        <button className="cursor-pointer text-center" onClick={() => openDeleteUserModal(user.id)}>
                                            <img src='/deleteIcon.svg'/>
                                        </button>
                                    </div>
                                </td>
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
            <UserModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedUser(null); }}
                onSave={handleSave}
                onDelete={handleDelete}
                initialData={selectedUser}
                deleteUserAction={deleteUserAction}
            />
        </div>
        
    );
};

export default DataTable;
