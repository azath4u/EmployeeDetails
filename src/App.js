import React, { useState } from "react";

// Step 1: Define your menu options
const menuOptions = [
  {
    id: "addRow",
    label: "Add Row",
    handler: (selectedRowIds, selectedColIds, selectionMode, selectedRanges, setData) => {
      const newRow = { id: Date.now().toString(), name: "New Row" };
      setData((prev) => [...prev, newRow]);
      console.log("✅ Row added:", newRow);
    },
  },
  {
    id: "deleteRow",
    label: "Delete Row",
    handler: (selectedRowIds, selectedColIds, selectionMode, selectedRanges, setData) => {
      setData((prev) => prev.filter((row) => !selectedRowIds.includes(row.id)));
      console.log("🗑 Deleted row(s):", selectedRowIds);
    },
  },
  {
    id: "copyCell",
    label: "Copy Cell",
    handler: (selectedRowIds, selectedColIds, selectionMode, selectedRanges) => {
      console.log("📋 Copying cells:", selectedRanges);
      alert("Copied cell range: " + JSON.stringify(selectedRanges));
    },
  },
];

// Step 2: Component
function App() {
  const [data, setData] = useState([
    { id: "row-1", name: "John" },
    { id: "row-2", name: "Jane" },
  ]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Step 3: Show context menu on right-click
  const handleRightClick = (event, row) => {
    event.preventDefault();
    setSelectedRow(row);
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  // Step 4: Handle menu click
  const handleMenuClick = (option) => {
    option.handler([selectedRow.id], [], "row", [[{ rowId: selectedRow.id }]], setData);
    setContextMenu(null);
  };

  // Step 5: Hide menu when clicking outside
  const handleClickAway = () => setContextMenu(null);

  return (
    <div onClick={handleClickAway} style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h2>🧩 Real-Time Menu Example</h2>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "50%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} onContextMenu={(e) => handleRightClick(e, row)}>
              <td>{row.id}</td>
              <td>{row.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Step 6: Custom context menu */}
      {contextMenu && (
        <ul
          style={{
            position: "absolute",
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            listStyle: "none",
            padding: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {menuOptions.map((option) => (
            <li
              key={option.id}
              onClick={() => handleMenuClick(option)}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
