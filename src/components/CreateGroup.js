import { useState, useEffect } from "react";
import React from 'react'
import AllUsers from "./AllUsers";

const CreateGroup = () => {
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
                
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="nk-content p-0 mt-0">
            <div className="nk-content-inner">
                <div className="nk-content-body">
                    <AllUsers />




                    {/* <div className="nk-ibx">
                        <div className="nk-ibx-aside" data-content="inbox-aside" data-toggle-overlay="true" data-toggle-screen="lg">
                            <div className="nk-ibx-head">
                                <div className="mr-n1"><a href="#" className="link link-text" data-toggle="modal" data-target="#compose-mail"><em className="icon-circle icon ni ni-plus"></em> <span>Compose Mail</span></a> </div>
                            </div>
                            <div className="nk-ibx-nav" data-simplebar>
                                <ul className="nk-ibx-menu">
                                    <li className="active">
                                        <a className="nk-ibx-menu-item" href="#">
                                            <em className="icon ni ni-inbox"></em>
                                            <span className="nk-ibx-menu-text">Inbox</span>
                                            <span className="badge badge-pill badge-primary">8</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="nk-ibx-menu-item" href="#">
                                            <em className="icon ni ni-edit"></em>
                                            <span className="nk-ibx-menu-text">Draft</span>
                                            <span className="badge badge-pill badge-light">12</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="nk-ibx-menu-item" href="#">
                                            <em className="icon ni ni-star"></em>
                                            <span className="nk-ibx-menu-text">Favourite</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="nk-ibx-menu-item" href="#">
                                            <em className="icon ni ni-send"></em>
                                            <span className="nk-ibx-menu-text">Sent</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="nk-ibx-menu-item" href="#">
                                            <em className="icon ni ni-report"></em>
                                            <span className="nk-ibx-menu-text">Spam</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="nk-ibx-menu-item" href="#">
                                            <em className="icon ni ni-trash"></em>
                                            <span className="nk-ibx-menu-text">Trash</span>
                                            <span className="badge badge-pill badge-danger badge-dim">8</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="nk-ibx-menu-item" href="#">
                                            <em className="icon ni ni-emails"></em>
                                            <span className="nk-ibx-menu-text">All Mails</span>
                                        </a>
                                    </li>
                                </ul>
                                <div className="nk-ibx-nav-head">
                                    <h6 className="title">Label</h6>
                                    <a className="link" href="#"><em className="icon ni ni-plus-c"></em></a>
                                </div>
                                <ul className="nk-ibx-label">
                                    <li>
                                        <a href="#"><span className="nk-ibx-label-dot dot dot-xl dot-label bg-primary"></span><span className="nk-ibx-label-text">Business</span></a>
                                        <div className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                            <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                                <ul className="link-list-opt no-bdr">
                                                    <li><a href="#"><span>Edit Label</span></a></li>
                                                    <li><a href="#"><span>Remove Label</span></a></li>
                                                    <li><a href="#"><span>Label Color</span></a></li>
                                                    <li className="divider"></li>
                                                </ul>
                                                <ul className="link-check">
                                                    <li><a href="#">Show if unread</a></li>
                                                    <li className="active"><a href="#">Show</a></li>
                                                    <li><a href="#">Hide</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <a href="#"><span className="nk-ibx-label-dot dot dot-xl dot-label bg-danger"></span><span className="nk-ibx-label-text">Personal</span></a>
                                        <div className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                            <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                                <ul className="link-list-opt no-bdr">
                                                    <li><a href="#"><span>Edit Label</span></a></li>
                                                    <li><a href="#"><span>Remove Label</span></a></li>
                                                    <li><a href="#"><span>Label Color</span></a></li>
                                                    <li className="divider"></li>
                                                </ul>
                                                <ul className="link-check">
                                                    <li><a href="#">If unread</a></li>
                                                    <li className="active"><a href="#">Show</a></li>
                                                    <li><a href="#">Hide</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <a href="#"><span className="nk-ibx-label-dot dot dot-xl dot-label bg-success"></span><span className="nk-ibx-label-text">Social</span></a>
                                        <div className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                            <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                                <ul className="link-list-opt no-bdr">
                                                    <li><a href="#"><span>Edit Label</span></a></li>
                                                    <li><a href="#"><span>Remove Label</span></a></li>
                                                    <li><a href="#"><span>Label Color</span></a></li>
                                                    <li className="divider"></li>
                                                </ul>
                                                <ul className="link-check">
                                                    <li><a href="#">Show if unread</a></li>
                                                    <li className="active"><a href="#">Show</a></li>
                                                    <li><a href="#">Hide</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <div className="nk-ibx-nav-head">
                                    <h6 className="title">Contact</h6>
                                    <a className="link" href="#"><em className="icon ni ni-plus-c"></em></a>
                                </div>
                                <ul className="nk-ibx-contact">
                                    <li>
                                        <a href="#">
                                            <div className="user-card">
                                                <div className="user-avatar"><img src="./images/avatar/a-sm.jpg" alt="" /></div>
                                                <div className="user-info">
                                                    <span className="lead-text">Abu Bin Ishtiyak</span>
                                                    <span className="sub-text">CEO of Softnio</span>
                                                </div>
                                            </div>
                                        </a>
                                        <div className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                            <div className="dropdown-menu dropdown-menu-xs dropdown-menu-right">
                                                <ul className="link-list-opt no-bdr">
                                                    <li><a href="#"><span>View Profile</span></a></li>
                                                    <li><a href="#"><span>Send Email</span></a></li>
                                                    <li><a href="#"><span>Start Chat</span></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="user-card">
                                                <div className="user-avatar"><img src="./images/avatar/b-sm.jpg" alt="" /></div>
                                                <div className="user-info">
                                                    <span className="lead-text">Dora Schmidt</span>
                                                    <span className="sub-text">VP Product Imagelab</span>
                                                </div>
                                            </div>
                                        </a>
                                        <div className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                            <div className="dropdown-menu dropdown-menu-xs dropdown-menu-right">
                                                <ul className="link-list-opt no-bdr">
                                                    <li><a href="#"><span>View Profile</span></a></li>
                                                    <li><a href="#"><span>Send Email</span></a></li>
                                                    <li><a href="#"><span>Start Chat</span></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="user-card">
                                                <div className="user-avatar"><img src="./images/avatar/c-sm.jpg" alt="" /></div>
                                                <div className="user-info">
                                                    <span className="lead-text">Jessica Fowler</span>
                                                    <span className="sub-text">Developer at Softnio</span>
                                                </div>
                                            </div>
                                        </a>
                                        <div className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                            <div className="dropdown-menu dropdown-menu-xs dropdown-menu-right">
                                                <ul className="link-list-opt no-bdr">
                                                    <li><a href="#"><span>View Profile</span></a></li>
                                                    <li><a href="#"><span>Send Email</span></a></li>
                                                    <li><a href="#"><span>Start Chat</span></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="user-card">
                                                <div className="user-avatar"><img src="./images/avatar/d-sm.jpg" alt="" /></div>
                                                <div className="user-info">
                                                    <span className="lead-text">Eula Flowers</span>
                                                    <span className="sub-text">Co-Founder of Vitzo</span>
                                                </div>
                                            </div>
                                        </a>
                                        <div className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                            <div className="dropdown-menu dropdown-menu-xs dropdown-menu-right">
                                                <ul className="link-list-opt no-bdr">
                                                    <li><a href="#"><span>View Profile</span></a></li>
                                                    <li><a href="#"><span>Send Email</span></a></li>
                                                    <li><a href="#"><span>Start Chat</span></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <div className="nk-ibx-status">
                                    <div className="nk-ibx-status-info">
                                        <em className="icon ni ni-hard-drive"></em>
                                        <span><strong>6 GB</strong> (5%) of 100GB used</span>
                                    </div>
                                    <div className="progress progress-md bg-light">
                                        <div className="progress-bar" data-progress="5"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="nk-ibx-body bg-white">
                            <div className="nk-ibx-head">
                                <div className="nk-ibx-head-actions">
                                    <div className="nk-ibx-head-check">
                                        <div className="custom-control custom-control-sm custom-checkbox">
                                            <input type="checkbox" className="custom-control-input nk-dt-item-check" id="conversionAll" />
                                            <label className="custom-control-label" for="conversionAll"></label>
                                        </div>
                                    </div>
                                    <ul className="nk-ibx-head-tools g-1">
                                        <li><a href="#" className="btn btn-icon btn-trigger"><em className="icon ni ni-undo"></em></a></li>
                                        <li className="d-none d-sm-block"><a href="#" className="btn btn-icon btn-trigger"><em className="icon ni ni-archived"></em></a></li>
                                        <li className="d-none d-sm-block"><a href="#" className="btn btn-icon btn-trigger"><em className="icon ni ni-trash"></em></a></li>
                                        <li>
                                            <div className="dropdown">
                                                <a href="#" className="dropdown-toggle btn btn-icon btn-trigger" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                                <div className="dropdown-menu">
                                                    <ul className="link-list-opt no-bdr">
                                                        <li><a className="dropdown-item" href="#"><em className="icon ni ni-eye"></em><span>Move to</span></a></li>
                                                        <li><a className="dropdown-item" href="#"><em className="icon ni ni-trash"></em><span>Delete</span></a></li>
                                                        <li><a className="dropdown-item" href="#"><em className="icon ni ni-archived"></em><span>Archive</span></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <ul className="nk-ibx-head-tools g-1">
                                        <li><a href="#" className="btn btn-trigger btn-icon btn-tooltip" title="Prev Page"><em className="icon ni ni-arrow-left"></em></a></li>
                                        <li><a href="#" className="btn btn-trigger btn-icon btn-tooltip" title="Next Page"><em className="icon ni ni-arrow-right"></em></a></li>
                                        <li><a href="#" className="btn btn-trigger btn-icon search-toggle toggle-search" data-target="search"><em className="icon ni ni-search"></em></a></li>
                                        <li className="mr-n1 d-lg-none"><a href="#" className="btn btn-trigger btn-icon toggle" data-target="inbox-aside"><em className="icon ni ni-menu-alt-r"></em></a></li>
                                    </ul>
                                </div>
                                <div className="search-wrap" data-search="search">
                                    <div className="search-content">
                                        <a href="#" className="search-back btn btn-icon toggle-search" data-target="search"><em className="icon ni ni-arrow-left"></em></a>
                                        <input type="text" className="form-control border-transparent form-focus-none" placeholder="Search by user or message" />
                                        <button className="search-submit btn btn-icon"><em className="icon ni ni-search"></em></button>
                                    </div>
                                </div>
                            </div>
                            <div className="nk-ibx-list" data-simplebar>
                                {users.map((user, index) => (
                                    <div className="nk-ibx-item" key={index}>
                                        <a href="#" className="nk-ibx-link"></a>
                                        <div className="nk-ibx-item-elem nk-ibx-item-check">
                                            <div className="custom-control custom-control-sm custom-checkbox">
                                                <input type="checkbox" className="custom-control-input nk-dt-item-check" id={`user_${index + 1}`} />
                                                <label className="custom-control-label" for={`user_${index + 1}`}></label>
                                            </div>
                                        </div>
                                        <div className="nk-ibx-item-elem nk-ibx-item-user">
                                            <div className="user-card">
                                                <div className="user-avatar">
                                                    <img src={user?.imagePath} alt="" />
                                                </div>
                                                <div className="user-name">
                                                    <div className="lead-text">{user?.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="nk-ibx-item-elem nk-ibx-item-fluid">
                                            <div className="nk-ibx-context-group">
                                                <div className="nk-ibx-context">
                                                    <span className="nk-ibx-context-text">
                                                        <span className="heading">{user?.email}</span> {user?.department} </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}


                            </div>
                            <div className="nk-ibx-view">
                                <div className="nk-ibx-head">
                                    <div className="nk-ibx-head-actions">
                                        <ul className="nk-ibx-head-tools g-1">
                                            <li className="ml-n2"><a href="#" className="btn btn-icon btn-trigger nk-ibx-hide"><em className="icon ni ni-arrow-left"></em></a></li>
                                            <li><a href="#" className="btn btn-icon btn-trigger btn-tooltip" title="Archive"><em className="icon ni ni-archived"></em></a></li>
                                            <li className="d-none d-sm-block"><a href="#" className="btn btn-icon btn-trigger btn-tooltip" title="Mark as Spam"><em className="icon ni ni-report"></em></a></li>
                                            <li><a href="#" className="btn btn-icon btn-trigger btn-tooltip" title="Delete"><em className="icon ni ni-trash"></em></a></li>
                                            <li><a href="#" className="btn btn-icon btn-trigger btn-tooltip" title="Label"><em className="icon ni ni-label"></em></a></li>
                                            <li>
                                                <div className="dropdown">
                                                    <a href="#" className="dropdown-toggle btn btn-icon btn-trigger" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                                    <div className="dropdown-menu">
                                                        <ul className="link-list-opt no-bdr">
                                                            <li><a className="dropdown-item" href="#"><span>Mark as unread</span></a></li>
                                                            <li><a className="dropdown-item" href="#"><span>Mark as not important</span></a></li>
                                                            <li><a className="dropdown-item" href="#"><span>Archive this message</span></a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="nk-ibx-head-actions">
                                        <ul className="nk-ibx-head-tools g-1">
                                            <li className="d-none d-sm-block"><a href="#" className="btn btn-icon btn-trigger btn-tooltip" title="Prev"><em className="icon ni ni-chevron-left"></em></a></li>
                                            <li className="d-none d-sm-block"><a href="#" className="btn btn-icon btn-trigger btn-tooltip" title="Next"><em className="icon ni ni-chevron-right"></em></a></li>
                                            <li className="mr-n1 mr-lg-0"><a href="#" className="btn btn-icon btn-trigger search-toggle toggle-search" data-target="search"><em className="icon ni ni-search"></em></a></li>
                                        </ul>
                                    </div>
                                    <div className="search-wrap" data-search="search">
                                        <div className="search-content">
                                            <a href="#" className="search-back btn btn-icon toggle-search" data-target="search"><em className="icon ni ni-arrow-left"></em></a>
                                            <input type="text" className="form-control border-transparent form-focus-none" placeholder="Search by user or message" />
                                            <button className="search-submit btn btn-icon"><em className="icon ni ni-search"></em></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="nk-ibx-reply nk-reply" data-simplebar>
                                    <div className="nk-ibx-reply-head">
                                        <div>
                                            <h4 className="title">Introducing New Dashboard</h4>
                                            <ul className="nk-ibx-tags g-1">
                                                <li className="btn-group is-tags">
                                                    <a className="btn btn-xs btn-primary btn-dim" href="#">Business</a>
                                                    <a className="btn btn-xs btn-icon btn-primary btn-dim" href="#"><em className="icon ni ni-cross"></em></a>
                                                </li>
                                                <li className="btn-group is-tags">
                                                    <a className="btn btn-xs btn-danger btn-dim" href="#">Management</a>
                                                    <a className="btn btn-xs btn-icon btn-danger btn-dim" href="#"><em className="icon ni ni-cross"></em></a>
                                                </li>
                                                <li className="btn-group is-tags">
                                                    <a className="btn btn-xs btn-info btn-dim" href="#">Team</a>
                                                    <a className="btn btn-xs btn-icon btn-info btn-dim" href="#"><em className="icon ni ni-cross"></em></a>
                                                </li>
                                            </ul>
                                        </div>
                                        <ul className="d-flex g-1">
                                            <li className="d-none d-sm-block">
                                                <a href="#" className="btn btn-icon btn-trigger btn-tooltip" title="Print"><em className="icon ni ni-printer"></em></a>
                                            </li>
                                            <li className="mr-n1">
                                                <div className="asterisk"><a className="btn btn-trigger btn-icon btn-tooltip" href="#"><em className="asterisk-off icon ni ni-star"></em><em className="asterisk-on icon ni ni-star-fill"></em></a></div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="nk-ibx-reply-group">
                                        <div className="nk-ibx-reply-item nk-reply-item">
                                            <div className="nk-reply-header nk-ibx-reply-header is-collapsed">
                                                <div className="nk-reply-desc">
                                                    <div className="nk-reply-avatar user-avatar bg-blue">
                                                        <span>AB</span>
                                                    </div>
                                                    <div className="nk-reply-info">
                                                        <div className="nk-reply-author lead-text">Abu Bin Ishtiyak <span className="date d-sm-none">14 Jan, 2020</span></div>
                                                        <div className="dropdown nk-reply-msg-info">
                                                            <a href="#" className="dropdown-toggle sub-text dropdown-indicator" data-toggle="dropdown">to Mildred</a>
                                                            <div className="dropdown-menu dropdown-menu-md">
                                                                <ul className="nk-reply-msg-meta">
                                                                    <li><span className="label">from:</span> <span className="info"><a href="#">info@softnio.com</a></span></li>
                                                                    <li><span className="label">to:</span> <span className="info"><a href="#">team@softnio.com</a></span></li>
                                                                    <li><span className="label">bcc:</span> <span className="info"><a href="#">team@softnio.com</a></span></li>
                                                                    <li><span className="label">mailed-by:</span> <span className="info"><a href="#">softnio.com</a></span></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="nk-reply-msg-excerpt">I am facing problem as i can not select currency on buy order page. Can you guys let me know what i am doing doing wrong? Please check attached files.</div>
                                                    </div>
                                                </div>
                                                <ul className="nk-reply-tools g-1">
                                                    <li className="attach-msg"><em className="icon ni ni-clip-h"></em></li>
                                                    <li className="date-msg"><span className="date">14 Jan, 2020</span></li>
                                                    <li className="replyto-msg"><a href="#" className="btn btn-trigger btn-icon btn-tooltip" title="Reply"><em className="icon ni ni-curve-up-left"></em></a></li>
                                                    <li className="more-actions">
                                                        <div className="dropdown">
                                                            <a href="#" className="dropdown-toggle btn btn-trigger btn-icon" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <ul className="link-list-opt no-bdr">
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-reply-fill"></em><span>Reply to</span></a></li>
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-forward-arrow-fill"></em><span>Forward</span></a></li>
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-trash-fill"></em><span>Delete this</span></a></li>
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-report-fill"></em><span>Report Spam</span></a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="nk-reply-body nk-ibx-reply-body">
                                                <div className="nk-reply-entry entry">
                                                    <p>Hello team,</p>
                                                    <p>I am facing problem as i can not select currency on buy order page. Can you guys let me know what i am doing doing wrong? Please check attached files.</p>
                                                    <p>Thank you <br /> Ishityak</p>
                                                </div>
                                                <div className="attach-files">
                                                    <ul className="attach-list">
                                                        <li className="attach-item">
                                                            <a className="download" href="#"><em className="icon ni ni-img"></em><span>error-show-On-order.jpg</span></a>
                                                        </li>
                                                        <li className="attach-item">
                                                            <a className="download" href="#"><em className="icon ni ni-img"></em><span>full-page-error.jpg</span></a>
                                                        </li>
                                                    </ul>
                                                    <div className="attach-foot">
                                                        <span className="attach-info">2 files attached</span>
                                                        <a className="attach-download link" href="#"><em className="icon ni ni-download"></em><span>Download All</span></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="nk-ibx-reply-item nk-reply-item">
                                            <div className="nk-reply-header nk-ibx-reply-header">
                                                <div className="nk-reply-desc">
                                                    <div className="nk-reply-avatar user-avatar bg-blue">
                                                        <img src="./images/avatar/c-sm.jpg" alt="" />
                                                    </div>
                                                    <div className="nk-reply-info">
                                                        <div className="nk-reply-author lead-text">Mildred Delgado <span className="date d-sm-none">18 Jan, 2020</span></div>
                                                        <div className="dropdown nk-reply-msg-info">
                                                            <a href="#" className="dropdown-toggle sub-text dropdown-indicator" data-toggle="dropdown">to Me</a>
                                                            <div className="dropdown-menu dropdown-menu-md">
                                                                <ul className="nk-reply-msg-meta">
                                                                    <li>
                                                                        <span className="label">from:</span>
                                                                        <span className="info"><a href="#">info@softnio.com</a></span>
                                                                    </li>
                                                                    <li><span className="label">to:</span> <span className="info"><a href="#">team@softnio.com</a></span></li>
                                                                    <li><span className="label">bcc:</span> <span className="info"><a href="#">team@softnio.com</a></span></li>
                                                                    <li><span className="label">mailed-by:</span> <span className="info"><a href="#">softnio.com</a></span></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="nk-reply-msg-excerpt">It would be great if you send me itiam ut neque in magna porttitor...</div>
                                                    </div>
                                                </div>
                                                <ul className="nk-reply-tools g-1">
                                                    <li className="date-msg"><span className="date">14 Jan, 2020</span></li>
                                                    <li className="replyto-msg"><a href="#" className="btn btn-trigger btn-icon btn-tooltip" title="Reply"><em className="icon ni ni-curve-up-left"></em></a></li>
                                                    <li className="more-actions">
                                                        <div className="dropdown">
                                                            <a href="#" className="dropdown-toggle btn btn-trigger btn-icon" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <ul className="link-list-opt no-bdr">
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-reply-fill"></em><span>Reply to</span></a></li>
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-forward-arrow-fill"></em><span>Forward</span></a></li>
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-trash-fill"></em><span>Delete this</span></a></li>
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-report-fill"></em><span>Report Spam</span></a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="nk-reply-body nk-ibx-reply-body">
                                                <div className="nk-reply-entry entry">
                                                    <p>Hello team,</p>
                                                    <p>I am facing problem as i can not select currency on buy order page. Can you guys let me know what i am doing doing wrong? Please check attached files.</p>
                                                    <p>Thank you <br /> Ishityak</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="nk-ibx-reply-item nk-reply-item">
                                            <div className="nk-reply-header nk-ibx-reply-header is-opened">
                                                <div className="nk-reply-desc">
                                                    <div className="nk-reply-avatar user-avatar bg-blue">
                                                        <span>AB</span>
                                                    </div>
                                                    <div className="nk-reply-info">
                                                        <div className="nk-reply-author lead-text">Abu Bin Ishtiyak <span className="date d-sm-none">20 Jan, 2020</span></div>
                                                        <div className="dropdown nk-reply-msg-info">
                                                            <a href="#" className="dropdown-toggle sub-text dropdown-indicator" data-toggle="dropdown">to Mildred</a>
                                                            <div className="dropdown-menu dropdown-menu-md">
                                                                <ul className="nk-reply-msg-meta">
                                                                    <li><span className="label">from:</span> <span className="info"><a href="#">info@softnio.com</a></span></li>
                                                                    <li><span className="label">to:</span> <span className="info"><a href="#">team@softnio.com</a></span></li>
                                                                    <li><span className="label">bcc:</span> <span className="info"><a href="#">team@softnio.com</a></span></li>
                                                                    <li><span className="label">mailed-by:</span> <span className="info"><a href="#">softnio.com</a></span></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="nk-reply-msg-excerpt">It would be great if you send me itiam ut neque in magna porttitor...</div>
                                                    </div>
                                                </div>
                                                <ul className="nk-reply-tools g-1">
                                                    <li className="date-msg"><span className="date">14 Jan, 2020</span></li>
                                                    <li className="replyto-msg"><a href="#" className="btn btn-trigger btn-icon btn-tooltip" title="Reply"><em className="icon ni ni-curve-up-left"></em></a></li>
                                                    <li className="more-actions">
                                                        <div className="dropdown">
                                                            <a href="#" className="dropdown-toggle btn btn-trigger btn-icon" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <ul className="link-list-opt no-bdr">
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-reply-fill"></em><span>Reply to</span></a></li>
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-forward-arrow-fill"></em><span>Forward</span></a></li>
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-trash-fill"></em><span>Delete this</span></a></li>
                                                                    <li><a className="dropdown-item" href="#"><em className="icon ni ni-report-fill"></em><span>Report Spam</span></a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="nk-reply-body nk-ibx-reply-body">
                                                <div className="nk-reply-entry entry">
                                                    <p>Hello team,</p>
                                                    <p>I am facing problem as i can not select currency on buy order page. Can you guys let me know what i am doing doing wrong? Please check attached files.</p>
                                                    <p>Thank you <br /> Ishityak</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="nk-ibx-reply-form nk-reply-form">
                                        <div className="nk-reply-form-header">
                                            <div className="nk-reply-form-group">
                                                <div className="nk-reply-form-dropdown">
                                                    <div className="dropdown">
                                                        <a className="btn btn-sm btn-trigger btn-icon" data-toggle="dropdown" href="#"><em className="icon ni ni-curve-up-left"></em></a>
                                                        <div className="dropdown-menu dropdown-menu-md">
                                                            <ul className="link-list-opt no-bdr">
                                                                <li><a className="dropdown-item" href="#"><em className="icon ni ni-reply-fill"></em> <span>Reply to Abu Bin Ishtiyak</span></a></li>
                                                                <li><a className="dropdown-item" href="#"><em className="icon ni ni-forward-arrow-fill"></em> <span>Forword</span></a></li>
                                                                <li className="divider"></li>
                                                                <li><a href="#"><em className="icon ni ni-edit-fill"></em> <span>Edit Subject</span></a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="nk-reply-form-title d-sm-none">Reply</div>
                                                <div className="nk-reply-form-input-group">
                                                    <div className="nk-reply-form-input nk-reply-form-input-to">
                                                        <label className="label">To</label>
                                                        <input type="text" value="info@softnio.com" className="input-mail tagify" placeholder="" data-whitelist="team@softnio.com, help@softnio.com, contact@softnio.com" />
                                                    </div>
                                                    <div className="nk-reply-form-input nk-reply-form-input-cc" data-content="mail-cc">
                                                        <label className="label">Cc</label>
                                                        <input type="text" className="input-mail tagify" />
                                                        <a href="#" className="toggle-opt" data-target="mail-cc"><em className="icon ni ni-cross"></em></a>
                                                    </div>
                                                    <div className="nk-reply-form-input nk-reply-form-input-bcc" data-content="mail-bcc">
                                                        <label className="label">Bcc</label>
                                                        <input type="text" className="input-mail tagify" />
                                                        <a href="#" className="toggle-opt" data-target="mail-bcc"><em className="icon ni ni-cross"></em></a>
                                                    </div>
                                                </div>
                                                <ul className="nk-reply-form-nav">
                                                    <li><a tabindex="-1" className="toggle-opt" data-target="mail-cc" href="#">CC</a></li>
                                                    <li><a tabindex="-1" className="toggle-opt" data-target="mail-bcc" href="#">BCC</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="nk-reply-form-editor">
                                            <div className="nk-reply-form-field">
                                                <textarea className="form-control form-control-simple no-resize" placeholder="Hello"></textarea>
                                            </div>
                                        </div>
                                        <div className="nk-reply-form-tools">
                                            <ul className="nk-reply-form-actions g-1">
                                                <li className="mr-2"><button className="btn btn-primary" type="submit">Send</button></li>
                                                <li>
                                                    <div className="dropdown">
                                                        <a className="btn btn-icon btn-sm btn-tooltip" data-toggle="dropdown" title="Templates" href="#"><em className="icon ni ni-hash"></em></a>
                                                        <div className="dropdown-menu">
                                                            <ul className="link-list-opt no-bdr link-list-template">
                                                                <li className="opt-head"><span>Quick Insert</span></li>
                                                                <li><a href="#"><span>Thank you message</span></a></li>
                                                                <li><a href="#"><span>Your issues solved</span></a></li>
                                                                <li><a href="#"><span>Thank you message</span></a></li>
                                                                <li className="divider" />
                                                                <li><a href="#"><em className="icon ni ni-file-plus"></em><span>Save as Template</span></a></li>
                                                                <li><a href="#"><em className="icon ni ni-notes-alt"></em><span>Manage Template</span></a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <a className="btn btn-icon btn-sm" data-toggle="tooltip" data-placement="top" title="Upload Attachment" href="#"><em className="icon ni ni-clip-v"></em></a>
                                                </li>
                                                <li>
                                                    <a className="btn btn-icon btn-sm" data-toggle="tooltip" data-placement="top" title="Upload Images" href="#"><em className="icon ni ni-img"></em></a>
                                                </li>
                                            </ul>
                                            <ul className="nk-reply-form-actions g-1">
                                                <li>
                                                    <div className="dropdown">
                                                        <a href="#" className="dropdown-toggle btn-trigger btn btn-icon" data-toggle="dropdown"><em className="icon ni ni-more-v"></em></a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <ul className="link-list-opt no-bdr">
                                                                <li><a href="#"><span>Another Option</span></a></li>
                                                                <li><a href="#"><span>More Option</span></a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <a href="#" className="btn-trigger btn btn-icon mr-n2"><em className="icon ni ni-trash"></em></a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default CreateGroup
