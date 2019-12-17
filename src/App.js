import React from "react";
import { Table, Button } from "antd";
import { getTable, updateDatabase } from "./api/query";
import { CSVLink } from "react-csv";
import { ClimbingBoxLoader } from "react-spinners";

import "antd/dist/antd.css";
import "./App.css";

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
      loading: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  async handleSubmit(event) {
    this.setState({ loading: true });
    event.preventDefault(); //onSubmit has its own internal state, and thus refreshing the page
    var { extractedTable } = await getTable(this.state.value);
    this.setState({
      extractedTable: extractedTable,
      loading: false
    });
  }

  async handleUpdate() {
    console.log("Updating databse");
    var res = await updateDatabase();
  }

  render() {
    const columns = [
      {
        title: "HTS Code",
        dataIndex: "0",
        key: "0"
      },
      {
        title: "Suffix",
        dataIndex: "1",
        key: "1"
      },
      {
        title: "Description",
        dataIndex: "2",
        key: "2"
      }
    ];
    return (
      <div className="wrapper">
        <div className="main">
          <div className="title">Harmonized Tariff Schedule Code</div>
          <div className="header">
            <div className="header__searchBox">
              <form onSubmit={this.handleSubmit}>
                <label>
                  Query:
                  <input
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                  />
                </label>
                <input
                  style={{ margin: "10px" }}
                  type="submit"
                  value="Submit"
                />
              </form>
            </div>
            <div>
              <Button
                type="primary"
                icon="api"
                size={"large"}
                onClick={this.handleUpdate}
              >
                Update Database
              </Button>
            </div>
            {this.state.extractedCSV != null && this.state.flag === 0 && (
              <CSVLink data={this.state.extractedCSV}>
                <Button type="primary" icon="download" size={"large"}>
                  Download
                </Button>
              </CSVLink>
            )}
          </div>

          <Table dataSource={this.state.extractedTable} columns={columns} />
        </div>
        <div
          style={{ display: this.state.loading ? "flex" : "none" }}
          className="wrapper__overlay"
        >
          <div className="spinner">
            <ClimbingBoxLoader
              css={override}
              size={20}
              color={"#36ffcd"}
              loading={this.state.loading}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
