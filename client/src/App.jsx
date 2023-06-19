import { useState, useEffect } from "react";

export default function App() {
  const [showLecturerDash, setShowLecturerDash] = useState(true);

  const [data, setData] = useState(null);
  const [getLoading, setGetLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patchLoading, setPatchLoading] = useState(false);
  const [itemIdInput, setItemIdInput] = useState("");

  const [dataStudent, setDataStudent] = useState(null);
  const [codeStudent, setCodeStudent] = useState("");
  const numberStudent = 18600219;

  const apiUri = "http://localhost:5000/lecturer/";
  const apiUriStudent = "http://localhost:5000/student/";

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

  async function fetchStudentData() {
    try {
      const response = await fetch(apiUriStudent);
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      const responseData = await response.json();
      setDataStudent(responseData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setDataStudent(null);
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
      fetchData();
    } catch (error) {
      setError(error.message);
    } finally {
      setPatchLoading(false);
    }
  };

  const markStudentAttendance = async (classId, number, code) => {
    setPatchLoading(true);

    try {
      const response = await fetch(
        `${apiUriStudent}/${classId}/${number}/${code}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update data");
      }
      fetchStudentData();
    } catch (error) {
      setError(error.message);
    } finally {
      setPatchLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStudentData();
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
                    {item.studentsAbsent &&
                      item.studentsAbsent.map((student) => (
                        <div key={student._id}>
                          Absent Students:
                          <li>Name: {student.name}</li>
                          <li>Student Number: {student.number}</li>
                        </div>
                      ))}
                    {item.studentsPresent &&
                      item.studentsPresent.map((student) => (
                        <div key={student._id}>
                          Present Students:
                          <li>Name: {student.name}</li>
                          <li>Student Number: {student.number}</li>
                        </div>
                      ))}
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
          <div className="studentDiv">
            {getLoading && <div>Loading...</div>}
            {error && (
              <div>{`There is a problem fetching the requested data - ${error}`}</div>
            )}
            <div className="event">
              {dataStudent &&
                dataStudent.map((item) => (
                  <ul key={item._id}>
                    {item.module}
                    <li>Date: {item.date}</li>
                    <li>ID: {item._id}</li>
                    {item.studentsAbsent &&
                      item.studentsAbsent.map(
                        (student) =>
                          student.number === numberStudent && (
                            <div key={student._id}>
                              <li>Name: {student.name}</li>
                              <li>Student Number: {student.number}</li>
                              <li>Status: Absent</li>
                            </div>
                          )
                      )}
                    {item.studentsPresent &&
                      item.studentsPresent.map(
                        (student) =>
                          student.number === numberStudent && (
                            <div key={student._id}>
                              <li>Name: {student.name}</li>
                              <li>Student Number: {student.number}</li>
                              <li>Status: Present</li>
                            </div>
                          )
                      )}
                    <input
                      type="text"
                      value={codeStudent}
                      onChange={(e) => setCodeStudent(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        markStudentAttendance(
                          item._id,
                          numberStudent,
                          codeStudent
                        )
                      }
                      disabled={patchLoading}
                    >
                      {patchLoading ? "Loading..." : "Mark as present"}
                    </button>
                  </ul>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
