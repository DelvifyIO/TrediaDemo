import React, { useCallback, useState, useEffect } from "react";
import _ from 'lodash';
import csv from 'csvtojson';

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import IndexHeader from "components/Headers/IndexHeader.js";
import DarkFooter from "components/Footers/DarkFooter.js";

// sections for this page
import Search from "./index-sections/Search.js";
import {UPLOAD_STATUS} from "../utils/enum";
import { useDropzone } from 'react-dropzone';
import {Button, Col, Container, Form, Input, Label, Modal, Row, Table, UncontrolledTooltip} from "reactstrap";
import csvFile from '../assets/img/file-csv.svg';
import FormGroup from "reactstrap/es/FormGroup";
import Tooltip from "reactstrap/es/Tooltip";

function NewModal(props){
  const { onClose, isModalOpen, onAddRow, onEditRow, defaultData } = props;
  const [values, setValues] = useState(defaultData || {});

  useEffect(() => {
    if (defaultData) {
      setValues(defaultData);
    }
  }, [defaultData]);

  const submit = useCallback((e) => {
    e.preventDefault();
    if (defaultData) {
      onEditRow(values);
    } else {
      onAddRow(values);
    }
    onClose();
  }, [values]);

  const updateValue = useCallback((e) => {
    const temp = _.clone(values);
    temp[e.target.id] = e.target.value;
    setValues(temp);
  }, [values]);
  return (
      <>
        <Modal toggle={onClose} isOpen={isModalOpen} modalTransition={{ timeout: 50 }} autoFocus size="lg">

          <Form onSubmit={submit}>
          <div className="modal-header">
            <h5 className="modal-title">New Item</h5>
            <button
                aria-label="Close"
                className="close"
                type="button"
                onClick={onClose}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body">
              <FormGroup className="row">
                <Label htmlFor="modelNumber" sm="2">Model Number</Label>
                <Col sm="10">
                  <Input
                      id="modelNumber"
                      placeholder="Model Number"
                      onChange={updateValue}
                      value={values.modelNumber}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Label htmlFor="description" sm="2">Description</Label>
                <Col sm="10">
                  <Input
                      id="description"
                      placeholder="Description"
                      onChange={updateValue}
                      value={values.description}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Label htmlFor="brandName" sm="2">Brand Name</Label>
                <Col sm="10">
                  <Input
                      id="brandName"
                      placeholder="Brand Name"
                      onChange={updateValue}
                      value={values.brandName}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Label htmlFor="material" sm="2">Material</Label>
                <Col sm="10">
                  <Input
                      id="material"
                      placeholder="Material"
                      onChange={updateValue}
                      value={values.material}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Label htmlFor="size" sm="2">Size</Label>
                <Col sm="10">
                  <Input
                      id="size"
                      placeholder="Size"
                      onChange={updateValue}
                      value={values.size}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Label htmlFor="color" sm="2">Color</Label>
                <Col sm="10">
                  <Input
                      id="color"
                      placeholder="Color"
                      onChange={updateValue}
                      value={values.color}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Label htmlFor="placeOfOrigin" sm="2">Place of Origin</Label>
                <Col sm="10">
                  <Input
                      id="placeOfOrigin"
                      placeholder="Place of Origin"
                      onChange={updateValue}
                      value={values.placeOfOrigin}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Label htmlFor="moq" sm="2">MOQ</Label>
                <Col sm="10">
                  <Input
                      id="moq"
                      placeholder="MOQ"
                      onChange={updateValue}
                      value={values.moq}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Label htmlFor="qualityCertification" sm="2">Quality Certification</Label>
                <Col sm="10">
                  <Input
                      id="qualityCertification"
                      placeholder="Quality Certification"
                      onChange={updateValue}
                      value={values.qualityCertification}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Label htmlFor="imageURL" sm="2">Image URL</Label>
                <Col sm="10">
                  <Input
                      id="imageURL"
                      placeholder="Image URL"
                      onChange={updateValue}
                      value={values.imageURL}
                  />
                </Col>
              </FormGroup>
          </div>
          <div className="modal-footer">
            <Button color="secondary">
              Close
            </Button>
            <Button color="primary" type="submit">
              Save changes
            </Button>
          </div>

        </Form>
        </Modal>
      </>
  );
}

