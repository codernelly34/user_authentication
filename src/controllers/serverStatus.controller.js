const serverInfo = (req, res) => {
  res.status(200).json({
    info: "You will be getting information about the server from hare the is no info for now because we are still working on the server",
    status: {
      status: "Server is running",
      version: "1.0.0",
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    },
  });
};

const serverStatus = (req, res) => {
  res.status(200).json({
    status: "Server is running",
    version: "1.0.0",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
};

export { serverStatus, serverInfo };
