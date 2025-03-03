import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import PropTypes from "prop-types";

const auth = getAuth(app);
const db = getFirestore(app);

const Navbar = ({ role, setRole }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleRole = async () => {
    const newRole = role === "driver" ? "passenger" : "driver";
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, "users", user.uid), { role: newRole });
      setRole(newRole);
      navigate(newRole === "driver" ? "/driver-dashboard" : "/dashboard");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <header className="bg-white shadow">
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="text-gray-500 focus:outline-none lg:hidden"
            onClick={toggleDrawer}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
          <span className="text-3xl font-bold text-gray-900 ml-4 lg:ml-0">
            EasyRide
          </span>
          <nav className="hidden lg:flex items-center ml-8">
            <Link
              to="/dashboard"
              className="mr-4 text-blue-500 hover:underline"
            >
              Home
            </Link>
            <Link to="/bookings" className="mr-4 text-blue-500 hover:underline">
              Bookings
            </Link>
            {role === "driver" && (
              <Link
                to="/manage-bookings"
                className="mr-4 text-blue-500 hover:underline"
              >
                Manage Bookings
              </Link>
            )}
            <button
              onClick={toggleRole}
              className="ml-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Switch to {role === "driver" ? "Passenger" : "Driver"} Dashboard
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="ml-4 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      {isDrawerOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
          <div className="fixed inset-y-0 left-0 flex max-w-full">
            <div className="w-64 bg-white shadow-xl">
              <div className="px-4 py-6">
                <button
                  className="text-gray-500 focus:outline-none"
                  onClick={toggleDrawer}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <nav className="mt-6">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-blue-500 hover:underline"
                    onClick={toggleDrawer}
                  >
                    Home
                  </Link>
                  <Link
                    to="/bookings"
                    className="block px-4 py-2 text-blue-500 hover:underline"
                    onClick={toggleDrawer}
                  >
                    Bookings
                  </Link>
                  {role === "driver" && (
                    <Link
                      to="/manage-bookings"
                      className="block px-4 py-2 text-blue-500 hover:underline"
                      onClick={toggleDrawer}
                    >
                      Manage Bookings
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      toggleRole();
                      toggleDrawer();
                    }}
                    className="block w-full text-left px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Switch to {role === "driver" ? "Passenger" : "Driver"}{" "}
                    Dashboard
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

Navbar.propTypes = {
  role: PropTypes.string.isRequired,
  setRole: PropTypes.func.isRequired,
};

export default Navbar;
