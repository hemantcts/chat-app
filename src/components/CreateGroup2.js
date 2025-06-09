import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreateGroup2 = () => {
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loggedInUser = JSON.parse(localStorage.getItem('userData'))

    useEffect(() => {
        // Fetch list of users
        const fetchUsers = async () => {
            try {
                const res = await fetch('https://chat.quanteqsolutions.com/api/users', {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                const data = await res.json();

                if(data.status){
                    const allUsers = data.users;
        
                    console.log('login users,', allUsers)
        
                    const filteredUsers = allUsers.filter(user => user._id != loggedInUser._id);
                    setUsers(filteredUsers || []);
        
                    setLoading(false);
                }
                else{
                    toast.error(data.message || 'error!');
                }
                    
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName || selectedUsers.length === 0) {
            //   alert('Please provide a group name and select users.');
            toast.info('enter valid group details')
            return;
        }

        try {
            const response = await fetch('https://chat.quanteqsolutions.com/api/groups/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    name: groupName,
                    members: selectedUsers
                })
            });

            const data = await response.json();
            console.log(data);
            if(data.status){
                // toast.success(data._id || 'Group created!');
                navigate(`/dashboard/chat?group=${data.group._id}`)
            }
            else{
                toast.error(data.message || 'error!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error creating group');
        }
    };

    return (
        <div className="nk-chat-body profile-shown pe-0">
            {/* <ToastContainer /> */}

            <div className="nk-chat-head group-create-form">
                <Form className='w-100' onSubmit={handleSubmit} >
                    <Form.Group className="mb-3">
                        {/* <Form.Label>Group Name</Form.Label> */}
                        <Form.Control
                            type="text"
                            placeholder='Group Name'
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        {/* <Form.Label>Select Users</Form.Label> */}
                        {loading ? (
                            <Spinner animation="border" />
                        ) : (
                            <Multiselect
                                options={users} // Options to display in the dropdown
                                selectedValues={selectedUsers} // Currently selected values (state)
                                onSelect={(selectedList) => setSelectedUsers(selectedList)} // Selection handler
                                onRemove={(selectedList) => setSelectedUsers(selectedList)} // Removal handler
                                displayValue="name"
                                placeholder='Enter name'
                            />
                        )}
                    </Form.Group>

                    <Button type="submit">Create Group</Button>
                </Form>
            </div>
            <div className="nk-chat-panel" data-simplebar>

            </div>
            {/* <div className="nk-chat-editor">
                <div className="nk-chat-editor-upload  ml-n1">
                    <a href="#" className="btn btn-sm btn-icon btn-trigger text-primary toggle-opt" data-target="chat-upload"><em className="icon ni ni-plus-circle-fill"></em></a>
                    <div className="chat-upload-option" data-content="chat-upload">
                        <ul className="">
                            <li><a href="#"><em className="icon ni ni-img-fill"></em></a></li>
                            <li><a href="#"><em className="icon ni ni-camera-fill"></em></a></li>
                            <li><a href="#"><em className="icon ni ni-mic"></em></a></li>
                            <li><a href="#"><em className="icon ni ni-grid-sq"></em></a></li>
                        </ul>
                    </div>
                </div>
                <div className="nk-chat-editor-form">
                    <div className="form-control-wrap">
                        <textarea className="form-control form-control-simple no-resize" rows="1" id="default-textarea" onClick={handleSubmit} placeholder="Type your message..."></textarea>
                    </div>
                </div>
                <ul className="nk-chat-editor-tools g-2">
                    <li>
                        <a href="#" className="btn btn-sm btn-icon btn-trigger text-primary"><em className="icon ni ni-happyf-fill"></em></a>
                    </li>
                    <li>
                        <button className="btn btn-round btn-primary btn-icon"><em className="icon ni ni-send-alt"></em></button>
                    </li>
                </ul>
            </div> */}
            
        </div>
    )
}

export default CreateGroup2
