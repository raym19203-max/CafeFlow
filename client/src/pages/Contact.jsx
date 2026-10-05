import "../styles/contact.css";
import Navbar from "../components/Navbar";
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setSubmitted(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { name, email, subject, message } = formData;

    // Check empty fields
    if (!name || !email || !subject || !message) {
      alert("Please fill all fields.");
      return;
    }

    // Check email
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      console.log("Sending contact data:", formData);

      const response = await fetch(
        "http://localhost:5000/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log("Contact API response:", data);

      if (response.ok) {
        setSubmitted(true);

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        alert(
          data.message ||
            "Could not send message."
        );
      }
    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      alert("Server connection failed.");
    }
  }

  return (
    <>
      <Navbar
        cartCount={0}
        onCartClick={() => {}}
      />

      <div className="contact-page">

        {/* =========================
            TITLE
        ========================= */}

        <div className="contact-title">
          <h1>Get in Touch</h1>

          <p>
            We'd love to hear from you. Send us a message!
          </p>
        </div>


        <div className="contact-container">

          {/* =========================
              LEFT SIDE
          ========================= */}

          <div className="contact-info">

            <div className="info-box">

              <span>📍</span>

              <div>
                <h3>Address</h3>

                <p>The Square Cafe</p>
                <p>123 Main Street</p>
                <p>Your City, State 12345</p>
              </div>

            </div>


            <div className="info-box">

              <span>📞</span>

              <div>
                <h3>Phone</h3>

                <p>+1 (234) 567-890</p>
              </div>

            </div>


            <div className="info-box">

              <span>✉️</span>

              <div>
                <h3>Email</h3>

                <p>info@thesquare.com</p>
              </div>

            </div>


            <div className="hours-box">

              <h3>Hours of Operation</h3>

              <p>
                Monday - Friday: 9:00 AM - 10:00 PM
              </p>

              <p>
                Saturday: 10:00 AM - 11:00 PM
              </p>

              <p>
                Sunday: 10:00 AM - 9:00 PM
              </p>

            </div>

          </div>


          {/* =========================
              RIGHT SIDE FORM
          ========================= */}

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>Subject</label>

              <input
                type="text"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>Message</label>

              <textarea
                name="message"
                placeholder="Your message here..."
                rows="5"
                value={formData.message}
                onChange={handleChange}
              ></textarea>

            </div>


            <button
              type="submit"
              className="send-btn"
            >
              ➤ Send Message
            </button>


            {/* Success Message */}

            {submitted && (
              <p
                style={{
                  color: "green",
                  textAlign: "center",
                  marginTop: "15px",
                  fontWeight: "600",
                }}
              >
                ✅ Message sent successfully!
              </p>
            )}

          </form>

        </div>

      </div>
    </>
  );
}

export default Contact;