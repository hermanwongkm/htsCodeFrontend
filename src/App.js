import React from "react";
import { Table, Button, Input } from "antd";
import { RiseLoader } from "react-spinners";
import { remove } from "lodash";
import {
  getTable,
  updateDatabase,
  updateFromLocal,
  uploadFromLocal
} from "./api/query";

import "antd/dist/antd.css";
import "./App.css";

const { Search } = Input;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      extractedTable: null,
      loading: false,
      hit_list: [],
      expandedList: [], //Workaround for default expansion
      selectedFile: null
    };
  }

  componentDidUpdate = () => {
    console.log("Updated");
  };

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  handleSubmit = async value => {
    this.setState({ loading: true });
    var { extractedTable, hit_list } = await getTable(value);
    this.setState({
      extractedTable: extractedTable,
      loading: false,
      hit_list: hit_list,
      expandedList: [...hit_list]
    });
  };

  handleUpdateOnline = async () => {
    this.setState({ loading: true });
    var res = await updateDatabase();
    this.setState({
      loading: !res
    });
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

  render() {
    return (
      <div className="wrapper">
        <div className="main">
          <div className="title">Harmonized Tariff Schedule Code</div>
          <div className="header">
            <div>
              <Search
                placeholder="input query"
                enterButton="Search"
                size="large"
                onSearch={value => this.handleSubmit(value)}
              />
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

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
