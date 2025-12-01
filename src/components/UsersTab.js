import React, { useState } from 'react'
import { Table, Form, Button, Modal } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'

const UsersTab = ({selectAll, handleSelectAllChange, loading, filteredUsers, selectedUserIds, handleCheckboxChange, formData, editingUserId, handleInputChange, companies, handleSaveClick, handleEditClick , setEditingUserId, loggedInUser}) => {

    const [showAccessModal, setShowAccessModal] = useState(false)

    const handleCheckAccess = () => {
        setShowAccessModal(true)
    }

    const handleCloseModal = () => {
        setShowAccessModal(false)
    }

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
                        <th>Department/Designation</th>
                        <th>Company</th>
                        <th>Access Level <em className="icon ni ni-info-fill" style={{color: '#3883F9', cursor: 'pointer'}} onClick={handleCheckAccess}></em></th>
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
                                        user?.department?.[0]?.toUpperCase() + user?.department?.slice(1) || ""
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
                                            {(editingUserId === user._id && loggedInUser?.accessLevel >= 4) ? (
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
                                        <td> {user?.department?.[0]?.toUpperCase() + user?.department?.slice(1) || ""} </td>
                                    )}
                                
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



            {/* Access Level Info Modal */}
            <Modal show={showAccessModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Access Levels</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Access Level</th>
                                <th>Web Access</th>
                                <th>App Access</th>
                                <th>Create Group Access</th>
                                <th>One-on-One Chat Access</th>
                                <th>Create User Access</th>
                                <th>Delete Message Access</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { level: "L1", group: false, oneOnOne: false, app: false, deleteMsg: false, web: true, createUser: false },
                                { level: "L2", group: false, oneOnOne: false, app: false, deleteMsg: true, web: true, createUser: false },
                                { level: "L3", group: true, oneOnOne: false, app: true, deleteMsg: true, web: true, createUser: true },
                                { level: "L4", group: true, oneOnOne: true, app: true, deleteMsg: true, web: true, createUser: true },
                                { level: "Driver / Jockey", group: false, oneOnOne: false, app: true, deleteMsg: false, web: false, createUser: false },
                                { level: "Contractor", group: true, oneOnOne: false, app: true, deleteMsg: false, web: false, createUser: false },
                                { level: "Contractor Management", group: true, oneOnOne: true, app: true, deleteMsg: false, web: false, createUser: false },
                            ].map((row) => (
                                <tr key={row.level}>
                                    <td><strong>{row.level}</strong></td>
                                    <td>{row.web ? '✅' : '❌'}</td>
                                    <td>{row.app ? '✅' : '❌'}</td>
                                    <td>{row.group ? '✅' : '❌'}</td>
                                    <td>{row.oneOnOne ? '✅' : '❌'}</td>
                                    <td>{row.createUser ? '✅' : '❌'}</td>
                                    <td>{row.deleteMsg ? '✅' : '❌'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer style={{justifyContent: 'start'}}>
                    <div>
                        <b>Legend:</b>
                        <b style={{color: 'green', marginLeft: '0.5rem'}}>✅ Allowed</b>
                        <b style={{color: 'red', marginLeft: '0.5rem'}}>❌ Not allowed</b>
                    </div>
                    {/* <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UsersTab