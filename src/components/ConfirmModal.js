import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({ show, handleClose, onConfirm, title, message, container }) => {
    const isDarkMode = window.ChatWidget?.config?.isDarkMode || true;
    return (
        <Modal show={show} onHide={handleClose} centered container={container}>

            {/* Custom Header */}
            <Modal.Header style={{ border: 0, paddingBottom: 0 }}>
                <button
                    type="button"
                    aria-label="Close"
                    onClick={handleClose}
                    style={{
                        padding: 0,
                        backgroundColor: "transparent",
                        border: 0,
                        marginLeft: "auto",
                        minWidth: "unset",
                    }}
                >
                    {isDarkMode ?
                        (
                            <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.7871 3.5C11.7934 3.5 3.84961 11.4437 3.84961 21.4375C3.84961 31.4312 11.7934 39.375 21.7871 39.375C31.7809 39.375 39.7246 31.4312 39.7246 21.4375C39.7246 11.4437 31.7809 3.5 21.7871 3.5ZM21.7871 36.8125C13.3309 36.8125 6.41211 29.8937 6.41211 21.4375C6.41211 12.9812 13.3309 6.0625 21.7871 6.0625C30.2434 6.0625 37.1621 12.9812 37.1621 21.4375C37.1621 29.8937 30.2434 36.8125 21.7871 36.8125Z" style={{fill:"var(--chat-name-color)" }}></path>
                                <path d="M28.8535 30.5977L21.7871 23.5313L14.7207 30.5977L12.627 28.5039L19.6934 21.4375L12.627 14.3711L14.7207 12.2773L21.7871 19.3437L28.8535 12.2773L30.9473 14.3711L23.8809 21.4375L30.9473 28.5039L28.8535 30.5977Z" style={{fill:"var(--chat-name-color)" }}></path>
                            </svg>
                        ) : (
                            <img src="https://socceryou.ch/assets/images/close-grey-icon.png" alt="" />
                        )
                    }
                </button>
            </Modal.Header>

            {/* Body */}
            <Modal.Body style={{ paddingBottom: 0 }}>
                <p className="mb-0 text-center">
                    {message ||
                        "Do you want to permanently delete this conversation? This action cannot be undone."}
                </p>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer style={{ border: 0, padding: "1.5rem 1rem", justifyContent: 'center' }}>
                <Button variant="danger" onClick={handleClose}>
                    Cancel
                </Button>

                {title === "Confirm Remove Member" ? (
                    <Button variant="secondary" onClick={onConfirm}>
                        Remove
                    </Button>
                ) : (
                    <Button variant="secondary"  onClick={onConfirm}>
                        Delete
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;