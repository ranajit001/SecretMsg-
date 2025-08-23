export const frontedUrl = "http://localhost:5173";

export const cookiesOptions = {
      httpOnly: true,   // prevents JS access (recommended for security)
    secure: true,    // true if using HTTPS (for localhost, keep false)
    sameSite: "strict", // allow cross-site requests
    path: "/", 
}