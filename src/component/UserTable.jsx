import React from "react";

export default function UserTable({ paged, sortKey, sortDir, toggleSort }) {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th className="sortable" onClick={() => toggleSort("first_name")}>
              First Name{" "}
              {sortKey === "first_name" && (
                <span className="sort">{sortDir === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
            <th>Last Name</th>
            <th className="sortable" onClick={() => toggleSort("email")}>
              Email{" "}
              {sortKey === "email" && (
                <span className="sort">{sortDir === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty">
                No users found.
              </td>
            </tr>
          ) : (
            paged.map((u) => (
              <tr key={u.id}>
                <td>
                  <img
                    className="avatar"
                    src={u.avatar}
                    alt={`${u.first_name} ${u.last_name}`}
                  />
                </td>
                <td>{u.first_name}</td>
                <td>{u.last_name}</td>
                <td>
                  <a href={`mailto:${u.email}`}>{u.email}</a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
