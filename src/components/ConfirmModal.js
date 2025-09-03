import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({ show, handleClose, onConfirm, title, message }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title || "Confirm Action"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="mb-0 text-center">
                    {message || "Are you sure you want to proceed?"}
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                {title !== 'Confirm Remove Member' && <Button variant="danger" onClick={onConfirm}>
                    Delete
                </Button>}
                {title === 'Confirm Remove Member' && <Button variant="danger" onClick={onConfirm}>
                    Remove
                </Button>}
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;
