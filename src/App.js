import React from "react";
import { Table, Button, Input } from "antd";
import { RiseLoader } from "react-spinners";

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
      selectedFile: null
    };
  }

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
      hit_list: hit_list
    });
    window.topicText = (JSON.stringify(hit_list));
    


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
            expandRowByClick = {true}
            // defaultExpandedRowKeys =  {this.state.hit_list} // this do not work  // below manually works...      
            expandedRowKeys =  {this.state.hit_list} // this works, but breaks expandibility
            // defaultExpandedRowKeys= {"8243,8440,8442,8451,8463,8748,8755,9213,9836,9837,9838,9839,9843,9846,9847,9857,9858,9859,9860,9865,9866,9877,9878,9879,9880,9884,9887,9888,9892,9893,9894,9895,9899,9902,9903,9926,9930,9931,9932,9939,9940,9941,9942,9952,9953,9954,9961,9962,9963,9964,9974,9975,9976,9983,9984,9985,9986,9998,9999,10000,10001,10012,10013,10014,10015,10026,10027,10028,10029,10037,10042,10053,10054,10055,10056,10057,10060,10061,10062,10066,10068,10101,10102,10129,10135,10136,10152,10158,10202,10209,10211,10234,10235,10252,10254,10256,10262,14566,14772,14792,15557,18724,18752,18758,18894,18897,18962,19087,19102,19131,19135,19148,19149,19152,19155,19181,23125,23273,24693,24694,29329,29430,31628,31629,31630,31631,31632,31633,31634,31635,31779,31780,31781,31782,31783,31784,31785,31786,31787,31788,31789,31790,31791,31792,31794,31798,31799,31807,31811,31812,31891,32121,32122,32217,32229,32230"} // this
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
