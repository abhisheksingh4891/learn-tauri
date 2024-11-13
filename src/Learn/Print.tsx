// src/components/PrintComponent.tsx

import React, { useEffect, useState } from "react";
import {
  printers,
  print,
  print_file,
  jobs,
  job,
  restart_job,
  pause_job,
  resume_job,
  remove_job,
} from "tauri-plugin-printer";

type PrintData = {
  type: "text" | "image" | "barCode" | "qrCode" | "table";
  url?: string;
  value?: string;
  position?: "left" | "center" | "right";
  width?: string | number;
  height?: string | number;
  style?: { [key: string]: string };
  displayValue?: boolean;
  fontsize?: number;
  tableHeader?: (string | { type: string; value: string })[];
  tableBody?: (string | { type: string; value: string; url?: string })[][];
  tableFooter?: (string | { type: string; value: string })[];
  tableHeaderStyle?: { [key: string]: string };
  tableBodyStyle?: { [key: string]: string };
  tableFooterStyle?: { [key: string]: string };
};

const PrintComponent = () => {
  const [printerList, setPrinterList] = useState([]); // Assuming `printers` returns an array
  const [selectedPrinter, setSelectedPrinter] = useState(null);

//   useEffect(() => {
//     const fetchPrinters = async () => {
//       try {
//         const list = await printers();
//         setPrinterList(list);
//         setSelectedPrinter(list[0] || null); // Set default printer
//       } catch (error) {
//         console.error("Failed to fetch printers:", error);
//       }
//     };
//     fetchPrinters();
//   }, []);

  const handlePrintData = async () => {
    try {
      // Get the list of printers
      const printerList = await printers();

      // Define your print data with numeric width/height values
      const data: PrintData[] = [
        {
          type: "image",
          url: "https://randomuser.me/api/portraits/men/43.jpg",
          position: "center",
          width: 160,
          height: 60,
        },
        {
          type: "text",
          value: "SAMPLE HEADING",
          style: { fontWeight: "700", textAlign: "center", fontSize: "24px" },
        },
        {
          type: "text",
          value: "Secondary text",
          style: {
            textDecoration: "underline",
            fontSize: "10px",
            textAlign: "center",
            color: "red",
          },
        },
        {
          type: "barCode",
          value: "023456789010",
          height: 40,
          width: 2,
          displayValue: true,
          fontsize: 12,
        },
        {
          type: "qrCode",
          value: "https://github.com/Hubertformin/electron-pos-printer",
          height: 55,
          width: 55,
          style: { margin: "10px 20px 20px 20px" },
        },
        {
          type: "table",
          style: { border: "1px solid #ddd" },
          tableHeader: ["Animal", "Age"],
          tableBody: [
            ["Cat", "2"],
            ["Dog", "4"],
            ["Horse", "12"],
            ["Pig", "4"],
          ],
          tableFooter: ["Animal", "Age"],
          tableHeaderStyle: { backgroundColor: "#000", color: "white" },
          tableBodyStyle: { border: "0.5px solid #ddd" },
          tableFooterStyle: { backgroundColor: "#000", color: "white" },
        },
        // Add other data structures here as needed
      ];

      // Print the data
      await print(data, {
        id: printerList[0].id,
        preview: true,
        page_size: {
          width: 300,
          height: 400,
        },
        print_setting: {
          orientation: "landscape",
          method: "simplex",
          paper: "A4",
          scale: "noscale",
          repeat: 1,
          range: { from: 1, to: 3 },
        },
      });
    } catch (error) {
      console.error("Printing error:", error);
    }
  };

  const handlePrintFile = async () => {
    if (selectedPrinter) {
      try {
        await print_file({
          id: selectedPrinter,
          path: "F:/path/to/file.pdf",
          print_setting: {
            orientation: "landscape",
            method: "simplex",
            paper: "A4",
            scale: "noscale",
            repeat: 1,
          },
        });
      } catch (error) {
        console.error("Failed to print file:", error);
      }
    } else {
      console.error("No printer selected");
    }
  };

  return (
    <div>
      <h2>Available Printers</h2>
      <select
        onChange={(e) => setSelectedPrinter(e.target.value)}
        value={selectedPrinter || ""}
      >
        {printerList.map((printer, index) => (
          <option key={index} value={printer}>
            {printer}
          </option>
        ))}
      </select>

      <button onClick={handlePrintData}>Print Sample Data</button>
      <button onClick={handlePrintFile}>Print PDF File</button>
    </div>
  );
};

export default PrintComponent;
