import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import _ from 'lodash';

// reactstrap components
import {
    Button,
    Container,
    Row,
    Col,
    Card,
    CardImg,
    CardBody,
    CardTitle,
    CardText, FormGroup, Label, Input,
} from "reactstrap";
import {SEARCH_STATUS} from "../../utils/enum";

// core components

const mapStateToProps = (state) => ({
    query: state.search.query,
    status: state.search.status,
    result: state.search.result,
    filters: state.search.filters,
});

function Filter(props) {
    const { data } = props;
    return data.map((datum, index) =>
        <FormGroup check inline key={`${index}_${datum}`}>
            <Label check>
                <Input
                    defaultValue="option1"
                    id="inlineCheckbox1"
                    type="checkbox"
                />
                {datum}
                <span className="form-check-sign">
            <span className="check"/>
          </span>
            </Label>
        </FormGroup>
    )
}

function Item(props) {
    const { imageUrl, name, description, brand, material, feature, origin, size, tapeColor, teethColor, use } = props;
    return (
        <Card style={{ width: "20rem", height: '35rem' }} data-background-color="white" className="d-flex flex-column">
            <CardImg alt={name} src={imageUrl} top style={{ height: '320px', objectFit: 'cover' }}/>
            <CardBody className="d-flex flex-column flex-grow-1">
                <CardTitle tag="h4" className="text-dark mt-0">{name}</CardTitle>
                <CardText className="text-dark flex-grow-1">
                    {_.truncate(description, { length: 150 })}
                </CardText>
                {
                    /*
                        <div className="bg-dark">
                            <Row><Col md={4}>Brand:</Col><Col className="text-left">{brand}</Col></Row>
                            <Row><Col md={4}>Material:</Col><Col className="text-left">{material.join(", ")}</Col></Row>
                            <Row><Col md={4}>Origin:</Col><Col className="text-left">{origin}</Col></Row>
                            <Row><Col md={4}>Feature:</Col><Col className="text-left">{feature.join(", ")}</Col></Row>
                            <Row><Col md={4}>Usage:</Col><Col className="text-left">{use.join(", ")}</Col></Row>
                            <Row><Col md={4}>Size:</Col><Col className="text-left">{size.join(", ")}</Col></Row>
                            <Row><Col md={4}>Tape:</Col><Col className="text-left">{tapeColor.join(", ")}</Col></Row>
                            <Row><Col md={4}>Teeth:</Col><Col className="text-left">{teethColor.join(", ")}</Col></Row>
                        </div>
                     */
                }
            </CardBody>
        </Card>
    )
}

function Search(props) {
    const { query, status, result, filters } = props;
    const filterState = useState(filters);

    const updateFilter = useCallback((key, category) => {
    }, [filterState]);

    return (
        <>
          <div
            className="section"
            data-background-color="black"
            id="search-section"
          >
              {
                status !== SEARCH_STATUS.IDLE &&
                  <Container style={{ minHeight: '100vh' }}>
                      <Row className="justify-content-md-center">
                          <Col className="text-center" lg="8" md="12">
                              <h5 className="description">What are you looking for?</h5>
                              <h3 className="title">{query}</h3>
                          </Col>
                      </Row>
                      {
                          <div className="mb-4">
                              <Row><Col md={2} className="mt-2">Brand:</Col><Col><Filter data={filters.brands} onChange={(key) => {}}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Material:</Col><Col><Filter data={filters.materials}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Origin:</Col><Col><Filter data={filters.origins}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Feature:</Col><Col><Filter data={filters.features}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Usage:</Col><Col><Filter data={filters.usages}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Size:</Col><Col><Filter data={filters.sizes}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Tape Color:</Col><Col><Filter data={filters.tapeColors}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Teeth Color:</Col><Col><Filter data={filters.teethColors}/></Col></Row>
                          </div>
                      }
                      {
                          status === SEARCH_STATUS.SEARCHING &&
                              <Row className="justify-content-md-center">
                                  <Col className="text-center" lg="8" md="12">
                                      <i className="fas fa-spinner fa-spin" />
                                  </Col>
                              </Row>
                      }
                      {
                          status === SEARCH_STATUS.SUCCESS &&
                              <Row className="justify-content-md-center">
                                  {
                                      result.map((item, index) =>
                                          <Col className="text-center" key={`${item.name}_${index}`}>
                                            <Item {...item} />
                                          </Col>
                                      )
                                  }
                              </Row>
                      }
                  </Container>
              }
          </div>
        </>
    );
}

export default connect(mapStateToProps)(Search);