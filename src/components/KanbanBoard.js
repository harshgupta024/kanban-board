import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/styles.css"; // Correctly importing styles.css

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState("status"); // Default grouping
  const [sortOrder, setSortOrder] = useState("priority"); // Default sorting
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For dropdown visibility

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        console.log(response.data); // Log response data for debugging
        setTickets(response.data.tickets || []); // Accessing tickets array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Grouping logic
  const groupTickets = (tickets) => {
    if (!Array.isArray(tickets)) {
      console.error("Expected tickets to be an array, but got:", tickets);
      return {};
    }

    return tickets.reduce((groups, ticket) => {
      const groupKey = grouping === "user" ? ticket.userId : ticket[grouping];
      (groups[groupKey] = groups[groupKey] || []).push(ticket);
      return groups;
    }, {});
  };

  // Sort tickets based on priority and title
  const sortTickets = (tickets) => {
    return [...tickets].sort((a, b) => {
      if (sortOrder === "priority") {
        return b.priority - a.priority; // Higher priority first
      } else if (sortOrder === "title") {
        return a.title.localeCompare(b.title); // Alphabetical order
      }
      return 0; // No sorting if neither condition is met
    });
  };

  // Group and sort tickets
  const groupedTickets = groupTickets(tickets);
  const sortedTickets = sortTickets(Object.values(groupedTickets).flat());

  return (
    <div className="kanban-board">
      <nav className="navbar">
        <div className="dropdown">
          <button
            className="dropbtn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Display
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <h4>Grouping</h4>
              <div className="dropdown-buttons">
                <button onClick={() => setGrouping("status")}>By Status</button>
                <button onClick={() => setGrouping("user")}>By User</button>
                <button onClick={() => setGrouping("priority")}>
                  By Priority
                </button>
              </div>
              <h4>Ordering</h4>
              <div className="dropdown-buttons">
                <button onClick={() => setSortOrder("priority")}>
                  By Priority
                </button>
                <button onClick={() => setSortOrder("title")}>By Title</button>
              </div>
            </div>
          )}
        </div>
        <h1 className="navbar-title">Kanban Board</h1> {/* Centered Title */}
      </nav>

      {/* Display grouped tickets with headings */}
      <div className="ticket-groups-container">
        {Object.entries(groupedTickets).map(([key, group]) => (
          <div key={key} className="ticket-group">
            <h2 className="ticket-group-heading">{key}</h2>{" "}
            {/* Right-aligned heading */}
            <div className="ticket-container">
              {sortTickets(group).map((ticket) => (
                <div className="card" key={ticket.id}>
                  <h3>{ticket.title}</h3>
                  <p>Status: {ticket.status}</p>
                  <p>Assigned to: {ticket.userId}</p>{" "}
                  {/* Display userId or map to user name */}
                  <p>Priority: {getPriorityLabel(ticket.priority)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get priority label
const getPriorityLabel = (priority) => {
  switch (priority) {
    case 4:
      return "Urgent";
    case 3:
      return "High";
    case 2:
      return "Medium";
    case 1:
      return "Low";
    case 0:
      return "No Priority";
    default:
      return "Unknown";
  }
};

export default KanbanBoard;
