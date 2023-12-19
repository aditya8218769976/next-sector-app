"use client";

import React, { useState, useEffect } from "react";

interface Sector {
  value: string;
  label: string;
}

interface FormData {
  name: string;
  sectors: string[];
  agree: boolean;
}

const Home: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [agree, setAgree] = useState<boolean>(false);
  const [savedDataList, setSavedDataList] = useState<FormData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/sectors.json")
      .then((response) => response.json())
      .then((data: Sector[]) => setSectors(data))
      .catch((error) => console.error("Error loading sectors:", error));
  }, []);

  const handleSave = () => {
    if (!name || selectedSectors.length === 0 || !agree) {
      alert("Please fill in all fields and agree to terms.");
      return;
    }
    const dataToSave: FormData = { name, sectors: selectedSectors, agree };

    if (editingIndex !== null) {
      const updatedList = [...savedDataList];
      updatedList[editingIndex] = dataToSave;
      setSavedDataList(updatedList);
      setEditingIndex(null);
    } else {
      setSavedDataList([...savedDataList, dataToSave]);
    }
    setName("");
    setSelectedSectors([]);
    setAgree(false);
  };

  const handleEdit = (index: number) => {
    const dataToEdit = savedDataList[index];
    setName(dataToEdit.name);
    setSelectedSectors(dataToEdit.sectors);
    setAgree(dataToEdit.agree);
    setEditingIndex(index);
  };

  return (
    <div className="container bg-slate-500 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Next.js App</h1>

      <h2 className="mt-4">Please enter your name and pick the Sectors you are currently involved in.</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-black-700"><strong>Name:</strong></label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white text-black"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-black-700">
          <strong>Sectors:</strong>
        </label>
        <select
          multiple
          size={5}
          value={selectedSectors}
          onChange={(e) =>
            setSelectedSectors(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white text-black"
        >
          {sectors.map((sector) => (
            <option className="hover:bg-gray-400 cursor-pointer" key={sector.value} value={sector.value}>
              {sector.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-black-700">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
            className="mr-2"
          />
          <strong>Agree to terms!</strong>
        </label>
      </div>

      <div className="mb-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-700"
        >
          Save
        </button>
      </div>
      {savedDataList.length > 0 && (
        <div className="mb-4 mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white text-black">
          <h2>
            <strong> Saved Data:</strong>
          </h2>
          <ul>
            {savedDataList.map((savedData, index) => (
              <li key={index}>
                <div className="mb-4 mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white text-black">
                  <div className="flex gap-2">
                    <strong>
                      <h3>Name:</h3>
                    </strong>
                    {savedData.name}{" "}
                  </div>
                  <div className="flex gap-2">
                    <strong>
                      <h3>Sectors: </h3>
                    </strong>
                    {savedData.sectors.map((sector) => {
                      const selectedSector = sectors.find(
                        (s) => s.value === sector
                      );
                      return selectedSector ? selectedSector.label : "";
                    })}
                  </div>
                  <div className="flex gap-2">
                    <strong>
                      <h3>Agree to terms: </h3>
                    </strong>
                    {savedData.agree ? "Yes" : "No"}
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-500 ml-2 underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
