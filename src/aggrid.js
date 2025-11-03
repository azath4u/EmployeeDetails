import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import "./App.css";


const getPeople = () => [
  {
    id: 1,
    name: "azath",
    dob: "07-04-1986",
    age: 40,
    gender: "",
    mail: "azath4u@gmail.com",
    status: true,
    city:"karur"
  },
  {
    id: 2,
    name: "naveen",
    dob: "15-08-1985",
    age: 39,
    gender: "",
    mail: "xxxx@gmail.com",
    status: true,
    city:"karur",
  },
  {
    id: 3,
    name: "ayesha",
   dob: "15-08-1985",
    age: 34,
    gender: "",
    mail: "yyyy@gmail.com",
    status: true,
    city:"coimbatore",
  },
];


const getColumns = () => [
  { columnId: "id", width: 100,resizable:true},
  { columnId: "name", width: 150,resizable:true },
  { columnId: "dob", width: 150 },
  { columnId: "age", width: 100 },
  { columnId: "gender", width: 100 },
  { columnId: "mail", width: 150 },
  { columnId: "status", width: 150 },
  {columnId:"city",width:100}
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
    {type:"header",text:"City"}
  ],
};
const options = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];
const highlights=[{columnId:"name",rowId:"0",borderColor:"#00ff00"}]

const getRows = (people, opencell) => [
  headerRow,
  ...people.map((person, index) => {
    if(index === 0) {
    console.log("Gender from get rows:", person.gender, "Index:",  index);
    }
    return {
      rowId: index.toString(),
      cells: [
        { type: "number", value: person.id,groupId:"A" },
        { type: "text", text: person.name,groupId:"B" },
        { type: "date", date: new Date(person.dob),groupId:"C" },
        { type: "number", value: person.age,groupId:"D" },
        {
          type: "dropdown",
          values: options,

          selectedValue: person.gender,
          isOpen: opencell === index.toString(),
          groupId:"E",
        },
        {
          type: "email",
          text: person.mail,
          renderer: (text) => {
            const isValid = /\S+@\S+\.\S+/.test(text);
          return <span style={{ color: isValid?"green":"red" }}>{text}</span>
          },groupId:"F"
        },
        {
          type: "checkbox",
          checked: person.status,
          checkedText: "Married",
          uncheckedText: "Single",
         groupId:"G",
        },
      {
        type:"text",
        text:person.city||"",
        groupId:"H",
      },
      ],
    };
  }),
];

export default function App() {
const[columns,setColumns]=useState(getColumns());
 const handleColumnResize = (columnId, width) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex((el) => el.columnId === columnId);
      
      if (columnIndex === -1) return prevColumns;
      const updatedColumns = [...prevColumns];
     
      updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], width };
      
      return updatedColumns;
    });
  };

  const [people, setPeople] = useState(()=>{
    const saved=localStorage.getItem("peopleData");
    return saved?JSON.parse(saved):getPeople();
  });
  const [opencell, setOpencell] = useState(null);
const[selectlocationId,setselectedlocationId]=useState(null);
useEffect(()=>{
  localStorage.setItem("peopleData",JSON.stringify(people))
},[people])

  const rows = useMemo(() => {
        return getRows(people, opencell);
  }, [people, opencell]) ;
  //const columns = useMemo(() => getColumns(), []);

const addNewRow=useCallback(()=>{
  console.log("Ali");
  const newId=people.length+1;
  const newperson={
    id: newId,
    name: "",
    dob: "",
    age:"" ,
    gender: "",
    mail: "",
    status: false,
    city:"",
  };
   const newList=[...people,newperson]
  setPeople(newList);
},[people])
 
  const handleChanges = useCallback((changes) => {
 
    const updated = [...people];
let shouldAddRow = false;
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
else if(change.columnId==="city"){
  updated[rowIndex].city=change.newCell.text;
}
  if (
        rowIndex === people.length - 1 &&
        (change.newCell.text?.trim() ||
          change.newCell.date ||
          change.newCell.value ||
          change.newCell.selectedValue)
      ) {
        shouldAddRow = true;
      }
    });

    setPeople(updated);

    if (shouldAddRow) {
      addNewRow();
    }
  },
  [people, addNewRow] 
);

const handlefocus=(location)=>{
setselectedlocationId(location.rowId);
}

const handleDelete=()=>{
const updated=people.filter((_,index)=>index.toString()!==selectlocationId).map((person,index)=>({
  ...person,id:index+1
}));
setPeople(updated);
}


/*ContextMenu on RightClick*/
const simpleHandleContextMenu=(selectedRowIds,
                              selectedColumnIds,  
                              selectionMode,
                              menuOptions,
                              selectedRanges
) =>{
  return menuOptions;
};


  return (
    <div style={{ padding: 20, border:"2px solid black"}} className="react-Grid">
      <h2>Employee Details</h2>
      <ReactGrid
        rows={rows}
        columns={columns}
        highlights={highlights}
        onCellsChanged={handleChanges}
 labels={{
          copyLabel: "📋 Copy me!",
          pasteLabel: "📥 Paste me!",
          cutLabel: "✂️ Cut me!",
         
         
        }}
        //stickyTopRows={1}
        onFocusLocationChanged={handlefocus}
        onColumnResized={handleColumnResize}
        enableRangeSelection={true}
        enableColumnSelection={true}
        enableRowSelection={true}
        enableGroupIdRender={false}
        onContextMenu={simpleHandleContextMenu}
       
      />
    
<div className="button-container">
        <button onClick={handleDelete}>Delete Row</button>
        <button onClick={addNewRow}>Add NewRow</button>
        </div>
        </div>
    

  );
}