let inputValue = "";
const subject = "Website Project Submission";

const createEmailBody = (input) => {
  const body = `
Hello,

I'd like to submit the following information:
* Input: ${value}
* Date: ${new Date().toLocaleDateString()}

Thank you,
${input}`;

  return body;
};

const handleSubmit = (event) => {
  // Get the input value
  const formInput = document.querySelector('input[name="name"]');
  const value = formInput.value.trim();

  // Validate input if needed
  if (!value) {
    alert("Please enter your input before submitting");
    return;
  }

  // Open email client with the input value in the body

  const mailtoLink = `mailto:example@example.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(createEmailBody(value))}`;

  window.location.href = mailtoLink;
};

// Add event listener to the submit button
document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", handleSubmit);
});
