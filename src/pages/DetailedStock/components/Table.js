import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { format } from "../utils";

const CustomRow = withStyles({
  root: {
    background: "#1A1E2B",
    "&:nth-child(even)": {
      background: "#131721"
    }
  }
})(TableRow);

const CustomCell = withStyles({
  root: {
    border: "none",
    padding: "12px 20px",
    color: "white",
    fontSize: "14px",
    borderRadius: "4px",
    "&:last-child": {
      textAlign: "right"
    }
  }
})(TableCell);

const ModTable = (props) => {
  return (
    <Table>
      {Object.keys(props.table).map((name) => {
        const key = props.table[name];
        return (
          <CustomRow>
            <CustomCell>{name}</CustomCell>
            <CustomCell>
              {format(
                key,
                props.meta.meta[key],
                props.meta.attrs_slug_to_name[key]
                  ? props.meta.attrs_slug_to_name[key].type
                  : {}
              )}
            </CustomCell>
          </CustomRow>
        );
      })}
    </Table>
  );
};

export default ModTable;
