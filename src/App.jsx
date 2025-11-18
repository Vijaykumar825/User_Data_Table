import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./component/Header";
import Controls from "./component/Controls";
import UserTable from "./component/UserTable";
import Pagination from "./component/Pagination";
import Footer from "./component/Footer";
import Spinner from "./component/Spinner";
import ErrorBanner from "./component/ErrorBanner";

const API_BASE = "https://reqres.in/api/users";

function App() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // controls
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("first_name"); // 'first_name' | 'email'
  const [sortDir, setSortDir] = useState("asc"); // 'asc' | 'desc'
  const [emailDomain, setEmailDomain] = useState("");
  const [firstLetter, setFirstLetter] = useState("");
  const [pageSize, setPageSize] = useState(6);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        // First call to get total_pages
        const firstRes = await fetch(`${API_BASE}?page=1`, {
          headers: { "x-api-key": "reqres-free-v1" },
        });
        if (!firstRes.ok) {
          // Try local fallback if unauthorized or other failure
          try {
            const mock = await fetch("/mock_users.json");
            if (mock.ok) {
              const mockJson = await mock.json();
              setAllUsers(mockJson.data || []);
              setError("Using local mock data (API blocked or unauthorized).");
              return;
            }
          } catch (_) {
            // ignore and throw original error below
          }
          throw new Error("Failed to fetch users");
        }
        const firstJson = await firstRes.json();
        const totalPages = firstJson.total_pages || 1;
        const combined = [...(firstJson.data || [])];
        if (totalPages > 1) {
          const pagePromises = [];
          for (let p = 2; p <= totalPages; p++) {
            pagePromises.push(
              fetch(`${API_BASE}?page=${p}`, {
                headers: { "x-api-key": "reqres-free-v1" },
              }).then((r) => {
                if (!r.ok) throw new Error(`Failed to fetch page ${p}`);
                return r.json();
              })
            );
          }
          const results = await Promise.allSettled(pagePromises);
          let hadReject = false;
          results.forEach((res) => {
            if (res.status === "fulfilled") {
              const j = res.value;
              combined.push(...(j.data || []));
            } else {
              hadReject = true;
            }
          });
          if (hadReject && combined.length > 0) {
            setError("Some pages failed to load. Showing partial results.");
          }
        }
        setAllUsers(combined);
      } catch (e) {
        // Final fallback if everything failed
        try {
          const mock = await fetch("/mock_users.json");
          if (mock.ok) {
            const mockJson = await mock.json();
            setAllUsers(mockJson.data || []);
            setError("Using local mock data (API unreachable).");
          } else {
            setError(e.message || "Error fetching users");
          }
        } catch (_) {
          setError(e.message || "Error fetching users");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // derive domain options and first-letter options
  const emailDomains = useMemo(() => {
    const s = new Set();
    allUsers.forEach((u) => {
      const parts = (u.email || "").split("@");
      if (parts[1]) s.add(parts[1].toLowerCase());
    });
    return Array.from(s).sort();
  }, [allUsers]);

  const firstLetters = useMemo(() => {
    const s = new Set();
    allUsers.forEach((u) => {
      const c = (u.first_name || "").charAt(0).toUpperCase();
      if (c) s.add(c);
    });
    return Array.from(s).sort();
  }, [allUsers]);

  // filtering + search
  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    return allUsers.filter((u) => {
      const name = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
      const mail = (u.email || "").toLowerCase();
      if (text && !(name.includes(text) || mail.includes(text))) return false;
      if (emailDomain) {
        const domain = (u.email || "").split("@")[1]?.toLowerCase();
        if (domain !== emailDomain) return false;
      }
      if (firstLetter) {
        const fl = (u.first_name || "").charAt(0).toUpperCase();
        if (fl !== firstLetter) return false;
      }
      return true;
    });
  }, [allUsers, search, emailDomain, firstLetter]);

  // sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = (a[sortKey] || "").toString().toLowerCase();
      const bv = (b[sortKey] || "").toString().toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // pagination (client-side)
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  useEffect(() => {
    // reset to page 1 when filters/search/sort/pageSize changes
    setPage(1);
  }, [search, emailDomain, firstLetter, sortKey, sortDir, pageSize]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="container">
      <Header />

      <Controls
        search={search}
        setSearch={setSearch}
        emailDomain={emailDomain}
        setEmailDomain={setEmailDomain}
        emailDomains={emailDomains}
        firstLetter={firstLetter}
        setFirstLetter={setFirstLetter}
        firstLetters={firstLetters}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortDir={sortDir}
        setSortDir={setSortDir}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onReset={() => {
          setSearch("");
          setEmailDomain("");
          setFirstLetter("");
          setSortKey("first_name");
          setSortDir("asc");
          setPageSize(6);
        }}
      />

      {error && <ErrorBanner message={error} />}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <UserTable
            paged={paged}
            sortKey={sortKey}
            sortDir={sortDir}
            toggleSort={toggleSort}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;
