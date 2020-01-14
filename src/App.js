import React from "react";
import { remove } from "lodash";
import * as moment from "moment";
import { Table, Button, Input, Upload, message } from "antd";
import { RiseLoader } from "react-spinners";
import socketIOClient from "socket.io-client";

import {
  getTable,
  updateDatabase,
  updateFromLocal,
  uploadFromLocal,
  getLastUpdate
} from "./api/query";

import "antd/dist/antd.css";
import "./App.css";

const { Search } = Input;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      value: "",
      extractedTable: null,
      loading: false,
      hit_list: [],
      expandedList: [], //Workaround for default expansion
      selectedFile: null,
      lastUpdated: ""
    };
  }

  componentDidMount = async () => {
    this.updateTimestamp();
  };

  uploadHandler = event => {
    setTimeout(() => {
      event.onSuccess("ok");
    }, 0);
    this.setState(
      {
        loading: true,
        selectedFile: event.file
      },
      async () => {
        const data = new FormData();
        data.append("csvFile", this.state.selectedFile);
        var res = await uploadFromLocal(data);
        this.setState({ loading: !res });
        message.success(`File uploaded successfully`);
      }
    );
  };

  onChangeHandler = event => {
    console.log(event);
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  handleSubmit = async value => {
    this.setState({ loading: true });
    var { extractedTable, hit_list, ancestor_list } = await getTable(value);
    // console.log(ancestor_list)
    this.setState({
      extractedTable: extractedTable,
      loading: false,
      hit_list: hit_list,
      expandedList: ancestor_list
    });
  };

  handleUpdateOnline = async () => {
    const socket = socketIOClient("http://localhost:3001"); //This connects to socket.io
    socket.open(); //Opens the socket manually so that there is no delay.
    socket.on("processed", res => {
      console.log(res);
      this.setState({
        loading: false,
        status: "Searching"
      });
      if (res === false) {
        alert("Unable to update database. Please try again later.");
      }
      this.updateTimestamp();
      socket.disconnect();
    });
    socket.on("status", res => {
      console.log(res.status);
      this.setState({
        status: res.status
      });
    });

    this.setState({ loading: true });
    var res = await updateDatabase();
    if (res.data !== true) {
      alert("Unable to send request.");
    }
  };

  handleUpdateLocal = async () => {
    this.setState({ loading: true });
    var res = await updateFromLocal();
    this.setState({
      loading: !res
    });
  };

  manualUploadHandler = async () => {
    this.setState({ loading: true });
    const data = new FormData();
    data.append("csvFile", this.state.selectedFile);
    var res = await uploadFromLocal(data);
    console.log(res);
    this.setState({
      loading: !res
    });
  };

  expand = (expanded, record) => {
    if (expanded) {
      this.setState(state => {
        const expandedList = state.expandedList.concat(record[9]);
        return {
          expandedList
        };
      });
    } else {
      this.setState(state => {
        const expandedList = remove(state.expandedList, index => {
          if (index === record[9]) {
            return false;
          }
          return true;
        });
        return {
          expandedList
        };
      });
    }
  };

  updateTimestamp = async () => {
    let timestamp = await getLastUpdate();
    var date = moment(timestamp.data);
    var lastUpdated = date
      .utc()
      .local()
      .format("MMMM Do YYYY, h:mm:ss a");
    this.setState({
      lastUpdated: lastUpdated
    });
  };

  render() {
    return (
      <div className="wrapper">
        <div className="main">
          <div className="title">Harmonized Tariff Schedule Code</div>
          <div
            stlye={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end"
            }}
          >
            <div className="header">
              <div>
                <Search
                  placeholder="input query"
                  enterButton="Search"
                  size="large"
                  onSearch={value => this.handleSubmit(value)}
                />
              </div>
              <div>
                <div style={{ margin: "0 0 0 0.7rem" }}>
                  Last update: {this.state.lastUpdated}
                </div>
                <div className="button_Container">
                  <Button
                    type="primary"
                    icon="api"
                    size={"small"}
                    onClick={this.handleUpdateLocal}
                    style={{ margin: "0.7em" }}
                  >
                    Local Update
                  </Button>
                  <Button
                    type="primary"
                    icon="cloud-download"
                    size={"small"}
                    onClick={this.handleUpdateOnline}
                    style={{ margin: "0.7em" }}
                  >
                    Update Database
                  </Button>
                </div>
              </div>
            </div>
            <div>hello</div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "1em"
            }}
          >
            {/* <Button
              style={{ fontSize: "0.8em" }}
              type="button"
              className="btn btn-success btn-block"
              onClick={this.manualUploadHandler}
            >
              Upload
            </Button> */}
            <Upload customRequest={this.uploadHandler}>
              <Button>Click to Upload</Button>
            </Upload>
            {/* <input
              style={{ fontSize: "0.8em" }}
              type="file"
              name="file"
              onChange={this.onChangeHandler}
            /> */}
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
            expandRowByClick={true}
            expandedRowKeys={this.state.expandedList}
            onExpand={this.expand}
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
          <RiseLoader
            css={override}
            size={20}
            color={"#4AA6F9"}
            loading={this.state.loading}
          />
          <div style={{ color: "white", padding: "1rem" }}>
            {this.state.status}
          </div>
        </div>
      </div>
    );
  }
}

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

const override = `
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default App;
