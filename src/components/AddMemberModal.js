import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AddMemberModal = ({ show, handleClose, onUserAdded, users, onlineUsers, addMembers, loggedInUser, companyId }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [hiddenMembers, setHiddenMembers] = useState([]); // 👈 track hidden users
    const [selectAll, setSelectAll] = useState(false);

    // Handle individual checkbox
    const handleCheckboxChange = (userId) => {
        setSelectedMembers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    // Handle hidden checkbox
    const handleHiddenChange = (userId) => {
        setHiddenMembers((prevHidden) =>
            prevHidden.includes(userId)
                ? prevHidden.filter((id) => id !== userId)
                : [...prevHidden, userId]
        );
    };

    // Handle "Select All" checkbox
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedMembers([]);
        } else {
            const allUserIds = users.map((user) => user._id);
            setSelectedMembers(allUserIds);
        }
        setSelectAll(!selectAll);
    };

    // Keep selectAll checkbox in sync
    useEffect(() => {
        if (selectedMembers.length === users.length && users.length > 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedMembers, users]);

    const handleSubmit = () => {
        addMembers(selectedMembers, hiddenMembers);
        handleClose()
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Members</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>

                    <div className='position-relative'>
                        <Form.Check
                            type="checkbox"
                            checked={selectAll}
                            label="Select All"
                            onChange={handleSelectAll}
                            
                        />
                        {/* <div className="form-icon form-icon-left ms-3">
                            <em className="icon ni ni-search"></em>
                        </div>
                        <Form.Control
                            type="text"
                            placeholder="Search by name or email"
                            className='form-round ms-3'
                        /> */}
                    </div>

                    <ul className='chat-list'>
                        {users.filter((user) => !user.company || user.company === companyId).map((user) => (
                            <li key={user._id} className="chat-item d-flex align-items-center">
                                <div className="chat-link chat-open current">
                                    <div className="checkbox">
                                        <Form.Check
                                            type="checkbox"
                                            className="add-member-checkbox"
                                            checked={selectedMembers.includes(user._id)}
                                            onChange={() => handleCheckboxChange(user._id)}
                                        />
                                    </div>
                                    <div className="chat-media user-avatar bg-purple" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com/${user?.imagePath})` }}>
                                        {!user?.imagePath && <span>{user?.name?.slice(0, 2).toUpperCase()}</span>}
                                        <span className={`status dot dot-lg ${onlineUsers[user._id] ? 'dot-success' : 'dot-gray'}`}></span>
                                    </div>
                                    <div className="chat-info">
                                        <div className="chat-from">
                                            <div className="name" style={{color: hiddenMembers.includes(user._id) && '#ccc'}}>{user?.name}</div>
                                            {/* {hiddenMembers.includes(user._id) && <div className="hidden">hidden</div>} */}
                                        </div>
                                        <div className="chat-context">
                                            <div className="text">{user?.department}</div>
                                        </div>
                                    </div>
                                </div>

                                {loggedInUser.role === 1 && <Form.Check
                                    type="checkbox"
                                    label="hide"
                                    checked={hiddenMembers.includes(user._id)}
                                    onChange={() => handleHiddenChange(user._id)}
                                />}
                            </li>
                        ))}
                    </ul>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={selectedMembers.length === 0}
                >
                    Add Members
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddMemberModal;
