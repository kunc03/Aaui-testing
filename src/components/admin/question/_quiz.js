import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Accordion, Card, Button } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export function _attach(message) {
    this.setState({
        statusImport: true,
		message: message
    })
};

export function _data(data) {
    this.setState({dataImport: data})
};