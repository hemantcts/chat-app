import React, { useEffect, useState } from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import { toast } from 'react-toastify'

const CompanyTab = ({ selectAll, handleSelectAllChange, loading, filteredUsers, selectedUserIds, handleCheckboxChange, formData, editingUserId, handleInputChange, handleSaveClick, handleEditClick, setEditingUserId, companies }) => {

    // const [companies, setCompanies] = useState([])

    // const fetchCompanies = async () => {
    //     try {
    //         const res = await fetch('https://chat.quanteqsolutions.com/api/admin/companies', {
    //             headers: {
    //                 'Authorization': localStorage.getItem('token'),
    //             },
    //         });
    //         const data = await res.json();

    //         console.log('comany', data.companies)

    //         if (data.status) {
    //             setCompanies(data.companies || []);
    //         } else {
    //             toast.error(data.message || 'Error!');
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         toast.error('Error fetching users');
    //     }
    // };

    // useEffect(() => {
    //     fetchCompanies()
    // }, [])

    

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {/* <th>
                            <Form.Check
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                            />
                        </th> */}
                        <th>Company Name</th>
                        <th>Company Code</th>
                        <th>Status</th>
                        {/* <th>Actions</th> */}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index}>
                                {/* <td><Skeleton /></td> */}
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                            </tr>
                        ))
                    ) : (
                        companies.map((user) => (
                            <tr key={user._id}>
                                {/* <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedUserIds.includes(user._id)}
                                        onChange={() => handleCheckboxChange(user._id)}
                                    />
                                </td> */}
                                <td>
                                    {editingUserId === user._id ? (
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.companyName
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user._id ? (
                                        <Form.Control
                                            type="text"
                                            name="email"
                                            value={formData.companyCode}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.companyCode
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user._id ? (
                                        <Form.Check
                                            type="checkbox"
                                            name="active"
                                            checked={formData.active}
                                            onChange={handleInputChange}
                                        />

                                    ) : (
                                        // user.active ? 'Active' : 'Inactive'
                                        'Active'
                                    )}
                                </td>
                                {/* <td style={{ display: 'flex', border: '0' }}>
                                    {editingUserId === user._id ? (
                                        <>
                                            <Button variant="success" size="sm" onClick={() => handleSaveClick(user._id)} style={{ padding: '0', marginRight: '0.5rem' }}>
                                                <svg width="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Button>{' '}
                                            <Button variant="danger" size="sm" onClick={() => setEditingUserId(null)} style={{ padding: '0' }}>
                                                <svg width="27px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M16 8L8 16M8.00001 8L16 16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="primary" size="sm" onClick={() => handleEditClick(user)}>
                                            Edit
                                        </Button>
                                    )}
                                </td> */}
                            </tr>
                        ))
                    )}
                </tbody>

            </Table>
        </>
    )
}

export default CompanyTab