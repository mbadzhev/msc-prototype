import { useState, useEffect } from "react";

export default function App() {
  const [showLecturerDash, setShowLecturerDash] = useState(true);

  const [data, setData] = useState(null);
  const [getLoading, setGetLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patchLoading, setPatchLoading] = useState(false);
  const [itemIdInput, setItemIdInput] = useState("");

  const apiUri = "http://localhost:5000/lecturer/";

  async function fetchData() {
    try {
      const response = await fetch(apiUri);
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      const responseData = await response.json();
      setData(responseData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setGetLoading(false);
    }
  }

  const generateCode = async (classId) => {
    setPatchLoading(true);

    try {
      const response = await fetch(`${apiUri}/${classId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setPatchLoading(false);
    }
  };

  const swapStudentAttendance = async (classId) => {
    setPatchLoading(true);
    const studentId = itemIdInput;

    try {
      const response = await fetch(`${apiUri}/${classId}/${studentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setPatchLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDahsboard = () => {
    setShowLecturerDash(!showLecturerDash);
  };

  return (
    <>
      <div>
        <button onClick={toggleDahsboard}>
          Show {showLecturerDash ? "student" : "lecturer"} bashboard.
        </button>
        {showLecturerDash ? (
          <div className="lecturerDiv">
            {getLoading && <div>Loading...</div>}
            {error && (
              <div>{`There is a problem fetching the requested data - ${error}`}</div>
            )}
            <div className="event">
              {data &&
                data.map((item) => (
                  <ul key={item._id}>
                    {item.module}
                    <li>Date: {item.date}</li>
                    <li>ID: {item._id}</li>
                    <li>Absent: {item.studentsAbsent}</li>
                    <li>Present: {item.studentsPresent}</li>
                    {item.tokens &&
                      item.tokens.map((token) => (
                        <div key={token._id}>
                          <li>Code: {token.code}</li>
                          <li>DateTime: {token.dateTime}</li>
                        </div>
                      ))}
                    <button
                      onClick={() => generateCode(item._id)}
                      disabled={patchLoading}
                    >
                      {patchLoading ? "Loading..." : "Generate code"}
                    </button>
                    <input
                      type="text"
                      value={itemIdInput}
                      onChange={(e) => setItemIdInput(e.target.value)}
                    />
                    <button
                      onClick={() => swapStudentAttendance(item._id)}
                      disabled={patchLoading}
                    >
                      {patchLoading ? "Loading..." : "Swap student appendance"}
                    </button>
                  </ul>
                ))}
            </div>
          </div>
        ) : (
          <div>Student Div</div>
        )}
      </div>
    </>
  );
}
