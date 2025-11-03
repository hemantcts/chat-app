import React from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'

const UsersTab = ({selectAll, handleSelectAllChange, loading, filteredUsers, selectedUserIds, handleCheckboxChange, formData, editingUserId, handleInputChange, companies, handleSaveClick, handleEditClick , setEditingUserId}) => {
    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            <Form.Check
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                            />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Department</th>
                        <th>Company</th>
                        <th>Access Level</th>
                        <th>Create Group Access</th>
                        <th>One-on-One Chat Access</th>
                        <th>App Access</th>
                        <th>Delete Message Access</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index}>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton width={170} /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                            </tr>
                        ))
                    ) : (
                        filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedUserIds.includes(user._id)}
                                        onChange={() => handleCheckboxChange(user._id)}
                                    />
                                </td>
                                <td>
                                    {editingUserId === user._id ? (
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user._id ? (
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user._id ? (
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Leave empty to keep current password"
                                        />
                                    ) : (
                                        '******'
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user._id ? (
                                        <Form.Control
                                            as="select"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="Operations Team">Operations Team</option>
                                            <option value="Accounts Team">Accounts Team</option>
                                            <option value="Quality Team">Quality Team</option>
                                            <option value="Customer Service Team">Customer Service Team</option>
                                            <option value="Contractor Management">Contractor Management</option>
                                            <option value="Contractor">Contractor</option>
                                            <option value="driver">Driver</option>
                                            <option value="jockey">Jockey</option>
                                        </Form.Control>
                                    ) : (
                                        user.department
                                    )}
                                </td>
                                {user?.company ?
                                    (
                                        <td>
                                            {(editingUserId === user._id) ? (
                                                <Form.Control
                                                    as="select"
                                                    name="companyCode"
                                                    value={formData?.companyCode}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    {companies.map((company) => (
                                                        <option key={company?._id} value={company?.companyCode}>
                                                            {company?.companyName} ({company?.companyCode})
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            ) : (
                                                `${user?.company?.companyName} (${user?.company?.companyCode})`
                                            )}
                                        </td>
                                    ) : (
                                        <td> - </td>
                                    )}
                                {user?.accessLevel ?
                                    (
                                        <td>
                                            {(editingUserId === user._id) ? (
                                                <Form.Control
                                                    as="select"
                                                    name="accessLevel"
                                                    value={formData?.accessLevel}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="1">L1</option>
                                                    <option value="2">L2</option>
                                                    <option value="3">L3</option>
                                                    <option value="4">L4</option>
                                                </Form.Control>
                                            ) : (
                                                `${'L' + user?.accessLevel}`
                                            )}
                                        </td>
                                    ) : (
                                        <td> - </td>
                                    )}
                                <td>
                                    {/* {editingUserId === user._id ? (
                                            <Form.Check
                                                type="checkbox"
                                                name="groupCreateAccess"
                                                className='m-0'
                                                checked={formData.groupCreateAccess}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            user.groupCreateAccess ? 'Yes' : 'No'
                                        )} */}
                                    {(user?.role === 1 || user?.accessLevel === 3 || user?.accessLevel === 4 || user?.department === 'Contractor Management' || user?.department === 'Contractor') ? <svg width="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#1ee0ac" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> : <svg width="27px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 8L8 16M8.00001 8L16 16" stroke="#e85347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>}
                                </td>
                                <td>
                                    {/* {editingUserId === user._id ? (
                                            <Form.Check
                                                type="checkbox"
                                                name="oneOnOneAccess"
                                                checked={formData.oneOnOneAccess}
                                                onChange={handleInputChange}
                                            />
                                        ) : ( */}
                                    {(user?.role === 1 || user?.accessLevel === 3 || user?.accessLevel === 4 || user?.department === 'Contractor Management') ? <svg width="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#1ee0ac" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> : <svg width="27px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 8L8 16M8.00001 8L16 16" stroke="#e85347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>}
                                    {/* )} */}
                                </td>
                                <td>
                                    {/* {editingUserId === user._id ? (
                                            <Form.Check
                                                type="checkbox"
                                                name="appAccess"
                                                checked={formData.appAccess}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            user.appAccess ? 'Yes' : 'No'
                                        )} */}
                                    {(user?.role === 1 || user?.accessLevel === 3 || user?.accessLevel === 4 || user?.department === 'Contractor Management' || user?.department === 'Contractor' || user?.department === 'driver' || user?.department === 'jockey') ? <svg width="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#1ee0ac" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> : <svg width="27px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 8L8 16M8.00001 8L16 16" stroke="#e85347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>}
                                </td>
                                <td>
                                    {/* {editingUserId === user._id ? (
                                            <Form.Check
                                                type="checkbox"
                                                name="deleteMessageAccess"
                                                checked={formData.deleteMessageAccess}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            user.deleteMessageAccess ? 'Yes' : 'No'
                                        )} */}

                                    {(user?.role === 1 || user?.accessLevel === 3 || user?.accessLevel === 4 || user?.accessLevel === 2) ? <svg width="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#1ee0ac" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> : <svg width="27px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 8L8 16M8.00001 8L16 16" stroke="#e85347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>}
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
                                        user.active ? 'Active' : 'Inactive'
                                    )}
                                </td>
                                <td style={{ display: 'flex', border: '0' }}>
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
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

            </Table>
        </>
    )
}

export default UsersTab