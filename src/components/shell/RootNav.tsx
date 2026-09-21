import { NavLink } from "react-router-dom";

/**
 * NEW FILE — not from any of the 4 ZIPs.
 *
 * None of the four modules shipped a production nav: dashboard and
 * threat-intel have no nav at all (self-contained pages), and the
 * sidebars in new-investigation's and sentineltrace's own App.tsx files
 * were explicitly authored as throwaway demo shells ("reference only").
 * Some minimal way to move between the 4 pages is required for one
 * integrated app to be testable, so this bar is intentionally plain and
 * theme-neutral — it does not copy, restyle, or compete with any
 * module's own visual identity. Swap it for the team's real app shell
 * whenever that's designed; nothing else in the routes depends on it.
 */
const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/investigate/new", label: "New Investigation" },
  { to: "/investigate/threat-intel", label: "Threat Intel & Geo" },
  { to: "/investigate/detail", label: "Investigation Detail" },
];

export default function RootNav() {
  return (
    <nav
      style={{
        display: "flex",
        gap: 16,
        padding: "10px 16px",
        background: "#000",
        borderBottom: "1px solid #222",
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
      }}
    >
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          style={({ isActive }) => ({
            color: isActive ? "#fff" : "#888",
            textDecoration: "none",
          })}
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
