import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [internships, setInternships] = useState([]);

  const [resume, setResume] = useState(null);

  const [skills, setSkills] = useState([]);

  const calculateMatch = (requiredSkills) => {

    const matched = requiredSkills.filter(
      (skill) =>
        skills.includes(skill)
    );

    const percentage = Math.floor(
      (matched.length / requiredSkills.length) * 100
    );

    return percentage;

  }

  useEffect(() => {

    fetchInternships();

  }, []);

  const fetchInternships = async () => {

    try {

      const response = await axios.get(
        "https://smart-internship-backend-isxp.onrender.com/internships"
      );

      setInternships(response.data);

    } catch(error) {

      console.log(error);

    }

  }


  const applyInternship = async (item) => {

    try {

      const response = await axios.post(
        "https://smart-internship-backend-isxp.onrender.com/apply",
        {
          studentEmail: "student@gmail.com",
          company: item.company,
          role: item.role
        }
      );

      alert(response.data.message);

    } catch(error) {

      alert("Application Failed");

    }

  }

  const uploadResume = async () => {

    if(!resume) {

     alert("Please select a file");

     return;

    }

   const formData = new FormData();

   formData.append("resume", resume);

   try {

     const response = await axios.post(
       "https://smart-internship-backend-isxp.onrender.com/upload-resume",
       formData
      );

     alert(response.data.message);

     setSkills(response.data.skills);

    } catch(error) {

      alert("Upload Failed");

    }

  }



  return (

    <div className="min-h-screen bg-gray-100">

      <nav className="bg-blue-600 text-white p-4 text-2xl font-bold">
        SkillMatch AI
      </nav>

      <div className="bg-white m-6 p-6 rounded-xl shadow-md">
      

        <h2 className="text-2xl font-bold mb-4">
          Upload Resume
        </h2>

      <input
        type="file"
        onChange={(e) => setResume(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={uploadResume}
        className="bg-green-600 text-white px-4 py-2 rounded"
        >
        Upload Resume
      </button>
     
    </div>

    <div className="bg-white m-6 p-6 rounded-xl shadow-md">

      <h2 className="text-2xl font-bold mb-4">
        Upload Resume
      </h2>

      <input
        type="file"
        accept=".txt"
        onChange={(e) => {
          console.log(e.target.files[0]);
          setResume(e.target.files[0]);
        }}
      />

      <button
        onClick={uploadResume}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >

        Upload Resume
      </button>

    </div>

    <div className="p-10 grid md:grid-cols-3 gap-6">

        {internships.map((item, index) => (

          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg"
          >

            <h2 className="text-2xl font-bold mb-2">
              {item.company}
            </h2>

            <p className="mb-2">
              {item.role}
            </p>

            <p className="text-gray-500 mb-4">
              {item.location}
            </p>

            <p className="text-green-600 font-bold mb-4">

              Match Score:
              {calculateMatch(item.skills)}%

            </p>

            <button
              onClick={() => applyInternship(item)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Apply
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Dashboard