import React, { useState, useCallback, useEffect } from "react";
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
import {setFilters} from "../../actions/searchAction";

// core components

const mapStateToProps = (state) => ({
    query: state.search.query,
    status: state.search.status,
    result: state.search.result,
    filters: state.search.filters,
});

function Filter(props) {
    const { data, onChange, category } = props;
    if (!data) return null;
    return Object.keys(data || {}).map((key, index) =>
        <FormGroup check inline key={`${index}_${key}`}>
            <Label check>
                <Input
                    defaultValue="option1"
                    id={`${category}_${key}`}
                    type="checkbox"
                    checked={data[key]}
                    onChange={() => onChange(category, key)}
                />
                {key}
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
    const [filterState, setFilterState] = useState(filters);
    const [resultState, setResultState] = useState(result);

    useEffect(() => {
        setFilterState(filters);
    }, [filters]);

    useEffect(() => {
        setResultState(result);
    }, [result]);

    const filteredKey = useCallback((array) => {
        return Object.keys(array).filter((key) => array[key]);
    }, []);

    const updateFilter = useCallback((category, key) => {
        const tempFilter = _.clone(filterState);
        tempFilter[category][key] = !tempFilter[category][key];
        setFilterState(tempFilter);

        const filteredResult = result.filter((item) => {
            return tempFilter['brands'][item.brand] &&
                _.intersection(item.material, filteredKey(tempFilter['materials'])).length > 0 &&
                tempFilter['origins'][item.origin] &&
                _.intersection(item.feature, filteredKey(tempFilter['features'])).length > 0 &&
                _.intersection(item.use, filteredKey(tempFilter['usages'])).length > 0 &&
                _.intersection(item.size, filteredKey(tempFilter['sizes'])).length > 0 &&
                _.intersection(item.tapeColor, filteredKey(tempFilter['tapeColors'])).length > 0 &&
                _.intersection(item.teethColor, filteredKey(tempFilter['teethColors'])).length > 0;
        });
        setResultState(filteredResult);

    }, [filterState, resultState]);



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
                              <Row><Col md={2} className="mt-2">Brand:</Col><Col><Filter category="brands" data={filterState.brands} onChange={updateFilter}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Material:</Col><Col><Filter category="materials" data={filterState.materials} onChange={updateFilter}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Origin:</Col><Col><Filter category="origins" data={filterState.origins} onChange={updateFilter}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Feature:</Col><Col><Filter category="features" data={filterState.features} onChange={updateFilter}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Usage:</Col><Col><Filter category="usages" data={filterState.usages} onChange={updateFilter}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Size:</Col><Col><Filter category="sizes" data={filterState.sizes} onChange={updateFilter}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Tape Color:</Col><Col><Filter category="tapeColors" data={filterState.tapeColors} onChange={updateFilter}/></Col></Row>
                              <Row><Col md={2} className="mt-2">Teeth Color:</Col><Col><Filter category="teethColors" data={filterState.teethColors} onChange={updateFilter}/></Col></Row>
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
                                      resultState.map((item, index) =>
                                          <Col className="text-center" key={`${item.name}_${index}`}>
                                            <Item {...item} />
                                          </Col>
                                      )
                                  }
                              </Row>
                      }
                      {
                          status === SEARCH_STATUS.ERROR &&
                              <Row className="justify-content-md-center">
                                  <Col className="text-center" lg="8" md="12">
                                      <span className="text-danger">Error</span>
                                  </Col>
                              </Row>
                      }
                  </Container>
              }
          </div>
        </>
    );
}

export default connect(mapStateToProps)(Search);