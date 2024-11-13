import React, { useState, useEffect } from "react";
import { open, readFile, readDir } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/plugin-fs";

const FileSystem = () => {
  const [imageSrcs, setImageSrcs] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    displayAllImages();
  }, []);

  async function saveImageToFile(event) {
    if (!event.target.files) return;

    const file = event.target.files[0];
    try {
      const arrayBuffer = await file.arrayBuffer();
      const byteArray = new Uint8Array(arrayBuffer);

      const fileName = file.name;
      console.log(fileName);

      const fileWriter = await open(`images/${fileName}`, {
        write: true,
        create: true,
        baseDir: BaseDirectory.Desktop,
      });

      await fileWriter.write(byteArray);
      await fileWriter.close();

      setStatus("Image saved successfully!");
      displayAllImages();  
    } catch (error) {
      console.error("Error saving image:", error);
      setStatus("Error saving image.");
    }
  }

  async function displayAllImages() {
    try {
      const entries = await readDir("images", { baseDir: BaseDirectory.Desktop });
      const imageFiles = entries.filter((entry) => entry.name?.match(/\.(jpg|jpeg|png|gif)$/i));

      const imageUrls = await Promise.all(
        imageFiles.map((file) => getImageUrl(file.name!))
      );
      console.log(imageUrls,"h");
      
      setImageSrcs(imageUrls);
    } catch (error) {
      console.error("Error reading directory:", error);
      setStatus("Error loading images.");
    }
  }

  async function getImageUrl(fileName: string): Promise<string> {
    try {
      const imageBuffer = await readFile(`images/${fileName}`, {
        baseDir: BaseDirectory.Desktop,
      });
      const blob = new Blob([new Uint8Array(imageBuffer)], { type: "image/jpeg" });
      const base64String = await convertBlobToBase64(blob);
      return base64String;
    } catch (error) {
      console.error("Error reading image file:", error);
      return "";
    }
  }

  function convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  return (
    <div>
      <h1>Upload and Display Images</h1>
      <input type="file" accept="image/*" onChange={saveImageToFile} />
      {status && <p>{status}</p>}

      <h2>Saved Images:</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {imageSrcs.length > 0 ? (
          imageSrcs.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Saved ${index}`}
              style={{ maxWidth: "150px", height: "auto" }}
            />
          ))
        ) : (
          <p>No images to display</p>
        )}
      </div>
    </div>
  );
};

export default FileSystem;
