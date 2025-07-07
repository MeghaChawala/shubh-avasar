import useAuth from "@/hooks/useAuth";

export default function Checkout() {
  useAuth(); // Redirects to /login if not authenticated

  return (
    <div>
      <h1>Checkout Page - Only for logged-in users</h1>
      {/* Your checkout form and details */}
    </div>
  );
}
