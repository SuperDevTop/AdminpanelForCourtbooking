let backendUrl;

if (process.env.NODE_ENV === "development") {
  console.log("development env");
  // backendUrl = "http://localhost:5000";
  backendUrl = "http://ec2-18-221-87-111.us-east-2.compute.amazonaws.com";
} else {
  console.log("production env");
  // backendUrl = "https://courtbooking.vercel.app";
  backendUrl = "http://ec2-18-221-87-111.us-east-2.compute.amazonaws.com";
}

export { backendUrl };