function Upload() {
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState(UPLOAD_STATUS.EMPTY);
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const editRow = useCallback((values) => {
    const temp = _.clone(rows);
    temp[editIndex] = values;
    setRows(temp);
    setEditData(null);
    setEditIndex(null);
  }, [rows, editIndex]);

  const addRow = useCallback((values) => {
    const temp = _.clone(rows);
    temp.push(values);
    setRows(temp);
  }, [rows]);

  const toggleModal = useCallback((data, index) => {
    if(data) {
      setEditData(data);
      setEditIndex(index);
    }
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const onDropAccepted = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    setError(null);
    setFile({ file: file, name: file.name, type: file.type, size: file.size });
    setStatus(UPLOAD_STATUS.UPLOADING);
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onprogress = (progress) => {
      setUploadProgress((progress.loaded/progress.total) * 100);
    };
    reader.onload = () => {
      csv()
          .fromString(reader.result)
          .then((json) => {
            setRows(json);
          });
      setTimeout(() => {
        setStatus(UPLOAD_STATUS.UPLOADED);
      }, 500);
    }
  }, []);

  const onDropRejected = useCallback((rejectedFiles) => {
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDropAccepted, onDropRejected, multiple: false });


  return (
    <>
      <IndexNavbar />
      <div className="page-header clear-filter d-flex flex-column" filter-color="blue">
        <div
            className="page-header-image"
            style={{
              backgroundColor: "#0f1d12",
            }}
        />
        <Container className="d-flex flex-column flex-grow-1">
          <div className="d-flex flex-column flex-grow-1">

            <div className="bg-light flex-grow-1 p-2 text-black-50" style={{ borderRadius: '10px' }} color="primary">
              <h3>Create a new RFP</h3>
              <Table hover responsive>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Model#</th>
                  <th>Description</th>
                  <th>Brand Name</th>
                  <th>Material</th>
                  <th>Size</th>
                  <th>Color</th>
                  <th>Place of Origin</th>
                  <th>MOQ</th>
                  <th>Quality Certification</th>
                  <th>Image URL</th>
                </tr>
                </thead>
                <tbody>
                {
                  rows.map((row, index) =>
                      <tr key={`table_row_${index}`} style={{ cursor: 'pointer' }} onClick={() => toggleModal(row, index)}>
                        <td>{index+1}</td>
                        <td>{row.modelNumber}</td>
                        <td>{_.truncate(row.description, {length: 10})}</td>
                        <td>{row.brandName}</td>
                        <td>{row.material}</td>
                        <td>{row.size}</td>
                        <td>{row.color}</td>
                        <td>{row.placeOfOrigin}</td>
                        <td>{row.moq}</td>
                        <td>{row.qualityCertification}</td>
                        <td>{_.truncate(row.imageURL, {length: 10})}</td>
                      </tr>
                  )
                }
                </tbody>
              </Table>
              <Row className="float-right no-gutters">
                <Button size="sm" color="info" onClick={toggleModal}><i className="now-ui-icons ui-1_simple-add mr-2"/> New</Button>
                <Button size="sm" color="success" disabled={rows.length <= 0}>Send</Button>
              </Row>

              <NewModal onClose={toggleModal} isModalOpen={isModalOpen} onAddRow={addRow} onEditRow={editRow} defaultData={editData} />
            </div>

            <div className="d-flex justify-content-center align-items-center mt-2 mb-2">
              <div className="bg-light flex-grow-1" style={{ height: '1px' }}/>
              <span className="ml-2 mr-2">OR</span>
              <div className="bg-light flex-grow-1" style={{ height: '1px' }}/>
            </div>

            <div
                className="align-items-center d-flex flex-column border-white pt-2"
                style={ isDragActive ? { border: '3px dashed', borderRadius: '10px', backgroundColor: '#103e56', cursor: 'pointer' } : { borderRadius: '10px', backgroundColor: '#103e56', cursor: 'pointer'} }
                {...getRootProps()}
            >
              <input {...getInputProps()} />
              {
                file ?
                    <div className="mb-2 text-center">
                      <img src={csvFile} style={{ height: '50px' }} alt={file.name} />
                      <div className="mt-1">{`${file.name} • ${(file.size / 1024).toFixed(2)}KB`}</div>
                    </div> :
                    <div><i className="now-ui-icons arrows-1_cloud-upload-94" style={{ fontSize: '50px' }} /></div>
              }

              <div>
                    <span><Button type="submit" size="sm" color="info">
                      Choose a file
                    </Button> or drag it here</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Upload;
