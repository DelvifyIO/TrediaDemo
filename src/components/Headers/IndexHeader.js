/*eslint-disable*/
import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";

// reactstrap components
import {Col, Container, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Row} from "reactstrap";
import Button from "reactstrap/es/Button";
// core components

import { setQuery, setSearchingStatus, search } from "../../actions/searchAction";
import {SEARCH_STATUS} from "../../utils/enum";

import zippers from "../../assets/img/zippers.png";
import fasteners from "../../assets/img/fasteners.png";
import tags from "../../assets/img/tags.png";
import buttons from "../../assets/img/buttons.png";
import beads from "../../assets/img/beads.png";
import buckles from "../../assets/img/buckles.png";
import eyelets from "../../assets/img/eyelets.png";
import hooks from "../../assets/img/hooks.png";
import ribbons from "../../assets/img/ribbons.png";
import rhinestones from "../../assets/img/rhinestones.png";

const mapStateToProps = (state) => ({
    query: state.search.query,
});
const mapDispatchToProps = { setQuery, setSearchingStatus, search };


function CategoryButton(props) {
  const { icon, label, active } = props;
  return (
      <div
          style={{ border: 'solid 1px', borderRadius: '20px', width: '150px', height: '150px', cursor: 'pointer', opacity: active ? 1 : 0.5 }}
          className="d-flex flex-column justify-content-center align-items-center m-2 p-1"
      >
        <img src={icon} alt={label} className="mb-1" style={{ width: '90px' }} />
        <span style={{ lineHeight: '1.2em' }}>{label}</span>
      </div>
  )
}
function IndexHeader(props) {
  let pageHeader = React.createRef();

  const { query, setQuery, setSearchingStatus, search } = props;
  const [inputFocus, setInputFocus] = useState(false);
  useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });
  const onSearch = useCallback((e) => {
    e.preventDefault();
    setSearchingStatus(SEARCH_STATUS.SEARCHING)
        .then(() => {
            search(query);
            document
                .getElementById("search-section")
                .scrollIntoView();
        });
  }, [query]);

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/header.jpg") + ")"
          }}
          ref={pageHeader}
        />
        <Container>
          <div className="content-center brand" style={{ top: '45%' }}>
            <img
              alt="..."
              className="n-logo"
              src={require("assets/img/temp-logo.png")}
            />
            <h1 className="h1-seo">Tredia</h1>
            <Form onSubmit={onSearch}>
              <FormGroup>
                <h4>What are you looking for?</h4>
                <h2>
                  <InputGroup className={inputFocus ? "input-group-focus" : ""}>
                    <Input
                      className="bg-white"
                      defaultValue=""
                      placeholder="Describe part in as much detail as possible...."
                      type="text"
                      onFocus={() => setInputFocus(true)}
                      onBlur={() => setInputFocus(false)}
                      onChange={(e) => { setQuery(e.target.value); }}
                    />
                    <InputGroupAddon addonType="append">
                      <InputGroupText>
                        <Button color="neutral" outline={false} block={false} size={"size"} className="p-1 m-1 text-secondary">
                          <i className="fa fa-search"/>
                        </Button>
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </h2>
              </FormGroup>
            </Form>
            <Row className="flex-wrap justify-content-center align-items-center">
              <CategoryButton icon={zippers} label="Zippers and Sliders" active />
              <CategoryButton icon={fasteners} label="Fasteners" />
              <CategoryButton icon={tags} label="Labels and Tags" />
              <CategoryButton icon={buttons} label="Buttons" />
              <CategoryButton icon={beads} label="Beads" />
              <CategoryButton icon={buckles} label="Buckles" />
              <CategoryButton icon={eyelets} label="Eyelets" />
              <CategoryButton icon={hooks} label="Hooks" />
              <CategoryButton icon={ribbons} label="Ribbons" />
              <CategoryButton icon={rhinestones} label="Rhinestones" />
            </Row>

          </div>
        </Container>
      </div>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexHeader);
