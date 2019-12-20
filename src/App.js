import React from "react";
import { Table, Button } from "antd";
import {
  getTable,
  updateDatabase,
  updateFromLocal,
  uploadFromLocal
} from "./api/query";
import { CSVLink } from "react-csv";
import { RiseLoader } from "react-spinners";

import { Input } from "antd";

import "antd/dist/antd.css";
import "./App.css";

const { Search } = Input;

const override = `
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      extractedTable: null,
      loading: false,
      hit_list: [],
      selectedFile: null
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateLocal = this.handleUpdateLocal.bind(this);
    this.handleUpdateOnline = this.handleUpdateOnline.bind(this);
    this.manualUploadHandler = this.manualUploadHandler.bind(this);
  }

  // handleChange(event) {
  //   this.setState({ value: event.target.value });
  // }
  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  async handleSubmit(value) {
    this.setState({ loading: true });
    // event.preventDefault(); //onSubmit has its own internal state, and thus refreshing the page
    var { extractedTable, hit_list } = await getTable(value);
    this.setState({
      extractedTable: extractedTable,
      loading: false,
      hit_list: hit_list
    });
  }

  async handleUpdateOnline() {
    this.setState({ loading: true });
    var res = await updateDatabase();
    this.setState({
      loading: !res
    });
  }

  async handleUpdateLocal() {
    this.setState({ loading: true });
    var res = await updateFromLocal();
    this.setState({
      loading: !res
    });
  }

  async manualUploadHandler() {
    console.log("Upload button clicked");
    this.setState({ loading: true });
    const data = new FormData();
    data.append("csvFile", this.state.selectedFile);
    var res = await uploadFromLocal(data);
    this.setState({
      loading: !res
    });
  }

  render() {
    const columns = [
      {
        title: "HTS Code",
        dataIndex: 0,
        key: "0"
      },
      {
        title: "Indent",
        dataIndex: 1,
        key: "1"
      },
      {
        title: "Description",
        dataIndex: 2,
        key: "2"
      }
    ];

    return (
      <div className="wrapper">
        <div className="main">
          <div className="title">Harmonized Tariff Schedule Code</div>
          <div className="header">
            <div className="header__searchBox">
              <Search
                placeholder="input query"
                enterButton="Search"
                size="large"
                onSearch={value => this.handleSubmit(value)}
              />
            </div>
            <div className="button_Container">
              <div className="button">
                <Button
                  type="primary"
                  icon="api"
                  size={"small"}
                  onClick={this.handleUpdateLocal}
                >
                  Local Update
                </Button>
              </div>

              <div className="button">
                <Button
                  type="primary"
                  icon="cloud-download"
                  size={"small"}
                  onClick={this.handleUpdateOnline}
                >
                  Update Database
                </Button>
              </div>
            </div>
            {this.state.extractedCSV != null && this.state.flag === 0 && (
              <CSVLink data={this.state.extractedCSV}>
                <Button type="primary" icon="download" size={"large"}>
                  Download
                </Button>
              </CSVLink>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div className="button">
              <button
                style={{ fontSize: "0.8em" }}
                type="button"
                className="btn btn-success btn-block"
                onClick={this.manualUploadHandler}
              >
                Upload
              </button>
              <input
                style={{ fontSize: "0.8em" }}
                type="file"
                name="file"
                onChange={this.onChangeHandler}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "1em"
            }}
          >
            {this.state.hit_list.length} results
          </div>
          <Table
            dataSource={this.state.extractedTable}
            columns={columns}
            childrenColumnName={"10"}
            rowKey={"9"}
            rowClassName={record =>
              this.state.hit_list.includes(record[9]) ? "highlightHit" : "null"
            }
          />
        </div>
        <div
          style={{ display: this.state.loading ? "flex" : "none" }}
          className="wrapper__overlay"
        >
          <div className="spinner">
            <RiseLoader
              css={override}
              size={20}
              color={"#4AA6F9"}
              loading={this.state.loading}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
