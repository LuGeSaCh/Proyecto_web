import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    axios
      .get("http://localhost:3000/api")
      .then((res) => {
        if (!mounted) return;
        const payload = res.data?.users ?? res.data;
        setUsers(Array.isArray(payload) ? payload : payload ? [payload] : []);
      })
      .catch(() => {
        if (mounted) setUsers([]); // no romper si falla la API
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {users.length === 0 ? (
          <li>No hay usuarios</li>
        ) : (
          users.map((u, i) => (
            <li key={u.id ?? u._id ?? i}>
              {typeof u === "string"
                ? u
                : u.name ?? u.username ?? u.email ?? JSON.stringify(u)}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
