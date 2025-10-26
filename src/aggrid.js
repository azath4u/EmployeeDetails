import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

const getPeople = () => [
  {
    id: 1,
    name: "azath",
    dob: "07-04-1986",
    age: 40,
    gender: "",
    mail: "azath4u@gmail.com",
    status: true,
  },
  {
    id: 2,
    name: "naveen",
    dob: "15-08-1985",
    age: 39,
    gender: "",
    mail: "xxxx@gmail.com",
    status: true,
  },
  {
    id: 3,
    name: "ayesha",
    dob: "15-08-1985",
    age: 33,
    gender: "",
    mail: "yyyy@gmail.com",
    status: true,
  },
];

const getColumns = () => [
  { columnId: "id", width: 100 },
  { columnId: "name", width: 150 },
  { columnId: "dob", width: 150 },
  { columnId: "age", width: 100 },
  { columnId: "gender", width: 100 },
  { columnId: "mail", width: 150 },
  { columnId: "status", width: 150 },
];

const headerRow = {
  rowId: "header",
  cells: [
    { type: "header", text: "Id" },
    { type: "header", text: "Name" },
    { type: "header", text: "Date Of Birth" },
    { type: "header", text: "Age" },
    { type: "header", text: "Gender" },
    { type: "header", text: "Email" },
    { type: "header", text: "Married" },
  ],
};
const options = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];
const getRows = (people, opencell) => [
  headerRow,
  ...people.map((person, index) => {
    if(index === 0) {
    console.log("Gender from get rows:", person.gender, "Index:",  index);
    }
    return {
      rowId: index.toString(),
      cells: [
        { type: "number", value: person.id },
        { type: "text", text: person.name },
        { type: "date", date: new Date(person.dob) },
        { type: "number", value: person.age },
        {
          type: "dropdown",
          values: options,

          selectedValue: person.gender,
          isOpen: opencell === index.toString(),
        },
        {
          type: "email",
          text: person.mail,
          renderer: (text) => {
            const isValid = /\S+@\S+\.\S+/.test(text);
          return <span style={{ color: isValid?"green":"red" }}>{text}</span>
          },
        },
        {
          type: "checkbox",
          checked: person.status,
          checkedText: "Married",
          uncheckedText: "Single",
        },
      ],
    };
  }),
];

export default function App() {
  const [people, setPeople] = useState(()=>{
    const saved=localStorage.getItem("peopleData");
    return saved?JSON.parse(saved):getPeople();
  });
  const [opencell, setOpencell] = useState(null);
useEffect(()=>{
  localStorage.setItem("peopleData",JSON.stringify(people))
},[people])

  const rows = useMemo(() => {
        return getRows(people, opencell);
  }, [people, opencell]) ;
  const columns = useMemo(() => getColumns(), []);
  /*const handlefocus = (location) => {
    //console.log("Loaction",location);
   if (location && location.columnId === "gender") {
      setOpencell(location.rowId);
    } else {
      setOpencell(false);
    }
};*/
  const handleChanges = useCallback((changes) => {
    //console.log("changes:",changes);
    const updated = [...people];
    changes.forEach((change) => {
      const rowIndex = parseInt(change.rowId, 10);

      if (change.columnId === "name") {
        updated[rowIndex].name = change.newCell.text;
      } else if (change.columnId === "dob") {
        updated[rowIndex].dob = change.newCell.date;
      } else if (change.columnId === "age") {
        updated[rowIndex].age = change.newCell.value;
      } else if (change.columnId === "gender") {
        // to set the changed value
        const newGender = change.newCell.selectedValue;
        if (newGender !== change.previousCell.selectedValue) {
          updated[rowIndex].gender = newGender;
        }
        // to open a dropdown
        if (change.newCell.isOpen) {
          setOpencell(change.rowId);
        } else {
          setOpencell(null);
        }
      } else if (change.columnId === "mail") {
        console.log("New email cell", change.newCell);
        
        updated[rowIndex].mail = change.newCell.text;
      } else if (
        change.columnId === "status" &&
        change.newCell.checked !== undefined
      ) {
        updated[rowIndex].status = change.newCell.checked;
      }
    });

    setPeople(updated);
  }, [people]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Employee Details</h2>
      <ReactGrid
        rows={rows}
        columns={columns}
        onCellsChanged={handleChanges}
        //onFocusLocationChanged={handlefocus}
        enableRangeSelection={true}
      />
    </div>
  );
}
