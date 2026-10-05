import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function EsewaSuccess() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const verificationStarted = useRef(false);

  const [message, setMessage] =
    useState("Verifying payment...");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {

    if (verificationStarted.current) {
       return;
    }

    verificationStarted.current = true;

    const data =
      searchParams.get("data");

    console.log("eSewa Data:", data);

    if (!data) {

      setMessage(
        "Payment information is missing."
      );

      return;
    }

    fetch(
      `http://localhost:5000/api/esewa/verify` +
      `?data=${encodeURIComponent(data)}`
    )

      .then(async (res) => {

        const result =
          await res.json();

        console.log(
          "Verification result:",
          result
        );

        return result;

      })

      .then((result) => {

        if (result.success) {

          setSuccess(true);

          setMessage(
            "Payment Successful!"
          );

        } else {

          setMessage(
            result.message ||
            "Payment verification failed."
          );

        }

      })

      .catch((error) => {

        console.error(
          "Verification Error:",
          error
        );

        setMessage(
          "Unable to verify payment."
        );

      });

  }, [searchParams]);

  return (

    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >

      {success ? (

        <>

          <h1
            style={{
              color: "green",
            }}
          >
            🟢 Payment Successful
          </h1>

          <h2>
            Thank you for your payment 😊
          </h2>

          <p>
            Your eSewa payment has been
            verified successfully.
          </p>

          <button
            onClick={() => navigate("/")}
          >
            Back to Menu
          </button>

        </>

      ) : (

        <>

          <h1>
            💳 eSewa Payment
          </h1>

          <h2>
            {message}
          </h2>

        </>

      )}

    </div>

  );

}

export default EsewaSuccess;



