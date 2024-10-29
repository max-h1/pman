import React from "react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <a href="/profile">Profile</a>
      <button>All Entries</button>
      <button>Starred</button>
      Vaults
      <button>Personal</button>
      <button>Work</button>
      <button>Uni</button>
    </div>
  );
}

export default Sidebar;
