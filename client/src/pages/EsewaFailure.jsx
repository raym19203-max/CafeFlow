import { useNavigate } from "react-router-dom";

function EsewaFailure() {

  const navigate = useNavigate();

  return (

    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >

      <h1 style={{ color: "red" }}>
        ❌ Payment Failed
      </h1>

      <p>
        Your eSewa payment was not completed.
      </p>

      <button
        onClick={() => navigate("/")}
      >
        Back to Menu
      </button>

    </div>

  );

}

export default EsewaFailure;