import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("https://reqres.in/api/users", {
          headers: { "x-api-key": "reqres-free-v1" },
        });
        console.log("Response:", res); // <- CHECK THIS
        const data = await res.json();
        console.log(data); // <- CHECK THIS
        setUsers(data.data);
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Users</h1>
      {users.map((user) => (
        <p key={user.id}>{user.email}</p>
      ))}
    </div>
  );
}
