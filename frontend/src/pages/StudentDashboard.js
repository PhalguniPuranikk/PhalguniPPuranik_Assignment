import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState({ courseId: "", comment: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/courses")
      .then(res => setCourses(res.data))
      .catch(() => setMessage("Error fetching courses"));
  }, []);

  const enrollCourse = async (id) => {
    try {
      const userId = localStorage.getItem("userId"); // we'll store after login
      const res = await axios.post(`http://localhost:5000/api/courses/enroll/${id}`, { userId });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error enrolling");
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.post("http://localhost:5000/api/feedback/add", {
        userId,
        courseId: feedback.courseId,
        comment: feedback.comment
      });
      setMessage(res.data.message);
      setFeedback({ courseId: "", comment: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error submitting feedback");
    }
  };

  return (
   
  <div className="container">
    <h2>📚 Student Dashboard</h2>
    {message && <p>{message}</p>}

    <h3>Available Courses</h3>
    <ul>
      {courses.map((course) => (
        <li key={course._id} style={{ marginBottom: "10px" }}>
          <b>{course.title}</b> - {course.description}
          <button onClick={() => enrollCourse(course._id)} style={{ marginLeft: "10px" }}>
            Enroll
          </button>
        </li>
      ))}
    </ul>

    <h3>Give Feedback</h3>
    <form onSubmit={submitFeedback}>
      <select
        value={feedback.courseId}
        onChange={(e) => setFeedback({ ...feedback, courseId: e.target.value })}
        required
      >
        <option value="">Select Course</option>
        {courses.map(course => (
          <option key={course._id} value={course._id}>
            {course.title}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Write your feedback..."
        value={feedback.comment}
        onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
        required
      />
      <button type="submit">Submit Feedback</button>
    </form>
  </div>
);
}

export default StudentDashboard;