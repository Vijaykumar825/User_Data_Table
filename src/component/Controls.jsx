import React from "react";

export default function Controls({
  search,
  setSearch,
  emailDomain,
  setEmailDomain,
  emailDomains,
  firstLetter,
  setFirstLetter,
  firstLetters,
  sortKey,
  setSortKey,
  sortDir,
  setSortDir,
  pageSize,
  setPageSize,
  onReset,
}) {
  return (
    <section className="controls">
      <input
        className="input"
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="select"
        value={emailDomain}
        onChange={(e) => setEmailDomain(e.target.value)}
      >
        <option value="">All domains</option>
        {emailDomains.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <select
        className="select"
        value={firstLetter}
        onChange={(e) => setFirstLetter(e.target.value)}
      >
        <option value="">Any first letter</option>
        {firstLetters.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      <select
        className="select"
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value)}
      >
        <option value="first_name">Sort by First Name</option>
        <option value="email">Sort by Email</option>
      </select>
      <button
        className="btn"
        onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
      >
        {sortDir === "asc" ? "Asc" : "Desc"}
      </button>

      <select
        className="select"
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        <option value={6}>6 / page</option>
        <option value={12}>12 / page</option>
        <option value={24}>24 / page</option>
      </select>

      <button className="btn light" onClick={onReset}>
        Reset
      </button>
    </section>
  );
}
